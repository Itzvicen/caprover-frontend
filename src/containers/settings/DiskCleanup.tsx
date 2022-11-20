import { DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Col, Input, message, Row, Tooltip } from 'antd'
import React from 'react'
import Toaster from '../../utils/Toaster'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
import UnusedImagesTable from './UnusedImagesTable'

export interface IUnusedImage {
    tags: string[]
    id: string
}

export default class DiskCleanup extends ApiComponent<
    {
        isMobile: boolean
    },
    {
        isLoading: boolean
        mostRecentLimit: number
        unusedImages?: IUnusedImage[]
        selectedImagesForDelete: string[]
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            mostRecentLimit: 2,
            selectedImagesForDelete: [],
            unusedImages: [],
        }
    }

    onRemoveImagesClicked() {
        const self = this
        this.setState({ isLoading: true })
        this.apiManager
            .deleteImages(this.state.selectedImagesForDelete)
            .then(function () {
                message.success('Unused images are deleted.')
                self.refreshOldImagesList()
            })
            .catch(
                Toaster.createCatcher(function () {
                    self.setState({ isLoading: false })
                })
            )
    }

    refreshOldImagesList() {
        const self = this
        this.setState({ unusedImages: undefined, isLoading: true })
        return this.apiManager
            .getUnusedImages(this.state.mostRecentLimit)
            .then(function (data) {
                self.setState({ unusedImages: data.unusedImages })
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    render() {
        const self = this

        if (self.state.isLoading) {
            return <CenteredSpinner />
        }

        const unusedImages = this.state.unusedImages

        if (!unusedImages) {
            return <ErrorRetry />
        }

        const hasSelectedImagesForRemoval = !!(
            self.state.selectedImagesForDelete &&
            self.state.selectedImagesForDelete.length
        )

        return (
            <div>
                <div>
                    <p>
                    Cada vez que implementa una nueva compilación, Docker crea una nueva
                        imagen para ti. Por lo general, una gran parte de esta imagen es
                        compartida entre la versión antigua y la nueva versión, pero
                        se agrega una pequeña porción a su disco con cada compilación. Tú
                        Puede leer más sobre la limpieza del disco en los documentos, pero como
                        interfaz simple, este widget le da la capacidad de
                        realizar limpiezas de imágenes a pedido.
                    </p>
                    <p>
                        Puede realizar esta acción, después de cada implementación. Pero es
                        normalmente no se necesita con esa frecuencia. para tipico
                        proyectos medianos, se recomienda realizar esto
                        limpieza después de cada ~ 20 compilaciones.
                    </p>
                    <p>
                        Con parámetro por defecto, mantiene los dos últimos recientes
                        compilaciones de todas las aplicaciones actuales y crea una lista de imágenes
                        que se pueden eliminar (haciendo clic en el botón Obtener lista).
                        Puede seleccionar las imágenes que desea eliminar y hacer clic en
                        en el botón Eliminar imágenes. Podrías notar que algunos
                        las imágenes no se eliminan aunque haya hecho clic en Eliminar
                        Imágenes, significa que están siendo directa o indirectamente
                        en uso por Docker. Un ejemplo común para el uso indirecto es
                        una imagen cuya imagen secundaria está siendo utilizada por un ser vivo
                        envase.
                    </p>

                    <br />
                </div>

                <Row>
                    <Col span={12}>
                        <Tooltip title="Por ejemplo, ingrese 2 para excluir las 2 compilaciones más recientes durante la limpieza">
                            <Input
                                addonBefore="Mantener el más reciente"
                                type="number"
                                value={this.state.mostRecentLimit + ''}
                                onChange={(e) => {
                                    this.setState({
                                        mostRecentLimit: Number(e.target.value),
                                    })
                                }}
                            />
                        </Tooltip>
                    </Col>
                    <Col span={12}>
                        <Row justify="end">
                            <Button
                                type="default"
                                onClick={() => this.refreshOldImagesList()}
                            >
                                <span>
                                    <SyncOutlined />
                                </span>{' '}
                                &nbsp; Obtener lista
                            </Button>
                        </Row>
                    </Col>
                </Row>

                <div
                    className={unusedImages.length > 0 ? '' : 'hide-on-demand'}
                >
                    <div style={{ height: 20 }} />
                    <Row justify="end">
                        <Tooltip
                            title={
                                hasSelectedImagesForRemoval
                                    ? ''
                                    : 'Seleccione las imágenes que desea eliminar. Puede seleccionar todo desde la fila superior.'
                            }
                        >
                            <Button
                                disabled={!hasSelectedImagesForRemoval}
                                type="primary"
                                block={this.props.isMobile}
                                onClick={() => {
                                    self.onRemoveImagesClicked()
                                }}
                            >
                                <span>
                                    <DeleteOutlined />{' '}
                                </span>{' '}
                                &nbsp; Eliminar imágenes no utilizadas
                            </Button>
                        </Tooltip>
                    </Row>
                    <div style={{ height: 20 }} />
                    <div>
                    <b>NOTA: </b> Las imágenes que se utilizan (directa o
                         indirectamente) no se eliminarán incluso si los selecciona.
                    </div>
                    <div style={{ height: 20 }} />
                    <UnusedImagesTable
                        unusedImages={unusedImages}
                        isMobile={this.props.isMobile}
                        selectedImagesForDelete={
                            this.state.selectedImagesForDelete
                        }
                        updateModel={(selectedImagesForDelete) =>
                            this.setState({ selectedImagesForDelete })
                        }
                    />
                </div>
            </div>
        )
    }
}
