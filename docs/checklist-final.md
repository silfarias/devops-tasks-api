# Checklist final — Proyecto Integrador

Documento de cierre para organizar la entrega y la defensa oral del **Proyecto 1** (GitHub Actions + Terraform + Docker), opción local.

## 1. Estado general del proyecto

El proyecto `devops-tasks-api` ya tiene implementado lo principal de la rúbrica técnica:

* API NestJS funcional (tareas en memoria, health, metrics, Swagger).
* Docker (imagen multi-stage).
* Terraform local (red + API + Prometheus + Grafana).
* GitHub Actions (lint, test, build, SBOM, Snyk, Docker build, Terraform validate).
* SBOM CycloneDX (`sbom/bom.json` + artifact en CI).
* Snyk (escaneo de dependencias con secret `SNYK_TOKEN`).
* Prometheus y Grafana (monitoreo local).
* Capturas de evidencia en `docs/capturas/`.

## 2. Checklist técnico final

| Área | Estado | Evidencia | Pendiente |
| --- | --- | --- | --- |
| Aplicación | Listo | Endpoints `/`, `/health`, `/tasks`, `/metrics`, Swagger `/api` | Revisar demo de endpoints |
| Docker | Listo | `Dockerfile`, imagen `devops-tasks-api:0.1.0` | Revalidar build antes de entregar |
| Terraform | Listo | `infra/` crea red, API, Prometheus y Grafana | Revalidar apply/destroy en Ubuntu Server |
| CI/CD | Listo | `.github/workflows/ci.yml` | Confirmar última corrida en verde |
| Seguridad | Listo | ESLint + SBOM + Snyk | Ninguno técnico mayor |
| SBOM | Listo | `sbom/bom.json`, artifact `cyclonedx-sbom` | Regenerar si cambian deps |
| Snyk | Listo | Paso en CI + captura | Mantener secret `SNYK_TOKEN` |
| Monitoreo | Listo | `/metrics`, Prometheus `:9090`, Grafana `:3001` | Confirmar target UP y dashboard |
| Documentación | En cierre | `README.md`, `docs/README.md`, capturas | Revisar textos y checklist |
| Entrega final | Pendiente | — | ZIP, guion, práctica oral, video opcional |

## 3. Checklist de validación antes de entregar

Ejecutar desde la raíz del repositorio:

```bash
yarn lint
yarn test
yarn build
yarn sbom
docker build -t devops-tasks-api:0.1.0 .
```

Terraform (solo local, no en CI):

```bash
cd infra
terraform fmt -check
terraform validate
terraform plan
terraform apply
terraform destroy
```

Aclaración: `terraform apply` y `terraform destroy` se ejecutan **solo en Ubuntu Server** con Docker Engine. GitHub Actions valida Terraform (`fmt`, `init`, `validate`), pero no despliega infraestructura. La imagen `devops-tasks-api:0.1.0` debe construirse en el servidor antes del `apply`.

## 4. Checklist de evidencias

Capturas actuales en `docs/capturas/`:

| Captura | Qué demuestra |
| --- | --- |
| `api-health-swagger.png` | Swagger UI y prueba del endpoint `/health` |
| `dockerfile-image.png` | Dockerfile multi-stage con `node:22-alpine` y usuario no root |
| `github-actions-ci-terraform-success.png` | Pipeline CI en verde (aplicación + Terraform validate) |
| `snyk-ci-success.png` | Escaneo Snyk exitoso sobre `yarn.lock` |
| `output-terraform-apply.png` | Apply local con API, Prometheus y Grafana |
| `prometheus-targets-up.png` | Target `devops-tasks-api` en estado UP |
| `grafana-dashboard.png` | Dashboard con métricas HTTP y memoria |

## 5. Pendientes reales

* Validar el proyecto desde cero en Ubuntu Server siguiendo el README.
* Rehacer en Ubuntu Server las capturas de `terraform apply`, Prometheus y Grafana (la captura actual de `terraform apply` es de Windows).
* Actualizar las capturas de CI y Snyk con la última corrida en verde (Node.js 22 y resoluciones de `multer` y `proxy-addr`).
* Preparar guion de defensa oral.
* Preparar distribución de exposición entre integrantes.
* Crear ZIP final de entrega.
* Opcional: grabar video demostrativo.

## 6. Distribución sugerida para el equipo

| Rol | Integrante | Responsabilidades |
| --- | --- | --- |
| Responsable técnico | Integrante 1 | Repo, pipeline, Docker, Terraform y monitoreo |
| Responsable documentación/presentación | Integrante 2 | README, capturas, narrativa y slides (si hacen falta) |
| Responsable demo/pruebas | Integrante 3 | Ejecutar el proyecto desde cero, probar endpoints, validar Prometheus/Grafana y preparar video demo |

Los nombres propios se asignan después, según disponibilidad del equipo.

## 7. Criterio para no seguir agregando funcionalidades

El proyecto ya cubre la rúbrica técnica del Proyecto 1.  
Desde este punto, solo deberían agregarse:

* correcciones
* documentación
* mejoras menores de presentación

No agregar:

* base de datos
* frontend
* login / autenticación
* despliegue en nube
* Kubernetes

## 8. Resumen final

El proyecto se encuentra **técnicamente completo** para la defensa del PIN.  
La prioridad hasta la presentación es validar el flujo de punta a punta, revisar documentación, empaquetar la entrega y practicar la exposición oral.
