import { EditOutlined } from '@ant-design/icons'
import { Alert, Modal, Select } from 'antd'
import React, { Component } from 'react'
import { IRegistryApi } from '../../models/IRegistryInfo'
import Utils from '../../utils/Utils'
import ClickableLink from '../global/ClickableLink'

const Option = Select.Option
const NONE = 'none'
const DISABLED_PUSH = 'disabled push'

export default class DefaultDockerRegistry extends Component<
    {
        apiData: IRegistryApi
        changeDefault: (regId: string) => void
    },
    { isInEditMode: boolean; newSelectedDefaultId: string }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isInEditMode: false,
            newSelectedDefaultId: '',
        }
    }

    getDefaultRegText() {
        const registries = this.props.apiData.registries
        const defaultPushRegistryId = this.props.apiData.defaultPushRegistryId
        for (let index = 0; index < registries.length; index++) {
            const element = registries[index]
            if (element.id === defaultPushRegistryId) {
                return `${element.registryUser} @ ${element.registryDomain}`
            }
        }

        return DISABLED_PUSH
    }

    getAllOptions() {
        const registries = Utils.copyObject(this.props.apiData.registries)
        return registries.map(function (element) {
            return (
                <Option value={element.id} key={element.id}>
                    {`${element.registryUser} @ ${element.registryDomain}`}
                </Option>
            )
        })
    }

    render() {
        const self = this

        return (
            <div>
                <Modal
                    title="Editar registro de inserción"
                    okText="Guardar y actualizar"
                    onCancel={() => self.setState({ isInEditMode: false })}
                    onOk={() => {
                        self.setState({ isInEditMode: false })
                        self.props.changeDefault(
                            self.state.newSelectedDefaultId
                        )
                    }}
                    visible={self.state.isInEditMode}
                >
                    <p>
                    Default Docker Registry es el registro que será
                         utilizado para almacenar sus imágenes recién construidas. Puedes elegir{' '}
                        <code>{DISABLED_PUSH}</code> si no quieres empujar
                         sus imágenes recién creadas en cualquier registro docker. Mantener dentro
                         cuenta que si usas <code>{DISABLED_PUSH}</code>,
                         nodos de clúster (si tiene más de uno
                         servidor) no podrá ejecutar sus aplicaciones.
                    </p>
                    <p>Cambie el Registro de Docker predeterminado:</p>
                    <Select
                        defaultValue={
                            this.props.apiData.defaultPushRegistryId || NONE
                        }
                        style={{ width: 300 }}
                        onChange={(value: string) => {
                            if (value === NONE) {
                                this.setState({ newSelectedDefaultId: '' })
                            } else {
                                this.setState({ newSelectedDefaultId: value })
                            }
                        }}
                    >
                        <Option value={NONE}>{DISABLED_PUSH}</Option>
                        {self.getAllOptions()}
                    </Select>

                    <div
                        style={{ marginTop: 20 }}
                        className={
                            !!self.state.newSelectedDefaultId
                                ? 'hide-on-demand'
                                : ''
                        }
                    >
                        <Alert
                            showIcon={true}
                            type="warning"
                            message="Si tiene un clúster (más de un servidor), necesita tener un registro de inserción predeterminado. Si solo tiene un servidor, deshabilitar el registro de inserción predeterminado está bien."
                        />
                    </div>
                </Modal>
                <h3>Registro de inserción predeterminado</h3>
                <p>
                Registro de Docker para enviar nuevas imágenes:{' '}
                    <ClickableLink
                        onLinkClicked={() => {
                            self.setState({
                                isInEditMode: true,
                                newSelectedDefaultId:
                                    self.props.apiData.defaultPushRegistryId ||
                                    '',
                            })
                        }}
                    >
                        <code>{this.getDefaultRegText()}</code> <EditOutlined />
                    </ClickableLink>
                </p>
            </div>
        )
    }
}
