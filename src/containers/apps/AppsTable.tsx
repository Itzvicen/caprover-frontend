import {
    CheckOutlined,
    CodeOutlined,
    DisconnectOutlined,
    LinkOutlined,
    LoadingOutlined
} from '@ant-design/icons'
import { Card, Col, Input, Row, Table, Tooltip } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { History } from 'history'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IMobileComponent } from '../../models/ContainerProps'
import Logger from '../../utils/Logger'
import NewTabLink from '../global/NewTabLink'
import Timestamp from '../global/Timestamp'
import { IAppDef } from './AppDefinition'

type TableData = IAppDef & { lastDeployTime: string }

class AppsTable extends Component<
    {
        history: History
        apps: IAppDef[]
        rootDomain: string
        defaultNginxConfig: string
        isMobile: boolean
    },
    { searchTerm: string }
> {
    constructor(props: any) {
        super(props)
        this.state = { searchTerm: '' }
    }

    appDetailPath(appName: string) {
        return `/apps/details/${appName}`
    }

    createColumns() {
        const self = this
        const ALIGN: 'center' = 'center'
        const columns: ColumnProps<TableData>[] = [
            {
                title: 'App Name',
                dataIndex: 'appName',
                key: 'appName',
                render: (appName: string) => (
                    <Link to={this.appDetailPath(appName)}>{appName}</Link>
                ),
                sorter: (a, b) => {
                    return a.appName
                        ? a.appName.localeCompare(b.appName || '')
                        : 0
                },
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Persistent Data	',
                dataIndex: 'hasPersistentData',
                key: 'hasPersistentData',
                align: ALIGN,
                render: (hasPersistentData: boolean) => {
                    if (!hasPersistentData) {
                        return <span />
                    }

                    return (
                        <span>
                            <CheckOutlined />
                        </span>
                    )
                },
            },
            {
                title: 'Instance Count',
                dataIndex: 'instanceCount',
                key: 'instanceCount',
                align: ALIGN,
            },
            {
                title: 'Last Deployed',
                dataIndex: 'lastDeployTime',
                key: 'lastDeployTime',
                align: ALIGN,
                sorter: (a, b) => {
                    return (
                        Date.parse(a.lastDeployTime) -
                        Date.parse(b.lastDeployTime)
                    )
                },
                sortDirections: ['descend', 'ascend'],
                render: (lastDeployTime: string, app) => {
                    if (!lastDeployTime) {
                        return <span />
                    }

                    return (
                        <span>
                            <Timestamp timestamp={lastDeployTime} />
                            {!!app.isAppBuilding ? (
                                <LoadingOutlined
                                    style={{
                                        fontSize: '12px',
                                        marginLeft: 12,
                                    }}
                                />
                            ) : undefined}
                        </span>
                    )
                },
            },
            {
                title: 'Open',
                dataIndex: 'notExposeAsWebApp',
                key: 'openInBrowser',
                align: ALIGN,
                render: (notExposeAsWebApp: boolean, app) => {
                    if (notExposeAsWebApp) {
                        return (
                            <Tooltip title="Not exposed as a web app">
                                <DisconnectOutlined />
                            </Tooltip>
                        )
                    }

                    return (
                        <NewTabLink
                            url={`http${
                                app.hasDefaultSubDomainSsl ? 's' : ''
                            }://${app.appName}.${self.props.rootDomain}`}
                        >
                            <LinkOutlined />{' '}
                        </NewTabLink>
                    )
                },
            },
        ]

        // Set default sort order
        const sortKey = window.localStorage.appsSortKey || 'appName'
        const sortOrder = window.localStorage.appsSortOrder || 'ascend'
        const sorted =
            columns.find((column) => column.key === sortKey) || columns[0]
        sorted.defaultSortOrder = sortOrder

        return columns
    }

    render() {
        const self = this

        const appsToRender = self.props.apps
            .filter((app) => {
                if (!self.state.searchTerm) return true

                return app.appName!.indexOf(self.state.searchTerm) >= 0
            })
            .map((app) => {
                let versionFound = app.versions.filter(
                    (v) => v.version === app.deployedVersion
                )

                let lastDeployTime = ''

                if (versionFound.length === 0) {
                    // See https://github.com/caprover/caprover-frontend/issues/56
                    // This can happen when user creates a new app while a build is in progress.
                    // This results in app.versions being an empty array until the 0th version gets deployed.
                    Logger.error(
                        `App ${app.appName} has invalid deployVersion=${
                            app.deployedVersion
                        }, versions:${JSON.stringify(app.versions)}`
                    )
                } else {
                    lastDeployTime = versionFound[0].timeStamp || ''
                }

                return { ...app, lastDeployTime }
            })

        const searchAppInput = (
            <Input
                placeholder="Busca por nombre"
                type="text"
                onChange={(event) =>
                    self.setState({
                        searchTerm: (event.target.value || '')
                            .trim()
                            .toLowerCase(),
                    })
                }
            />
        )

        return (
            <Row justify="center">
                <Col
                    xs={{ span: 23 }}
                    lg={{ span: 16 }}
                    style={{ paddingBottom: 300 }}
                >
                    <Card
                        extra={!self.props.isMobile && searchAppInput}
                        title={
                            <React.Fragment>
                                <span>
                                    <CodeOutlined />
                                    &nbsp;&nbsp;&nbsp;Tus apps
                                </span>
                                <br />
                                {self.props.isMobile && (
                                    <div style={{ marginTop: 8 }}>
                                        {searchAppInput}
                                    </div>
                                )}
                            </React.Fragment>
                        }
                    >
                        <Row justify="center">
                            {self.props.isMobile ? (
                                appsToRender.map(
                                    ({
                                        appName = '',
                                        hasPersistentData,
                                        notExposeAsWebApp,
                                        instanceCount,
                                        hasDefaultSubDomainSsl,
                                    }) => (
                                        <Card
                                            type="inner"
                                            title={appName}
                                            key={appName}
                                            extra={
                                                <Link
                                                    to={this.appDetailPath(
                                                        appName
                                                    )}
                                                >
                                                    Detalles
                                                </Link>
                                            }
                                            style={{
                                                width: '100%',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <p>
                                                Persistent Data:{' '}
                                                {!hasPersistentData ? undefined : (
                                                    <span>
                                                        <CheckOutlined />
                                                    </span>
                                                )}
                                            </p>
                                            <p>
                                                Exposed Webapp:{' '}
                                                {!!notExposeAsWebApp ? undefined : (
                                                    <span>
                                                        <CheckOutlined />
                                                    </span>
                                                )}
                                            </p>
                                            <p>
                                                Número de instancias: {instanceCount}
                                            </p>
                                            <p>
                                                Abrir en el navegador:{' '}
                                                {!!notExposeAsWebApp ? undefined : (
                                                    <NewTabLink
                                                        url={`http${
                                                            hasDefaultSubDomainSsl
                                                                ? 's'
                                                                : ''
                                                        }://${appName}.${
                                                            self.props
                                                                .rootDomain
                                                        }`}
                                                    >
                                                        <LinkOutlined />{' '}
                                                    </NewTabLink>
                                                )}
                                            </p>
                                        </Card>
                                    )
                                )
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    <Table<TableData>
                                        rowKey="appName"
                                        columns={self.createColumns()}
                                        dataSource={appsToRender}
                                        pagination={false}
                                        size="middle"
                                        onChange={(
                                            pagination,
                                            filters,
                                            sorter
                                        ) => {
                                            // Persist sorter state
                                            if (!Array.isArray(sorter)) {
                                                window.localStorage.appsSortKey =
                                                    sorter.columnKey
                                                window.localStorage.appsSortOrder =
                                                    sorter.order
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        isMobile: state.globalReducer.isMobile,
    }
}

export default connect<IMobileComponent, any, any>(
    mapStateToProps,
    undefined
)(AppsTable)
