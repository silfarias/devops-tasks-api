# Evidencia de monitoreo local (Prometheus + Grafana)

Este documento explica el stack de monitoreo local del Proyecto 1 del PIN para `devops-tasks-api`.

## Objetivo

Observar métricas de la API NestJS de forma visual y reproducible, usando:

* `/metrics` en la aplicación
* Prometheus para recolectar métricas
* Grafana para visualizarlas
* Terraform para levantar el stack local con Docker

## Rol de cada componente

### `GET /metrics`

Endpoint de la API que expone métricas en formato Prometheus (librería `prom-client`).

Incluye:

* métricas default de Node.js
* métricas HTTP propias (`http_requests_total`, `http_request_duration_seconds`)

### Prometheus

Servicio que hace scrape periódico del endpoint `/metrics` del contenedor `devops-tasks-api`.

Configuración principal:

* Job: `devops-tasks-api`
* Target: `devops-tasks-api:3000`
* Path: `/metrics`
* Intervalo: `10s`

Archivo:

```text
monitoring/prometheus/prometheus.yml
```

UI local:

```text
http://localhost:9090
```

### Grafana

Servicio de dashboards. Se provisiona automáticamente con:

* Datasource Prometheus (`http://prometheus:9090`)
* Dashboard básico `DevOps Tasks API`

Archivos:

```text
monitoring/grafana/provisioning/
monitoring/grafana/dashboards/devops-tasks-api.json
```

UI local:

```text
http://localhost:3001
```

Usuario local por defecto: `admin` / `admin`.

## Cómo Terraform levanta el stack

Terraform (carpeta `infra/`) crea en la misma red Docker:

1. Contenedor de la API (`devops-tasks-api`)
2. Contenedor `prometheus` (puerto `9090:9090`)
3. Contenedor `grafana` (puerto `3001:3000`)

No se usa Docker Compose. Todo el stack local de monitoreo se gestiona con Terraform + Docker.

## Comandos para probar

Desde la raíz del proyecto:

```bash
docker build -t devops-tasks-api:0.1.0 .
cd infra
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Validaciones:

```bash
curl.exe http://localhost:3000/health
curl.exe http://localhost:3000/metrics
```

Abrir en el navegador:

* API metrics: `http://localhost:3000/metrics`
* Prometheus: `http://localhost:9090`
* Grafana: `http://localhost:3001`

En Prometheus → **Status → Targets**, el target `devops-tasks-api` debe estar **UP**.

En Grafana:

1. Login `admin` / `admin`
2. Verificar datasource Prometheus
3. Abrir dashboard **DevOps Tasks API**
4. Generar tráfico (`curl.exe http://localhost:3000/health` varias veces) para ver datos

Para destruir:

```bash
cd infra
terraform destroy
```

## Outputs útiles de Terraform

* `api_url`
* `metrics_url`
* `prometheus_url`
* `grafana_url`

## Capturas recomendadas para la entrega

Guardar en `docs/capturas/`:

1. `prometheus-targets-up.png` — target `devops-tasks-api` en estado UP
2. `grafana-dashboard.png` — dashboard con paneles visibles
3. `metrics-endpoint.png` — respuesta de `/metrics` (opcional)
4. `terraform-apply-monitoring.png` — apply con los 3 contenedores (opcional)

## Aclaración para el PIN

Prometheus y Grafana forman parte del **monitoreo local** del Proyecto 1.  
GitHub Actions **no** ejecuta `terraform apply`; solo valida Terraform (`fmt`, `init`, `validate`). El stack de monitoreo se levanta en la máquina de desarrollo con Docker Desktop.

## Resumen para exposición oral

La API expone métricas en `/metrics`. Prometheus las recolecta cada 10 segundos desde el contenedor de la API. Grafana se provisiona con datasource Prometheus y un dashboard básico de requests, tasa, latencia y memoria del proceso Node.js. Todo el stack local se crea con Terraform sobre la misma red Docker, sin Docker Compose.
