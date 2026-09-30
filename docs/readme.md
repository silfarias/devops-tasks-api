# Evidencias del Proyecto Integrador

Proyecto: **devops-tasks-api**  
PIN: **Proyecto 1 — GitHub Actions + Terraform + Docker** (opción local: Ubuntu Server + Docker Engine)

La aplicación es una API NestJS de tareas en memoria. Sirve de base para demostrar el flujo DevOps: CI/CD, contenedores, IaC, seguridad y monitoreo.

El detalle operativo (comandos, stack, URLs) está en el [README de la raíz](../README.md).  
Esta carpeta concentra la **evidencia** de la entrega.

Checklist de cierre y defensa: [checklist-final.md](./checklist-final.md).  
Informe técnico completo del flujo DevOps: [Informe-Tecnico-PIN-Devops.docx](./Informe-Tecnico-PIN-Devops.docx).

## Qué se demuestra

| Área | Evidencia principal |
| --- | --- |
| CI/CD | Workflow `.github/workflows/ci.yml`: lint, test, build, SBOM, Snyk, Docker build, Terraform validate |
| Docker | Dockerfile multi-stage (`devops-tasks-api:0.1.0`) sobre `node:22-alpine`, ejecutado como usuario no root |
| Terraform | Red + API + Prometheus + Grafana sobre Docker Engine en Ubuntu Server |
| Seguridad | ESLint, SBOM CycloneDX (`sbom/bom.json`), Snyk con secret `SNYK_TOKEN` |
| Monitoreo | `/metrics`, Prometheus (`:9090`), Grafana (`:3001`) |
| API | Endpoints REST + Swagger en `/api` |

## Capturas

Carpeta [`capturas/`](./capturas/):

* `api-health-swagger.png` — Swagger UI y prueba del endpoint `/health`
* `dockerfile-image.png` — Dockerfile multi-stage
* `github-actions-ci-terraform-success.png` — pipeline CI en verde
* `snyk-ci-success.png` — Snyk en CI sin vulnerabilidades
* `output-terraform-apply.png` — `terraform apply` con API, Prometheus y Grafana
* `prometheus-targets-up.png` — target `devops-tasks-api` en UP
* `grafana-dashboard.png` — dashboard con métricas HTTP y memoria

## Aclaración

GitHub Actions **valida** Terraform, pero **no** ejecuta `terraform apply`.  
El stack se levanta en Ubuntu Server con Docker Engine: primero se construye la imagen con `docker build` y luego Terraform crea la red y los contenedores.
