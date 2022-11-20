import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Row, Tooltip } from 'antd'
import { Component } from 'react'
import {
    IRegistryApi,
    IRegistryInfo,
    IRegistryTypes
} from '../../models/IRegistryInfo'
import Utils from '../../utils/Utils'
import PasswordField from '../global/PasswordField'

const ADDING_LOCAL = 'ADDING_LOCAL'
const ADDING_REMOTE = 'ADDING_REMOTE'

export default class DockerRegistryAdd extends Component<
    {
        apiData: IRegistryApi
        addDockerRegistry: (dockerRegistry: IRegistryInfo) => void
        isMobile: boolean
    },
    {
        modalShowing: 'ADDING_LOCAL' | 'ADDING_REMOTE' | undefined
        remoteRegistryToAdd: IRegistryInfo
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            modalShowing: undefined,
            remoteRegistryToAdd: this.getPlainRegistryInfo(),
        }
    }

    getPlainRegistryInfo(): IRegistryInfo {
        return {
            id: '',
            registryUser: '',
            registryPassword: '',
            registryDomain: '',
            registryImagePrefix: '',
            registryType: IRegistryTypes.REMOTE_REG,
        }
    }

    render() {
        const self = this

        const hasSelfHostedRegistry =
            this.props.apiData.registries
                .map((reg) => reg.registryType)
                .indexOf(IRegistryTypes.LOCAL_REG) >= 0

        return (
            <div>
                <Modal
                    title="Registro auto-hospedado"
                    okText="Habilitar registro auto-hospedado"
                    onCancel={() => self.setState({ modalShowing: undefined })}
                    onOk={() => {
                        self.setState({ modalShowing: undefined })
                        self.props.addDockerRegistry({
                            registryType: IRegistryTypes.LOCAL_REG, // Other values are getting ignored by the downstream callback
                        } as IRegistryInfo)
                    }}
                    visible={self.state.modalShowing === ADDING_LOCAL}
                >
                    <p>
                    Puede leer más sobre este tipo de registro en el
                         página detrás de este modal, específicamente en "Más información"
                         sección. ¿Desea continuar y habilitar el alojamiento propio?
                         Registro Docker?
                    </p>
                </Modal>

                <Modal
                    title="Registro remoto"
                    okText="Añadir registro remoto"
                    onCancel={() => self.setState({ modalShowing: undefined })}
                    onOk={() => {
                        self.setState({ modalShowing: undefined })
                        self.props.addDockerRegistry(
                            self.state.remoteRegistryToAdd
                        )
                    }}
                    visible={self.state.modalShowing === ADDING_REMOTE}
                >
                    <p>
                    Puede leer más sobre este tipo de registro en el
                         página detrás de este modal, específicamente en "Más información"
                         sección.
                    </p>
                    <div style={{ height: 20 }} />
                    <div style={{ maxWidth: 360 }}>
                        <Input
                            addonBefore="Nombre de usuario"
                            placeholder="usuario | email@gmail.com"
                            type="email"
                            value={self.state.remoteRegistryToAdd.registryUser}
                            onChange={(e) => {
                                const newData = Utils.copyObject(
                                    self.state.remoteRegistryToAdd
                                )
                                newData.registryUser = e.target.value.trim()
                                self.setState({ remoteRegistryToAdd: newData })
                            }}
                        />
                        <div style={{ height: 20 }} />
                        <PasswordField
                            addonBefore="Contraseña"
                            placeholder="mypassword"
                            defaultValue={
                                self.state.remoteRegistryToAdd.registryPassword
                            }
                            onChange={(e) => {
                                const newData = Utils.copyObject(
                                    self.state.remoteRegistryToAdd
                                )
                                newData.registryPassword = e.target.value
                                self.setState({ remoteRegistryToAdd: newData })
                            }}
                        />
                        <div style={{ height: 20 }} />
                        <Input
                            addonBefore="Dominio"
                            placeholder="registry-1.docker.io"
                            type="text"
                            value={
                                self.state.remoteRegistryToAdd.registryDomain
                            }
                            onChange={(e) => {
                                const newData = Utils.copyObject(
                                    self.state.remoteRegistryToAdd
                                )
                                newData.registryDomain = e.target.value.trim()
                                self.setState({ remoteRegistryToAdd: newData })
                            }}
                        />
                        <div style={{ height: 20 }} />
                        <Input
                            addonBefore="Prefijo de imagen"
                            placeholder="usuario"
                            addonAfter={
                                <Tooltip title="Sus imágenes se etiquetarán como RegistryDomain/ImagePrefix/ImageName. Para la mayoría de los proveedores, el prefijo de la imagen es exactamente su nombre de usuario, a menos que el campo DOMINIO sea específico para usted, en ese caso, este prefijo está vacío.">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            }
                            type="text"
                            value={
                                self.state.remoteRegistryToAdd
                                    .registryImagePrefix
                            }
                            onChange={(e) => {
                                const newData = Utils.copyObject(
                                    self.state.remoteRegistryToAdd
                                )
                                newData.registryImagePrefix =
                                    e.target.value.trim()
                                self.setState({ remoteRegistryToAdd: newData })
                            }}
                        />
                    </div>
                </Modal>

                <div className={hasSelfHostedRegistry ? 'hide-on-demand' : ''}>
                    <Row justify="end">
                        <Button
                            block={this.props.isMobile}
                            onClick={() =>
                                self.setState({ modalShowing: ADDING_LOCAL })
                            }
                        >
                            Agregar registro auto-hospedado
                        </Button>
                    </Row>
                </div>

                <div style={{ height: 20 }} />
                <Row justify="end">
                    <Button
                        block={this.props.isMobile}
                        onClick={() =>
                            self.setState({
                                modalShowing: ADDING_REMOTE,
                                remoteRegistryToAdd:
                                    self.getPlainRegistryInfo(),
                            })
                        }
                    >
                        Agregar registro remoto
                    </Button>
                </Row>
            </div>
        )
    }
}
