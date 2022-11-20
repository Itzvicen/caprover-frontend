import { CloudDownloadOutlined } from '@ant-design/icons'
import { Button, message, Row } from 'antd'
import React from 'react'
import Toaster from '../../utils/Toaster'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

export default class BackupCreator extends ApiComponent<
    {
        isMobile: boolean
    },
    {
        isLoading: boolean
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
        }
    }

    onCreateBackupClicked() {
        const self = this
        self.setState({ isLoading: true })
        self.apiManager
            .createBackup()
            .then(function (data) {
                let link = document.createElement('a') // create 'a' element
                link.setAttribute(
                    'href',
                    `${self.apiManager.getApiBaseUrl()}/downloads/?namespace=captain&downloadToken=${encodeURIComponent(
                        data.downloadToken
                    )}`
                )
                link.click()

                message.success('Downloading backup started...')
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

        return (
            <div>
                <p>
                Cree una copia de seguridad de las configuraciones de CapRover para poder
                     hacer girar un clon de este servidor. Tenga en cuenta que su aplicación
                     los datos (volúmenes e imágenes) no forman parte de esta copia de seguridad. Este
                     La copia de seguridad solo incluye los detalles de configuración del servidor, como
                     como dominios raíz, nombres de aplicaciones, certificados SSL, etc.
                 </p>
                 <p>
                     Consulte los documentos para obtener más detalles sobre cómo restaurar su
                     servidor utilizando el archivo de copia de seguridad.
                 </p>
                 <p>Tenga en cuenta que esto es, actualmente, una CARACTERÍSTICA EXPERIMENTAL.</p>
                <br />

                <Row justify="end">
                    <Button
                        type="primary"
                        block={this.props.isMobile}
                        onClick={() => this.onCreateBackupClicked()}
                    >
                        <span>
                            <CloudDownloadOutlined />
                        </span>{' '}
                        &nbsp; Crear Backup
                    </Button>
                </Row>
            </div>
        )
    }
}
