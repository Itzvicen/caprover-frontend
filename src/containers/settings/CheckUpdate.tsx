import { CloudDownloadOutlined } from '@ant-design/icons'
import { Alert, Button, Row } from 'antd'
import React from 'react'
import { IVersionInfo } from '../../models/IVersionInfo'
import Toaster from '../../utils/Toaster'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
import ReloadCaptainModal from './ReloadCaptainModal'

export default class CheckUpdate extends ApiComponent<
    {
        isMobile: boolean
    },
    {
        versionInfo: IVersionInfo | undefined
        isRefreshTimerActivated: boolean
        isLoading: boolean
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            versionInfo: undefined,
            isRefreshTimerActivated: false,
            isLoading: true,
        }
    }

    componentDidMount() {
        const self = this
        self.setState({ isLoading: true })
        self.apiManager
            .getVersionInfo()
            .then(function (data) {
                self.setState({ versionInfo: data })
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    onPerformUpdateClicked() {
        const self = this
        const versionInfo = this.state.versionInfo
        self.setState({ isLoading: true })
        self.apiManager
            .performUpdate(versionInfo!.latestVersion)
            .then(function () {
                self.setState({ isRefreshTimerActivated: true })
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

        const versionInfo = this.state.versionInfo

        if (!versionInfo) {
            return <ErrorRetry />
        }

        return (
            <div>
                <p>
                Spacecloud permite instalar actualizaciones en el lugar. Sin embargo,
                     Siempre lea los registros de cambios antes de actualizar su CapRover.
                     Puede haber cambios importantes que debe tener en cuenta
                     de. La actualización suele tardar unos 60 segundos y su
                     CapRover puede dejar de responder hasta que finalice el proceso de actualización.
                     acabado. Sus aplicaciones seguirán siendo funcionales y receptivas
                     durante este tiempo, excepto por un período muy corto de 10
                     segundos o menos.
                </p>
                <br />
                <p>
                    <b>Versión actual</b>: {versionInfo.currentVersion}
                </p>
                <p>
                    <b>Última versión estable</b>: {versionInfo.latestVersion}
                </p>
                <div>
                    <p
                        className={
                            versionInfo.changeLogMessage
                                ? 'pre-line-content'
                                : 'hide-on-demand'
                        }
                    >
                        {versionInfo.changeLogMessage}
                    </p>
                </div>
                <div className={versionInfo.canUpdate ? '' : 'hide-on-demand'}>
                    <Row justify="end">
                        <Button
                            type="primary"
                            block={this.props.isMobile}
                            onClick={() => this.onPerformUpdateClicked()}
                        >
                            <span>
                                <CloudDownloadOutlined />
                            </span>{' '}
                            &nbsp; Instalar actualización
                        </Button>
                    </Row>
                </div>

                <div className={!versionInfo.canUpdate ? '' : 'hide-on-demand'}>
                    <Alert
                        message="Tu Spacecloud tiene la última versión."
                        type="info"
                    />
                </div>

                <ReloadCaptainModal
                    isRefreshTimerActivated={self.state.isRefreshTimerActivated}
                >
                    <div>
                        <p>
                        La actualización tarda aproximadamente un minuto en completarse dependiendo de
                             la velocidad de conexión de su servidor.
                         </p>
                         <p>
                             Su tablero CapRover no funciona durante el
                             actualizar. Espere hasta que esta página se actualice
                             automáticamente.
                         </p>
                         <p>
                             Es posible que vea un error de nginx brevemente después de la
                             actualizar. Pero se arreglará solo en unos segundos.
                         </p>
                        <br />
                        <br />
                    </div>
                </ReloadCaptainModal>
            </div>
        )
    }
}
