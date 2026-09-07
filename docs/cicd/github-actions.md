# Evidencia de pipeline CI/CD

## Objetivo

Validar que el proyecto `devops-tasks-api` cuenta con un pipeline automatizado en GitHub Actions para controlar calidad, pruebas, compilación, generación de SBOM, escaneo de vulnerabilidades con Snyk, construcción de imagen Docker y validación de infraestructura Terraform.

## Workflow utilizado

El workflow se encuentra en:

```text
.github/workflows/ci.yml
```

Se ejecuta automáticamente ante:

* Push a la rama `main`.
* Pull request hacia la rama `main`.

## Jobs del pipeline

El workflow está dividido en dos jobs principales:

| Job                            | Propósito                                                                   |
| ------------------------------ | --------------------------------------------------------------------------- |
| `Lint, test, build and Docker` | Validar la aplicación NestJS, generar SBOM, escanear con Snyk y construir la imagen Docker. |
| `Terraform validate`           | Validar la configuración de infraestructura definida en la carpeta `infra`.                 |

## Validaciones de la aplicación

El primer job ejecuta las siguientes etapas:

1. Checkout del repositorio.
2. Setup de Node.js 24 (sin cache automático de Yarn).
3. Habilitación de Corepack.
4. Preparación de Yarn 4.18.0.
5. Verificación de versiones (`node` y `yarn`).
6. Instalación de dependencias con `yarn install --immutable`.
7. Ejecución de ESLint (`yarn lint`).
8. Ejecución de tests con Jest (`yarn test`).
9. Build de la aplicación NestJS (`yarn build`).
10. Generación del SBOM CycloneDX (`yarn sbom`).
11. Upload del artifact `cyclonedx-sbom` (`sbom/bom.json`).
12. Escaneo de vulnerabilidades con Snyk.
13. Construcción de la imagen Docker.

Estas validaciones permiten detectar errores de código, fallos de pruebas, problemas de compilación, ausencia del SBOM, vulnerabilidades de dependencias o fallos en la construcción del contenedor antes de avanzar con nuevos cambios.

## Generación de SBOM en CI

Después del build, el pipeline genera el inventario de componentes y lo publica como artifact:

```yml
- name: Generate SBOM
  run: yarn sbom

- name: Upload CycloneDX SBOM
  uses: actions/upload-artifact@v6
  with:
    name: cyclonedx-sbom
    path: sbom/bom.json
    if-no-files-found: error
```

Más detalle en [seguridad/sbom.md](../seguridad/sbom.md).

## Escaneo con Snyk en CI

Después del SBOM, el pipeline analiza vulnerabilidades de dependencias:

```yml
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity=high --package-manager=yarn --file=yarn.lock
```
Más detalle en [seguridad/snyk.md](../seguridad/snyk.md).

## Validaciones de Terraform

El segundo job ejecuta validaciones sobre la infraestructura definida en la carpeta `infra`.

Los comandos ejecutados son:

```bash
terraform fmt -check
terraform init -input=false
terraform validate
```

Este job verifica que los archivos Terraform tengan formato correcto, que los providers puedan inicializarse y que la configuración sea válida.

## Alcance de la validación

El pipeline no ejecuta:

```bash
terraform apply
```

Tampoco ejecuta:

```bash
terraform destroy
```

Esto se definió así porque el despliegue local depende de Docker Desktop en la máquina de desarrollo. En esta etapa, GitHub Actions se utiliza para validar la configuración, no para crear infraestructura local.

## Evidencia visual

La siguiente captura muestra una ejecución exitosa del workflow `CI`, con ambos jobs finalizados correctamente:

![Workflow CI con aplicación, Docker y Terraform](../capturas/github-actions-ci-terraform-success.png)

## Resultado

El pipeline finalizó correctamente, validando:

* Código fuente de la aplicación.
* Pruebas automáticas.
* Build de NestJS.
* Generación y publicación del SBOM.
* Escaneo de vulnerabilidades con Snyk.
* Construcción de imagen Docker.
* Formato y validez de archivos Terraform.

## Conclusión

El proyecto cuenta con un pipeline CI/CD funcional. Este pipeline permite automatizar controles básicos de calidad, generar evidencia de seguridad (SBOM), verificar la construcción del contenedor y validar la infraestructura como código antes de integrar nuevos cambios.
