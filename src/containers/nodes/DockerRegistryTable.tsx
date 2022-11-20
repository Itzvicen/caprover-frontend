import {
    DeleteOutlined,
    FormOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons'
import { Card, Input, message, Modal, Table, Tooltip } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React, { Component } from 'react'
import {
    IRegistryApi,
    IRegistryInfo,
    IRegistryTypes,
} from '../../models/IRegistryInfo'
import Utils from '../../utils/Utils'
import ClickableLink from '../global/ClickableLink'
import PasswordField from '../global/PasswordField'

const EDITING_MODAL = 'EDITING_MODAL'
const DELETING_MODAL = 'DELETING_MODAL'

export default class DockerRegistryTable extends Component<
    {
        apiData: IRegistryApi
        isMobile: boolean
        editRegistry: (dockerRegistry: IRegistryInfo) => void
        deleteRegistry: (regId: string) => void
    },
    {
        modalShowing: 'EDITING_MODAL' | 'DELETING_MODAL' | undefined
        remoteRegistryToEdit: IRegistryInfo | undefined
        registryIdToDelete: string | undefined
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            modalShowing: undefined,
            remoteRegistryToEdit: undefined,
            registryIdToDelete: undefined,
        }
    }

    deleteRegistry(id: string) {
        if (id === this.props.apiData.defaultPushRegistryId) {
            Modal.warn({
                title: 'No se puede eliminar la inserción predeterminada',
                content: (
                    <div>
                        Este registro está configurado para ser el impulso predeterminado. No puedes
                         elimine el registro de inserción predeterminado. Para quitar, primero tú
                         necesita cambiar el registro push predeterminado a otro
                         registro, o deshabilite completamente el push predeterminado
                         registro. Luego, regresa y borra esto.
                    </div>
                ),
            })
            return
        }

        this.setState({
            registryIdToDelete: id,
            modalShowing: DELETING_MODAL,
        })
    }

    editRegistry(dockerRegistry: IRegistryInfo) {
        if (dockerRegistry.registryType === IRegistryTypes.LOCAL_REG) {
            message.warn(
                'No puede editar el registro autohospedado. Es administrado por Spacecloud.'
            )
            return
        }

        this.setState({
            modalShowing: EDITING_MODAL,
            remoteRegistryToEdit: Utils.copyObject(dockerRegistry),
        })
    }

    getCols(): ColumnProps<IRegistryInfo>[] {
        const self = this
        const columns = [
            {
                title: 'Usuario',
                dataIndex: 'registryUser' as 'registryUser',
            },
            {
                title: 'Contraseña',
                dataIndex: 'registryPassword' as 'registryPassword',
                render: (registryPassword: string) => {
                    return <span>Edit to see.</span>
                },
            },
            {
                title: 'Dominio',
                dataIndex: 'registryDomain' as 'registryDomain',
            },
            {
                title: 'Prefijo de imagen',
                dataIndex: 'registryImagePrefix' as 'registryImagePrefix',
            },
            {
                title: 'Acciones',
                dataIndex: 'id' as 'id',
                render: (id: string, reg: IRegistryInfo) => {
                    return (
                        <span>
                            <ClickableLink
                                onLinkClicked={() => {
                                    self.editRegistry(reg)
                                }}
                            >
                                <FormOutlined />
                            </ClickableLink>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <ClickableLink
                                onLinkClicked={() => {
                                    self.deleteRegistry(reg.id)
                                }}
                            >
                                <DeleteOutlined />
                            </ClickableLink>
                        </span>
                    )
                },
            },
        ]
        return columns
    }

    createEditModalContent() {
        const self = this

        return (
            <div style={{ maxWidth: 360 }}>
                <Input
                    addonBefore="Nombre de usuario"
                    placeholder="Usuario | email@gmail.com"
                    type="email"
                    value={self.state.remoteRegistryToEdit!.registryUser}
                    onChange={(e) => {
                        const newData = Utils.copyObject(
                            self.state.remoteRegistryToEdit!
                        )
                        newData.registryUser = e.target.value.trim()
                        self.setState({ remoteRegistryToEdit: newData })
                    }}
                />
                <div style={{ height: 20 }} />
                <PasswordField
                    addonBefore="Contraseña"
                    placeholder="mypassword"
                    defaultValue={
                        self.state.remoteRegistryToEdit!.registryPassword
                    }
                    onChange={(e) => {
                        const newData = Utils.copyObject(
                            self.state.remoteRegistryToEdit!
                        )
                        newData.registryPassword = e.target.value
                        self.setState({ remoteRegistryToEdit: newData })
                    }}
                />
                <div style={{ height: 20 }} />
                <Input
                    addonBefore="Dominio"
                    placeholder="registry-1.docker.io"
                    type="text"
                    value={self.state.remoteRegistryToEdit!.registryDomain}
                    onChange={(e) => {
                        const newData = Utils.copyObject(
                            self.state.remoteRegistryToEdit!
                        )
                        newData.registryDomain = e.target.value.trim()
                        self.setState({ remoteRegistryToEdit: newData })
                    }}
                />
                <div style={{ height: 20 }} />
                <Input
                    addonBefore="Prefijo de imagen"
                    placeholder="usuario"
                    addonAfter={
                        <Tooltip title="Your images will be tagged as RegistryDomain/ImagePrefix/ImageName. For most providers, Image Prefix is exactly your username, unless the field DOMAIN is specific to you, in that case, this prefix is empty.">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                    type="text"
                    value={self.state.remoteRegistryToEdit!.registryImagePrefix}
                    onChange={(e) => {
                        const newData = Utils.copyObject(
                            self.state.remoteRegistryToEdit!
                        )
                        newData.registryImagePrefix = e.target.value.trim()
                        self.setState({ remoteRegistryToEdit: newData })
                    }}
                />
            </div>
        )
    }

    render() {
        const self = this
        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    title="Confirmar borrado"
                    okText="Delete Registry"
                    onCancel={() => self.setState({ modalShowing: undefined })}
                    onOk={() => {
                        self.setState({ modalShowing: undefined })
                        self.props.deleteRegistry(
                            self.state.registryIdToDelete!
                        )
                    }}
                    visible={self.state.modalShowing === DELETING_MODAL}
                >
                    Are you sure you want to remote this registry from your
                    list. You will no longer be able to push to or pull from
                    this registry.
                </Modal>
                <Modal
                    destroyOnClose={true}
                    title="Editar registro"
                    okText="Guardar y actualizar"
                    onCancel={() => self.setState({ modalShowing: undefined })}
                    onOk={() => {
                        self.setState({ modalShowing: undefined })
                        self.props.editRegistry(
                            Utils.copyObject(self.state.remoteRegistryToEdit!)
                        )
                    }}
                    visible={self.state.modalShowing === EDITING_MODAL}
                >
                    {self.state.remoteRegistryToEdit ? (
                        self.createEditModalContent()
                    ) : (
                        <div />
                    )}
                </Modal>
                <h3>Docker Registries</h3>
                <div>
                    {this.props.isMobile ? (
                        this.props.apiData.registries.map((registry) => (
                            <Card
                                type="inner"
                                key={registry.id}
                                style={{
                                    marginBottom: 8,
                                    wordWrap: 'break-word',
                                }}
                                title={registry.registryDomain}
                            >
                                <div>
                                    <b>Usuario:</b> {registry.registryImagePrefix}
                                </div>
                                <div>
                                    <b>Contraseña:</b> Edit to see.
                                </div>
                                <div>
                                    <b>Dominio:</b> {registry.registryDomain}
                                </div>
                                <div>
                                    <b>Prefijo de imagen:</b> {registry.registryUser}
                                </div>
                                <div>
                                    <b>Acciones:</b>
                                    <span>
                                        <ClickableLink
                                            onLinkClicked={() => {
                                                self.editRegistry(registry)
                                            }}
                                        >
                                            <FormOutlined />
                                        </ClickableLink>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <ClickableLink
                                            onLinkClicked={() => {
                                                self.deleteRegistry(registry.id)
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </ClickableLink>
                                    </span>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Table
                            rowKey="id"
                            pagination={false}
                            columns={this.getCols()}
                            dataSource={this.props.apiData.registries}
                        />
                    )}
                </div>
            </div>
        )
    }
}
