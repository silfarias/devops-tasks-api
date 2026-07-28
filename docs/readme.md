# Evidencias del Proyecto Integrador DevOps

Esta carpeta reúne las evidencias técnicas del avance del Proyecto Integrador Final.

El objetivo de esta documentación es registrar, de forma ordenada, las pruebas realizadas sobre el pipeline CI/CD, la construcción del contenedor Docker y la validación de infraestructura como código con Terraform.

## Evidencias disponibles

| Documento            | Descripción                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `ci-cd-evidence.md`  | Evidencia del workflow de GitHub Actions, incluyendo validaciones de aplicación, Docker y Terraform. |
| `terraform-local.md` | Evidencia de ejecución local de Terraform para crear y destruir infraestructura Docker.              |
| `capturas/`          | Carpeta con capturas utilizadas como respaldo visual de las pruebas realizadas.                      |

## Captura principal del pipeline

La siguiente captura muestra una ejecución exitosa del workflow `CI`, con los jobs de aplicación y validación de Terraform finalizados correctamente.

![Workflow CI con aplicación, Docker y Terraform](./capturas/github-actions-ci-terraform-success.png)

## Estado actual de evidencias

| Área                  | Estado   | Evidencia                                                               |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| Aplicación NestJS     | Validada | Lint, tests y build ejecutados en GitHub Actions                        |
| Docker                | Validado | Imagen Docker construida en el pipeline                                 |
| Terraform             | Validado | Archivos `.tf` formateados, inicializados y validados en GitHub Actions |
| Infraestructura local | Validada | Contenedor Docker creado y destruido mediante Terraform                 |

## Observación

El pipeline valida Terraform, pero no ejecuta `terraform apply` desde GitHub Actions. El despliegue local se realiza desde la máquina de desarrollo porque depende de Docker Desktop y del entorno local donde se ejecuta el proyecto.