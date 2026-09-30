# Evidencias del Proyecto Integrador

Proyecto: **devops-tasks-api**  
PIN: **Proyecto 1 — GitHub Actions + Terraform + Docker** (opción local: Ubuntu Server + Docker Engine)

La aplicación es una API NestJS de tareas en memoria. Sirve de base para demostrar el flujo DevOps: CI/CD, contenedores, IaC, seguridad y monitoreo.

El detalle operativo (requisitos, comandos, despliegue en Ubuntu Server y URLs) está en el [README de la raíz](../README.md).  
Esta carpeta concentra la **evidencia** de la entrega.

## Qué se demuestra

| Área | Evidencia principal |
| --- | --- |
| CI/CD | Workflow `.github/workflows/ci.yml` con Node.js 22: lint, test, build, SBOM, Snyk, Docker build y Terraform validate |
| Docker | Dockerfile multi-stage (`devops-tasks-api:0.1.0`) sobre `node:22-alpine`, ejecutado como usuario no root |
| Terraform | Red + API + Prometheus + Grafana sobre Docker Engine en Ubuntu Server |
| Seguridad | ESLint, SBOM CycloneDX (`sbom/bom.json` + artifact `cyclonedx-sbom`), Snyk con secret `SNYK_TOKEN` |
| Monitoreo | `/metrics`, Prometheus (`:9090`), Grafana (`:3001`) |
| API | Endpoints REST + Swagger en `/api` |

## Capturas

Carpeta [`capturas/`](./capturas/):

| Captura | Qué demuestra |
| --- | --- |
| `github-actions-ci-terraform-success.png` | Pipeline CI en verde: jobs de aplicación y Terraform validate |
| `cyclonedx-sbom-run-snyk.png` | SBOM publicado como artifact `cyclonedx-sbom` y Snyk sin vulnerabilidades |
| `api-health-swagger.png` | Swagger UI y prueba del endpoint `/health` |
| `dockerfile-image.png` | Dockerfile multi-stage con `node:22-alpine` y usuario no root |
| `output-terraform-apply.png` | `terraform apply` con red, API, Prometheus y Grafana |
| `prometheus-targets-up.png` | Target `devops-tasks-api` en estado UP |
| `grafana-dashboard.png` | Dashboard con métricas HTTP y memoria del proceso |

## Aclaración

GitHub Actions **valida** Terraform, pero **no** ejecuta `terraform apply`.  
El stack se levanta en Ubuntu Server con Docker Engine: primero se construye la imagen con `docker build` y luego Terraform crea la red y los contenedores.
