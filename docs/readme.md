# Evidencias del Proyecto Integrador

Proyecto: **devops-tasks-api**  
PIN: **Proyecto 1 — GitHub Actions + Terraform + Docker** (opción local)

La aplicación es una API NestJS de tareas en memoria. Sirve de base para demostrar el flujo DevOps: CI/CD, contenedores, IaC, seguridad y monitoreo.

El detalle operativo (comandos, stack, URLs) está en el [README de la raíz](../README.md).  
Esta carpeta concentra la **evidencia** de la entrega.

Checklist de cierre y defensa: [checklist-final.md](./checklist-final.md).

## Qué se demuestra

| Área | Evidencia principal |
| --- | --- |
| CI/CD | Workflow `.github/workflows/ci.yml`: lint, test, build, SBOM, Snyk, Docker build, Terraform validate |
| Docker | Dockerfile multi-stage (`devops-tasks-api:0.1.0`) |
| Terraform | Red + API + Prometheus + Grafana en Docker Desktop |
| Seguridad | ESLint, SBOM CycloneDX (`sbom/bom.json`), Snyk con secret `SNYK_TOKEN` |
| Monitoreo | `/metrics`, Prometheus (`:9090`), Grafana (`:3001`) |
| API | Endpoints REST + Swagger en `/api` |

## Capturas

Carpeta [`capturas/`](./capturas/):

* `github-actions-ci-terraform-success.png` — pipeline CI en verde
* `snyk-ci-success.png` — Snyk en CI sin vulnerabilidades
* `output-terraform-apply.png` — `terraform apply` con API, Prometheus y Grafana
* `prometheus-targets-up.png` — target `devops-tasks-api` en UP
* `grafana-dashboard.png` — dashboard con métricas HTTP y memoria

También se conserva la consigna oficial: `Proyecto Integrador Final (PIN).pdf`.

## Aclaración

GitHub Actions **valida** Terraform, pero **no** ejecuta `terraform apply`.  
El stack local se levanta en la máquina de desarrollo con Docker Desktop.
