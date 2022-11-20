import { Button, Input, message, Row } from 'antd'
import React from 'react'
import Toaster from '../../utils/Toaster'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

export default class ChangePass extends ApiComponent<
    {
        isMobile: boolean
    },
    { isLoading: boolean; old: string; new1: string; new2: string }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            old: '',
            new1: '',
            new2: '',
        }
    }

    onChangePasswordClicked() {
        const self = this
        if (!this.state.new1) {
            message.error('La nueva contraseña no puede estar vacía')
            return
        }

        if (this.state.new1 !== this.state.new2) {
            message.error('La confirmación de nuevas contraseñas no coincide')
            return
        }

        this.setState({ isLoading: true })

        this.apiManager
            .changePass(this.state.old, this.state.new1)
            .then(function () {
                message.success('¡Contraseña cambiada con éxito!')
            })
            .catch(Toaster.createCatcher())
            .then(function () {
                self.apiManager.getAuthToken(self.state.new1)
                self.setState({ isLoading: false })
            })
    }

    render() {
        if (this.state.isLoading) {
            return <CenteredSpinner />
        }

        return (
            <div>
                Contraseña anterior
                <Input.Password
                    onChange={(e) => this.setState({ old: e.target.value })}
                />
                <div style={{ height: 20 }} />
                <hr />
                <div style={{ height: 20 }} />
                Nueva contraseña
                <Input.Password
                    maxLength={30}
                    onChange={(e) => this.setState({ new1: e.target.value })}
                />
                <div style={{ height: 20 }} />
                Confirmar nueva contraseña
                <Input.Password
                    maxLength={30}
                    onChange={(e) => this.setState({ new2: e.target.value })}
                />
                <div style={{ height: 40 }} />
                <Row justify="end">
                    <Button
                        block={this.props.isMobile}
                        onClick={() => this.onChangePasswordClicked()}
                        type="primary"
                    >
                        Cambiar contraseña
                    </Button>
                </Row>
            </div>
        )
    }
}
