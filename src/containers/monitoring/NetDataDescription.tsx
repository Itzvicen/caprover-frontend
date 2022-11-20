import React, { Component } from 'react'
import NewTabLink from '../global/NewTabLink'

export default class NetDataDescription extends Component {
    render() {
        return (
            <div>
                <p>
                    <NewTabLink url="https://github.com/netdata/netdata/">
                        NetData
                    </NewTabLink>{' '}
                    es uno de los sistemas de monitoreo más populares y poderosos
                     herramientas que proporcionan una interfaz web. es un sistema para
                     Rendimiento distribuido en tiempo real y supervisión de la salud. Eso
                     proporciona información inigualable, en tiempo real, de todo
                     sucediendo en el sistema que ejecuta (incluidas aplicaciones como
                     como servidores web y de base de datos), utilizando la web interactiva moderna
                     tableros de instrumentos
                </p>
                <p>
                NetData es rápido y eficiente, diseñado para ejecutarse permanentemente
                     en todos los sistemas (servidores físicos y virtuales, contenedores,
                     dispositivos IoT), sin interrumpir su función principal. los
                     la imagen actual de NetData incrustada en CapRover utiliza un valor predeterminado
                     configuración para
                    <NewTabLink url="https://docs.netdata.cloud/docs/anonymous-statistics/">
                        &nbsp;estadisticas
                    </NewTabLink>
                    . Puede volver a compilar CapRover con una configuración personalizada diferente
                     imagen si lo desea.
                </p>
                <p>
                Spacecloud proporciona una interfaz simple para habilitar NetData en
                     su instancia de CapRover. Actualmente, CapRover solo admite
                     instalando NetData en su <b>nodo líder</b>, es decir, el
                     nodo donde reside la instancia de CapRover. Esta limitación se debe
                     a una limitación en la interfaz de Docker,
                    <NewTabLink url="https://github.com/moby/moby/issues/25885/">
                        {' '}
                        ver aquí
                    </NewTabLink>
                    .
                </p>
                <p>
                    <i>Para obtener más detalles sobre NetData, visite su </i>
                    <NewTabLink url="https://github.com/firehol/netdata/">
                        página de GitHub
                    </NewTabLink>
                    .
                </p>
            </div>
        )
    }
}
