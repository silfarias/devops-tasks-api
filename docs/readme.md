# Documentación del Proyecto Integrador DevOps

Esta carpeta organiza la evidencia y las explicaciones del proyecto `devops-tasks-api` **por herramienta**, para facilitar:

* el estudio y la exposición oral
* el armado del documento formal de entrega
* el seguimiento de lo ya validado y lo pendiente

## Cómo usar esta carpeta para el documento formal

Seguí este orden al armar el informe final:

1. [Aplicación](./aplicacion/overview.md)
2. [CI/CD — GitHub Actions](./cicd/github-actions.md)
3. [Docker](./docker/docker.md)
4. [Terraform](./terraform/terraform-local.md)
5. [Seguridad — SBOM](./seguridad/sbom.md)
6. [Seguridad — Snyk](./seguridad/snyk.md) *(integrado, validar corrida)*
7. [Monitoreo](./monitoreo/prometheus-grafana.md)
8. [Evidencia de monitoreo](./monitoring-evidence.md)
9. Capturas en [capturas/](./capturas/)

Cada documento incluye contexto técnico y, cuando aplica, un resumen útil para la exposición.

## Estructura

```text
docs/
├── README.md
├── contexto-pin.md
├── aplicacion/
│   └── overview.md
├── cicd/
│   └── github-actions.md
├── docker/
│   └── docker.md
├── terraform/
│   └── terraform-local.md
├── seguridad/
│   ├── sbom.md
│   └── snyk.md
├── monitoreo/
│   └── prometheus-grafana.md
├── monitoring-evidence.md
└── capturas/
```

## Índice de evidencias

| Área | Documento | Estado | Descripción |
| --- | --- | --- | --- |
| Aplicación | [aplicacion/overview.md](./aplicacion/overview.md) | Validado | API NestJS, endpoints y alcance del PIN |
| CI/CD | [cicd/github-actions.md](./cicd/github-actions.md) | Validado | Pipeline: lint, test, build, SBOM, Snyk, Docker, Terraform validate |
| Docker | [docker/docker.md](./docker/docker.md) | Validado | Dockerfile multi-stage y build de imagen |
| Terraform | [terraform/terraform-local.md](./terraform/terraform-local.md) | Validado | Infra local: red + contenedor Docker |
| Seguridad | [seguridad/sbom.md](./seguridad/sbom.md) | Validado | SBOM CycloneDX + artifact en CI |
| Seguridad | [seguridad/snyk.md](./seguridad/snyk.md) | Integrado | Escaneo de vulnerabilidades en CI (validar corrida) |
| Monitoreo | [monitoreo/prometheus-grafana.md](./monitoreo/prometheus-grafana.md) | Implementado | Resumen del stack Prometheus + Grafana |
| Monitoreo | [monitoring-evidence.md](./monitoring-evidence.md) | Implementado | Evidencia: scrape, dashboard y comandos Terraform |
| Capturas | [capturas/](./capturas/) | En progreso | Respaldo visual para la entrega |

## Captura principal del pipeline

Ejecución exitosa del workflow `CI` (aplicación + Terraform):

![Workflow CI con aplicación, Docker y Terraform](./capturas/github-actions-ci-terraform-success.png)

## Estado general frente a la rúbrica

| Área | Estado |
| --- | --- |
| Aplicación NestJS | Validada |
| Pipeline CI/CD | Validado |
| Docker | Validado |
| Terraform local + validate en CI | Validado |
| SBOM CycloneDX | Validado |
| Snyk | Integrado (validar corrida en Actions) |
| Monitoreo Prometheus/Grafana | Implementado (falta capturas de evidencia) |
| Documento formal final | En armado a partir de esta carpeta |

## Observaciones importantes

* GitHub Actions **valida** Terraform (`fmt`, `init`, `validate`), pero **no** ejecuta `terraform apply` ni `destroy`.
* El despliegue local depende de Docker Desktop y se gestiona con Terraform desde la máquina de desarrollo.
* `contexto-pin.md` es contexto interno de trabajo del proyecto; la evidencia formal para la entrega está en las carpetas por herramienta.

## Flujo DevOps documentado

```text
Aplicación NestJS
    ↓
GitHub Actions (lint + test + build)
    ↓
SBOM CycloneDX
    ↓
Snyk (escaneo de vulnerabilidades)
    ↓
Docker build
    ↓
Terraform validate (CI) + apply local
    ↓
Prometheus + Grafana (monitoreo local)
```
