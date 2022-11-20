import { Collapse } from 'antd'
import React, { Component } from 'react'

export default class DockerRegistriesStaticInfo extends Component {
    render() {
        return (
            <div>
                <p>
                La configuración de Docker Registry es <b>solo necesaria</b> si
                     planee ejecutar su CapRover en un clúster. Para un solo nodo
                     Implementaciones de CapRover, Docker Registry no se recomienda como
                     hace que la implementación sea significativamente más lenta.
                </p>
                <Collapse>
                    <Collapse.Panel header="Más información" key="1">
                        <p>
                        El registro de Docker es un repositorio para su compilado
                            imágenes Es similar a Github, o Bitbucket, con
                            repositorios privados. Sin embargo, en lugar de la fuente
                            código, contiene los artefactos construidos para su
                            solicitud. Es necesario para el modo clúster, ya que
                            otros nodos necesitan acceder a la imagen construida para
                            para que su aplicación se ejecute en ellos.
                        </p>
                        <p>
                            Spacecloud proporciona dos métodos para configurar su
                            registro acoplable:
                        </p>
                        <ul>
                            <li>
                                <b>Registro de Docker autohospedado:</b> Este es el
                                forma más sencilla de configurar un registro docker.
                                CapRover crea una instancia de Docker Registry
                                en la máquina principal y gestiona el registro
                                para ti. Sin embargo, tiene su propia limitación. Si
                                su máquina principal está destruida, su local
                                las imágenes se perderán. En la mayoría de los casos, esto no es
                                un desastre ya que puede volver a implementar sus aplicaciones desde
                                su código fuente.
                                <br />
                            </li>
                            <li>
                                <b>Registro remoto de Docker:</b> este enfoque
                                depende de un servicio remoto para actuar como su Docker
                                Registro. Con este enfoque, tendrá una
                                clúster más fiable, suponiendo que el tercero
                                ¡El servicio que usas es confiable! hay varios
                                Servicios privados de Docker Registry disponibles:
                                Registro de contenedores de Google, contenedor Amazon EC2
                                Registry, Quay, etc. Tenga en cuenta que este enfoque
                                te cuesta dinero.
                            </li>
                        </ul>
                    </Collapse.Panel>
                </Collapse>
            </div>
        )
    }
}
