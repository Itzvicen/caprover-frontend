import { Card, Col, Row } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import BackupCreator from './BackupCreator'
import ChangePass from './ChangePass'
import CheckUpdate from './CheckUpdate'
import DiskCleanup from './DiskCleanup'
import NginxConfig from './NginxConfig'

class Settings extends Component<
    {
        isMobile: boolean
    },
    {}
> {
    render() {
        return (
            <div>
                <Row justify="center" gutter={20}>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 10 }}
                        xs={{ span: 23 }}
                    >
                        <Card
                            style={{ height: '100%' }}
                            title="Buscar actualizaciones"
                        >
                            <CheckUpdate isMobile={this.props.isMobile} />
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 10 }}
                        xs={{ span: 23 }}
                    >
                        <Card style={{ height: '100%' }} title="Backup">
                            <BackupCreator isMobile={this.props.isMobile} />
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 20 }}
                        xs={{ span: 23 }}
                    >
                        <Card
                            style={{ height: '100%' }}
                            title="Configuraciones de NGINX"
                        >
                            <NginxConfig isMobile={this.props.isMobile} />
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 6 }}
                        xs={{ span: 23 }}
                    >
                        <Card
                            style={{ height: '100%' }}
                            title="Cambiar contraseña"
                        >
                            <ChangePass isMobile={this.props.isMobile} />
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 14 }}
                        xs={{ span: 23 }}
                    >
                        <Card style={{ height: '100%' }} title="Limpiar disco">
                            <DiskCleanup isMobile={this.props.isMobile} />
                        </Card>
                    </Col>
                </Row>
            </div>
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
)(Settings)
