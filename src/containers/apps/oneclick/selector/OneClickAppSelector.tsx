import { Alert, Button, Card, Col, Row } from 'antd'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { IOneClickAppIdentifier } from '../../../../models/IOneClickAppModels'
import Toaster from '../../../../utils/Toaster'
import Utils from '../../../../utils/Utils'
import ApiComponent from '../../../global/ApiComponent'
import CenteredSpinner from '../../../global/CenteredSpinner'
import InputJsonifier from '../../../global/InputJsonifier'
import NewTabLink from '../../../global/NewTabLink'
import OneClickGrid from './OneClickGrid'
import OneClickReposList from './OneClickReposList'

export const TEMPLATE_ONE_CLICK_APP = 'TEMPLATE_ONE_CLICK_APP'
export const ONE_CLICK_APP_STRINGIFIED_KEY = 'oneClickAppStringifiedData'

export default class OneClickAppSelector extends ApiComponent<
    RouteComponentProps<any>,
    {
        oneClickAppList: IOneClickAppIdentifier[] | undefined
        isCustomTemplateSelected: boolean
        templateOneClickAppData: string
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            oneClickAppList: undefined,
            isCustomTemplateSelected: false,
            templateOneClickAppData: '',
        }
    }

    componentDidMount() {
        const self = this
        self.fetchData()
    }

    fetchData() {
        const self = this
        self.apiManager
            .getAllOneClickApps()
            .then(function (data) {
                const apps = data.oneClickApps as IOneClickAppIdentifier[]
                apps.push({
                    name: TEMPLATE_ONE_CLICK_APP,
                    description:
                        'Plantilla para crear apps con un click. Principalmente para dasarrollo',
                    logoUrl: '/icon-512x512.png',
                    baseUrl: '',
                    displayName: '>> Plantilla <<',
                })
                self.setState({
                    oneClickAppList: apps,
                })
            })
            .catch(Toaster.createCatcher())
    }

    createCustomTemplateInput() {
        const self = this

        let isOneClickJsonValid = true
        if (this.state.templateOneClickAppData) {
            try {
                JSON.parse(this.state.templateOneClickAppData)
            } catch (error) {
                isOneClickJsonValid = false
            }
        }

        return (
            <div
                className={
                    self.state.isCustomTemplateSelected ? '' : 'hide-on-demand'
                }
            >
                <div>
                    <p>
                    Esto es principalmente para la prueba. Puede copiar y pegar su plantilla de aplicación One-Click personalizada aquí. Mira{' '}
                        <NewTabLink url="https://github.com/caprover/one-click-apps/tree/master/public/v4/apps">
                            el repositorio principal de Spacecloud
                        </NewTabLink>{' '}
                        para muestras e ideas.
                    </p>
                </div>

                <InputJsonifier
                    placeholder={`YAML or JSON # use captainVersion 4
{
  "captainVersion": "4",
  "version": "3.3"
  "services": {
    "$$cap_appname": {
          "image": "adminer:$$cap_adminer_version",
          "containerHttpPort": "8080",
          "environment": {
              "ADMINER_DESIGN": "$$cap_adminer_design"
          }
    }
  }
}`}
                    onChange={(stringified) => {
                        self.setState({
                            templateOneClickAppData: stringified,
                        })
                    }}
                />
                <div style={{ height: 10 }} />
                {!isOneClickJsonValid ? (
                    <Alert
                        message="Los datos que has introducidos no son validos para JSON."
                        type="error"
                    />
                ) : (
                    <div />
                )}
                <div style={{ height: 30 }} />
                <Row justify="space-between" align="middle">
                    <Button
                        onClick={() =>
                            self.props.history.push(
                                `/apps/oneclick/${TEMPLATE_ONE_CLICK_APP}` +
                                    (`?${ONE_CLICK_APP_STRINGIFIED_KEY}=` +
                                        encodeURIComponent(
                                            self.state.templateOneClickAppData
                                        ))
                            )
                        }
                        disabled={
                            !self.state.templateOneClickAppData ||
                            !isOneClickJsonValid
                        }
                        style={{ minWidth: 150 }}
                        type="primary"
                    >
                        Next
                    </Button>
                </Row>
            </div>
        )
    }

    createOneClickAppListGrid() {
        const self = this

        if (!this.state.oneClickAppList) return <CenteredSpinner />

        return (
            <OneClickGrid
                onAppSelectionChanged={(event, appName) => {
                    if (appName === TEMPLATE_ONE_CLICK_APP) {
                        event.preventDefault()
                        self.setState({ isCustomTemplateSelected: true })
                    }
                }}
                oneClickAppList={self.state.oneClickAppList!}
            />
        )
    }

    render() {
        const self = this

        return (
            <div>
                <Row justify="center">
                    <Col xs={{ span: 23 }} lg={{ span: 23 }}>
                        <Card title="Apliacaciones de un click">
                            <div
                                className={
                                    self.state.isCustomTemplateSelected
                                        ? 'hide-on-demand'
                                        : ''
                                }
                            >
                                <p>
                                    Elija una aplicación, una base de datos o un paquete (Aplicación + base de datos) de la lista a continuación. el resto es magia
                                </p>
                                <p>
                                Las aplicaciones de un clic se recuperan del repositorio oficial{' '}
                                    <NewTabLink url="https://github.com/caprover/one-click-apps">
                                        Spacecloud Apps un click{' '}
                                    </NewTabLink>
                                    por defecto. Puede agregar otros repositorios públicos/privados si lo desea.
                                </p>

                                {self.createOneClickAppListGrid()}

                                <div style={{ height: 50 }} />

                                <OneClickReposList />
                            </div>
                            {Utils.isSafari() ? (
                                <Alert
                                    message="Parece que estás usando Safari. La implementación de aplicaciones de un solo clic puede ser inestable en Safari. Se recomienda usar Chrome"
                                    type="warning"
                                />
                            ) : (
                                <div />
                            )}
                            <div style={{ height: 50 }} />

                            {self.createCustomTemplateInput()}
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
