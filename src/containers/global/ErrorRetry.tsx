import { Button, Row } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'

class ErrorRetry extends Component<any, {}> {
    render() {
        const self = this
        return (
            <div style={{ textAlign: 'center', padding: 36 }}>
                <p>A ocurrido un error. Por favor, intentalo de nuevo</p>
                <Row justify="center">
                    <Button
                        type="primary"
                        onClick={() => {
                            self.props.emitRootKeyChanged()
                        }}
                    >
                        Recargar
                    </Button>
                </Row>
            </div>
        )
    }
}

export default connect(undefined, {
    emitRootKeyChanged: emitRootKeyChanged,
})(ErrorRetry)
