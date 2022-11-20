import { Card, Col, Row } from 'antd'
import React, { Component } from 'react'
import DockerRegistries from './DockerRegistries'
import Nodes from './Nodes'

export default class Cluster extends Component {
    render() {
        return (
            <div>
                <Row justify="center">
                    <Col lg={{ span: 20 }} xs={{ span: 23 }}>
                        <Card title="Configuración del registro de Docker">
                            <DockerRegistries />
                        </Card>
                    </Col>
                </Row>
                <div style={{ height: 35 }} />
                <Row justify="center">
                    <Col lg={{ span: 20 }} xs={{ span: 23 }}>
                        <Card title="Nodos">
                            <Nodes />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
    componentDidMount() {}
}
