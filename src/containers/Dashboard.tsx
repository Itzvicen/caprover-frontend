import { Button, Card, Col, Input, Modal, Row, Tooltip } from 'antd'
import { Redirect, RouteComponentProps } from 'react-router'
import AppConstants from '../utils/AppConstants'
import Toaster from '../utils/Toaster'
import ApiComponent from './global/ApiComponent'
import CenteredSpinner from './global/CenteredSpinner'
import ErrorRetry from './global/ErrorRetry'
import NewTabLink from './global/NewTabLink'
const Search = Input.Search

export default class Dashboard extends ApiComponent<
    RouteComponentProps<any>,
    {
        isLoading: boolean
        isForceChangingDomain: boolean
        apiData: any
        userEmail: string
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            userEmail: '',
            isLoading: true,
            isForceChangingDomain: false,
            apiData: undefined,
        }
    }

    componentDidMount() {
        this.reFetchData()
    }

    reFetchData() {
        const self = this
        self.setState({ isLoading: true, apiData: undefined })
        return this.apiManager
            .getCaptainInfo()
            .then(function (data: any) {
                self.setState({ apiData: data })
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    onForceSslClicked() {
        const self = this

        const isUsingHttp = window.location.href.startsWith('http://')

        Modal.confirm({
            title: 'Force HTTPS',
            content: (
                <p>
                    Once Force HTTPS is activated, all HTTP traffic is
                    redirected to HTTPS.
                    {isUsingHttp
                        ? 'Since this is a one-way action, and there is no revert, it is highly recommended that you test the HTTPS website first.'
                        : ''}{' '}
                    Do you still want to proceed?
                </p>
            ),
            onOk() {
                self.setState({ isLoading: true })
                self.apiManager
                    .forceSsl(true)
                    .then(function () {
                        Modal.success({
                            title: 'Force HTTPS activated!',
                            content: (
                                <div>
                                    <p>
                                        All HTTP traffic is now redirected to
                                        HTTPS.{' '}
                                        {isUsingHttp
                                            ? 'You will have to login again as you will now be redirected to HTTPS website.'
                                            : ''}
                                    </p>
                                </div>
                            ),
                            onOk() {
                                if (isUsingHttp) {
                                    window.location.replace(
                                        `https://${self.state.apiData.captainSubDomain}.${self.state.apiData.rootDomain}`
                                    )
                                }
                            },
                            onCancel() {
                                if (isUsingHttp) {
                                    window.location.replace(
                                        `https://${self.state.apiData.rootDomain}`
                                    )
                                }
                            },
                        })
                    })
                    .catch(Toaster.createCatcher())
                    .then(function () {
                        self.setState({ isLoading: false })
                    })
            },
            onCancel() {
                // do nothing
            },
        })
    }

    onEnableSslClicked() {
        const self = this
        const IGNORE = 'IGNORE'

        Promise.resolve()
            .then(function () {
                return new Promise(function (resolve, reject) {
                    Modal.success({
                        title: 'Habilitar HTTPS',
                        content: (
                            <div>
                                <p>
                                    Spacecloud usa{' '}
                                    <NewTabLink url="https://letsencrypt.org/">
                                        Let&#39;s Encrypt
                                    </NewTabLink>{' '}
                                    para proporcionar certificados SSL gratuitos (HTTPS).
                                     Esta dirección de correo electrónico es muy importante ya que
                                     Let&#39;s Encrypt lo usa para la validación
                                     propósitos Proporcione un correo electrónico válido aquí.
                                </p>
                                <p>
                                IMPORTANTE: una vez que habilite HTTPS, no podrá
                                     edite el dominio raíz nunca más. Cerciorarse
                                     utiliza un buen dominio raíz. una buena practica
                                     es ir un nivel más profundo y configurar su
                                     dominio raíz. Por ejemplo, si posee {' '}
                                     <code>example.com</code>, use{' '}
                                     <code>*.caprover-root.example.com</code> como
                                     su dominio raíz. Esto le permitirá
                                     administre mejor sus subdominios, no use {' '}
                                     <code>*.example.com</code> como raíz
                                     dominio.
                                </p>
                                <Input
                                    placeholder="your@email.com"
                                    type="email"
                                    onChange={(event) =>
                                        self.setState({
                                            userEmail: (
                                                event.target.value || ''
                                            ).trim(),
                                        })
                                    }
                                />
                            </div>
                        ),
                        onOk() {
                            resolve(self.state.userEmail || '')
                        },
                        onCancel() {
                            resolve(undefined)
                        },
                    })
                })
            })
            .then(function (data: any) {
                if (data === undefined) return IGNORE
                self.setState({ isLoading: true })
                return self.apiManager.enableRootSsl(data)
            })

            .then(function (data: any) {
                if (data === IGNORE) return

                Modal.success({
                    title: '¡HTTPS activado para el dominio raíz!',
                    content: (
                        <div>
                            <p>
                            Ahora puedes usar{' '}
                                <code>
                                    {`https://${self.state.apiData.rootDomain}`}
                                </code>
                                . El siguiente paso es forzar HTTPS para que no permita
                                 tráfico HTTP.
                            </p>
                        </div>
                    ),
                })

                return self.reFetchData()
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.setState({ isLoading: false })
            })
    }

    updateRootDomainClicked(rootDomain: string) {
        const self = this
        if (!self.state.apiData.hasRootSsl) {
            self.performUpdateRootDomain(rootDomain, false)
            return
        }

        Modal.confirm({
            title: 'Force Change Root Domain',
            content: (
                <div>
                    <p>
                    Ya ha habilitado SSL para su dominio raíz.
                         Cambiar la URL del dominio raíz invalidará HTTPS en
                         dominio raíz y todos los subdominios predeterminados para aplicaciones si
                         tener alguna aplicación.
                     </p>
                     <p>
                         Todavía puede volver a habilitar HTTPS después de cambiar la raíz
                         dominio.
                    </p>
                </div>
            ),
            onOk() {
                self.performUpdateRootDomain(rootDomain, true)
            },
            onCancel() {
                // do nothing
            },
        })
    }

    performUpdateRootDomain(rootDomain: string, force: boolean) {
        const self = this

        this.apiManager
            .updateRootDomain(rootDomain, force)
            .then(function (data: any) {
                Modal.success({
                    title: 'Root Domain Updated',
                    content: (
                        <div>
                            <p>
                            Haga clic en Aceptar para ser redirigido a su nueva raíz
                                 dominio. Necesita iniciar sesión de nuevo.
                            </p>
                        </div>
                    ),
                    onOk() {
                        window.location.replace(
                            `http://${self.state.apiData.captainSubDomain}.${rootDomain}`
                        )
                    },
                })
            })
            .catch(Toaster.createCatcher())
    }

    render() {
        const self = this

        if (self.state.isLoading) {
            return <CenteredSpinner />
        }

        if (!self.state.apiData) {
            return <ErrorRetry />
        }

        const qs = new URLSearchParams(self.props.location.search)

        if (
            !!this.state.apiData.forceSsl &&
            !!qs.get(AppConstants.REDIRECT_TO_APPS_IF_READY_REQ_PARAM)
        ) {
            return <Redirect to="/apps" />
        }

        return (
            <div>
                {self.createInitialSetupIfNoRootSsl()}
                <br />
                {self.createPostFullSetupIfHasForceSsl()}
                <br />
                {self.createSetupPanelIfNoForceSsl()}
            </div>
        )
    }

    createSetupPanelIfNoForceSsl() {
        const self = this
        if (this.state.apiData.forceSsl && !self.state.isForceChangingDomain) {
            // User has set up the machine, no need to update your domain again - unless user really wants this!
            return undefined
        }

        return (
            <Row justify="center">
                <Col xs={{ span: 23 }} lg={{ span: 16 }}>
                    <Card title="Spacecloud configuraciones dominio raíz">
                        <div>
                            <p>
                            Lo primero que necesita Spacecloud es un
                                dominio raíz. Por ejemplo, si posee {' '}
                                <i>myawesomecompany.com</i>, puede usar{' '}
                                <i>captain.myawesomecompany.com</i> o {' '}
                                <i>foo.bar.myawesomecompany.com</i> como raíz
                                dominio. Primero, debe asegurarse de que la ip
                                dirección para todos los subdominios del dominio raíz
                                resuelva a la dirección IP de Spacecloud. Para hacer esto,
                                vaya a la configuración de DNS en su proveedor de dominio
                                sitio web y establezca una entrada comodín A.
                                <br /> Por ejemplo: <b> Escriba:</b> <u>A</u>,{' '}
                                <b>Nombre (o host):</b> <u>*.spacecloud-root</u>,
                                <b> IP (o Dirige a):</b>{' '}
                                <u>110.120.130.140</u> donde esta es la IP
                                dirección de su máquina Spacecloud.
                            </p>
                            <p>
                                <i>
                                NOTA: la configuración de DNS puede tardar varias horas
                                     para entrar en vigor. Mira{' '}
                                    <NewTabLink url="https://ca.godaddy.com/help/what-factors-affect-dns-propagation-time-1746">
                                        {' '}
                                        aquí
                                    </NewTabLink>{' '}
                                    para más detalles.
                                </i>
                            </p>
                        </div>
                        <hr />
                        <br />
                        <Row>
                            <div>
                                <p>
                                Por ejemplo, si establece {' '}
                                     <code>*.my-root.example.com</code> a la IP
                                     dirección de su servidor, simplemente ingrese {' '}
                                     <code>my-root.example.com</code> en el cuadro
                                     abajo:
                                </p>
                                <br />
                                <div>
                                    <Search
                                        addonBefore="[wildcard]&nbsp;."
                                        placeholder="my-root.example.com"
                                        defaultValue={
                                            self.state.apiData.rootDomain + ''
                                        }
                                        enterButton="Actualizar dominio"
                                        onSearch={(value) =>
                                            self.updateRootDomainClicked(value)
                                        }
                                    />
                                </div>
                            </div>
                        </Row>
                        <div style={{ height: 20 }} />
                        <Row justify="end">
                            <Tooltip title="Using Let's Encrypt Free Service">
                                <Button
                                    disabled={
                                        self.state.apiData.hasRootSsl ||
                                        !self.state.apiData.rootDomain
                                    }
                                    onClick={() => self.onEnableSslClicked()}
                                >
                                    Habilitar HTTPS
                                </Button>
                            </Tooltip>
                            &nbsp;&nbsp;
                            <Tooltip title="Redirect all HTTP to HTTPS">
                                <Button
                                    disabled={
                                        !self.state.apiData.hasRootSsl ||
                                        self.state.apiData.forceSsl
                                    }
                                    onClick={() => self.onForceSslClicked()}
                                >
                                    Forzar HTTPS
                                </Button>
                            </Tooltip>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }

    createInitialSetupIfNoRootSsl() {
        if (this.state.apiData.hasRootSsl) {
            // User has set up the machine, no need to show the welcome message
            return <div />
        }

        return (
            <Row justify="center">
                <Col xs={{ span: 23 }} lg={{ span: 16 }}>
                    <Card title="Spacecloud configuración inicial ⚙️">
                        <div>
                            <h3>
                            ¡Felicidades!{' '}
                                <span aria-label="Congrats" role="img">
                                    🎉🎉
                                </span>
                            </h3>
                            <p>
                            <b /> ¡Has instalado Spacecloud correctamente!{' '}
                                 <b>
                                     Pero aún necesita asignar un dominio y
                                     termine la configuración de HTTPS para configurar completamente
                                     Spacecloud!{' '}
                                 </b>
                                 Puede configurar su instancia de Spacecloud en dos
                                 maneras:
                            </p>

                            <ul>
                                <li>
                                <b>Herramienta de línea de comandos (RECOMENDADO): </b> activada
                                     su máquina local, simplemente ejecuta
                                     <br />
                                     <code>npm i -g caprover</code>
                                     <br />
                                     seguido de
                                     <br />
                                     <code>configuración del servidor Spacecloud</code>. Después
                                     sigue la guía.
                                </li>
                                <li>
                                <b>Utilice el panel siguiente: </b> Este es un
                                     versión no guiada de la línea de comandos
                                     método. Use este método solo para el propósito
                                     de experimentación
                                </li>
                            </ul>
                        </div>
                    </Card>
                </Col>
            </Row>
        )
    }

    createPostFullSetupIfHasForceSsl() {
        const self = this
        if (!this.state.apiData.forceSsl) {
            // User has not fully set up the machine, do not show the post installation message
            return undefined
        }

        return (
            <Row justify="center">
                <Col xs={{ span: 23 }} lg={{ span: 16 }}>
                    <Card title="Spacecloud">
                        <div>
                            <h3>
                            ¡Felicidades!{' '}
                                <span aria-label="Congrats" role="img">
                                    🎉🎉
                                </span>
                            </h3>
                            <p>
                            Ha instalado y configurado Spacecloud
                                 ¡exitosamente! ¡Ya puede implementar sus aplicaciones!
                                 Recuerde, con CapRover, puede implementar
                                 aplicaciones desde el código fuente (como Node.js,
                                 PHP, Java, Ruby, Python, etc.), y también puede
                                 implementar aplicaciones listas para usar como MySQL,
                                 ¡MongoDB, WordPress, Redis y muchos más!
                            </p>

                            <p>
                            Para obtener más información sobre cómo implementar
                                 aplicaciones desde el código fuente, asegúrese de tener
                                 un vistazo a nuestro
                                <a
                                    href="https://caprover.com/docs/sample-apps.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {' '}
                                    aplicaciones de muestra.
                                </a>
                            </p>

                            <p>
                                <i>
                                Siempre puede actualizar su dominio raíz, pero
                                     ¡ten cuidado! Sus certificados SSL obtendrán
                                     revocado debido a este cambio de dominio.
                                </i>
                            </p>

                            <Row justify="end">
                                <Button
                                    disabled={this.state.isForceChangingDomain}
                                    type="ghost"
                                    onClick={() => {
                                        self.setState({
                                            isForceChangingDomain: true,
                                        })
                                    }}
                                >
                                    Cambiar el dominio raíz de todos modos
                                </Button>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
        )
    }
}
