import { ClusterOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Collapse, Input, Radio, Row, Tooltip } from 'antd'
import React, { Component } from 'react'
import Utils from '../../utils/Utils'

export interface INodeToAdd {
    remoteNodeIpAddress: string
    captainIpAddress: string
    nodeType: string
    privateKey: string
    sshPort: string
    sshUser: string
}

export default class AddNode extends Component<
    {
        leaderIp: string
        isMobile: boolean
        onAddNodeClicked: (nodeToAdd: INodeToAdd) => void
    },
    {
        nodeToAdd: INodeToAdd
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            nodeToAdd: {
                remoteNodeIpAddress: '',
                sshPort: '22',
                sshUser: 'root',
                captainIpAddress: props.leaderIp || '',
                nodeType: 'worker',
                privateKey: '',
            },
        }
    }

    changeModel(childField: string, value: string) {
        const nodeToAdd = Utils.copyObject(this.state.nodeToAdd) as any
        nodeToAdd[childField] = value
        this.setState({ nodeToAdd })
    }

    render() {
        const self = this
        const nodeToAdd = self.state.nodeToAdd

        return (
            <div>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Añadir nuevo nodo"
                >
                    <Row justify="space-between">
                        <Col lg={{ span: 11 }} xs={{ span: 24 }}>
                            <Input
                                style={{ marginBottom: 10 }}
                                addonBefore="Nueva IP del nodo"
                                placeholder="123.123.123.123"
                                type="text"
                                value={nodeToAdd.remoteNodeIpAddress}
                                onChange={(e) =>
                                    self.changeModel(
                                        'remoteNodeIpAddress',
                                        e.target.value
                                    )
                                }
                            />
                        </Col>
                        <Col lg={{ span: 11 }} xs={{ span: 24 }}>
                            <Input
                                style={{ marginBottom: 10 }}
                                addonBefore="Dirección IP Spacecloud"
                                placeholder="123.123.123.123"
                                type="text"
                                value={nodeToAdd.captainIpAddress}
                                onChange={(e) =>
                                    self.changeModel(
                                        'captainIpAddress',
                                        e.target.value
                                    )
                                }
                            />
                        </Col>
                        <Col span={24} style={{ marginTop: 10 }}>
                            <div style={{ paddingBottom: 5 }}>
                                &nbsp;Clave privada SSH para <b>root</b>
                                &nbsp;
                                <Tooltip title="Utilice la clave RSA. Otros tipos, como Ed25519, no son compatibles, para estos utilice el método alternativo a continuación.">
                                    <InfoCircleOutlined
                                        style={{
                                            paddingTop: 8,
                                            paddingLeft: 8,
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            <Input.TextArea
                                style={{ marginBottom: 20 }}
                                className="code-input"
                                rows={6}
                                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;MIICWwIBAAKBgQDArfs81aizq8ckg16e+ewFgJg7J..."
                                value={nodeToAdd.privateKey}
                                onChange={(e) =>
                                    self.changeModel(
                                        'privateKey',
                                        e.target.value
                                    )
                                }
                            />
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Radio.Group
                            defaultValue="a"
                            buttonStyle="outline"
                            style={{ marginBottom: 20 }}
                            value={nodeToAdd.nodeType}
                            onChange={(e) =>
                                self.changeModel('nodeType', e.target.value)
                            }
                        >
                            <Radio.Button value="worker">
                                Unirse como nodo esclavo
                            </Radio.Button>
                            <Radio.Button value="manager">
                                Unirse como nodo principal
                            </Radio.Button>
                        </Radio.Group>
                        &nbsp;
                        <Tooltip title="Sugerencia: por cada 5 trabajadores, agregue 2 nodos de administrador, manteniendo el recuento de nodos de administrador como un número impar. Por lo tanto, use el nodo trabajador para los primeros 4 nodos que agregue a su clúster.">
                            <InfoCircleOutlined
                                style={{ paddingTop: 8, paddingLeft: 8 }}
                            />
                        </Tooltip>
                    </Row>

                    <Row justify="end">
                        <Col
                            lg={{ span: 6 }}
                            xs={{ span: 24 }}
                            style={{ maxWidth: 250 }}
                        >
                            <Input
                                addonBefore="Puerto SSH"
                                type="text"
                                value={nodeToAdd.sshPort}
                                onChange={(e) =>
                                    self.changeModel('sshPort', e.target.value)
                                }
                            />
                        </Col>
                        <Col
                            lg={{ span: 6 }}
                            xs={{ span: 24 }}
                            style={{ maxWidth: 250, marginLeft: 10 }}
                        >
                            <Tooltip title="El uso de usuarios no root con acceso sudo NO funcionará. Si desea utilizar una cuenta que no sea raíz, debe poder ejecutar los comandos de la ventana acoplable sin sudo. O simplemente use el método alternativo a continuación.">
                                <Input
                                    addonBefore="Usuario SSH"
                                    type="text"
                                    value={nodeToAdd.sshUser}
                                    onChange={(e) =>
                                        self.changeModel(
                                            'sshUser',
                                            e.target.value
                                        )
                                    }
                                />
                            </Tooltip>
                        </Col>
                        <Button
                            style={{ marginLeft: 10 }}
                            type="primary"
                            block={this.props.isMobile}
                            onClick={() =>
                                self.props.onAddNodeClicked(
                                    self.state.nodeToAdd
                                )
                            }
                        >
                            <ClusterOutlined /> &nbsp; Unirse al cluster
                        </Button>
                    </Row>
                    <div style={{ height: 50 }} />
                    <Collapse>
                        <Collapse.Panel header="Alternative Method" key="1">
                            <p>
                            CapRover usa SSH para conectarse a sus nodos y
                                 hacer que se unan al grupo. A veces, esto
                                 el proceso no funciona debido a SSH no estándar
                                 configuraciones como puertos personalizados, nombres de usuario personalizados,
                                 y etc.
                            </p>
                            <p>
                            En estos casos, será mucho más sencillo ejecutar
                                 los comandos manualmente desde un SSH
                                 sesión. Primero, de su{' '}
                                 <b>nodo líder principal</b>, ejecute lo siguiente
                                 dominio:
                            </p>
                            <code>docker swarm join-token worker</code>

                            <p style={{ marginTop: 20 }}>
                            Saldrá algo como esto:
                            </p>
                            <code>
                            Para agregar un trabajador a este enjambre, ejecute lo siguiente
                                 dominio:
                                 <br />
                                 docker swarm join --token
                                SWMTKN-secret-token-here 127.0.0.1:2377
                            </code>
                            <p style={{ marginTop: 20 }}>
                            Luego, copie el comando de la salida de arriba,
                                 y simplemente desde el nodo trabajador, ejecute eso
                                 dominio.
                            </p>
                            <p style={{ marginTop: 20 }}>
                            Luego, copie el comando de la salida de arriba,
                                 y simplemente desde el nodo trabajador, ejecute eso
                                 dominio.
                                <code>
                                    {' '}
                                    --advertise-addr WORKER_EXTERNAL_IP:2377
                                </code>
                                . Ver{' '}
                                <a
                                    href="https://github.com/caprover/caprover/issues/572"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {' '}
                                    este problema{' '}
                                </a>{' '}
                                para más detalles.
                            </p>
                        </Collapse.Panel>
                    </Collapse>
                </Card>
            </div>
        )
    }
}
