# Monitoreo con Prometheus y Grafana

## Estado

**Implementado** en infraestructura local con Terraform.

La evidencia detallada está en:

[monitoring-evidence.md](../monitoring-evidence.md)

## Resumen

* La API expone `GET /metrics` con `prom-client`
* Prometheus scrapea `devops-tasks-api:3000/metrics`
* Grafana se provisiona con datasource + dashboard
* Contenedores gestionados por Terraform en la misma red Docker
* Puertos locales: Prometheus `9090`, Grafana `3001`

## Resumen para exposición oral

Usamos Prometheus para recolectar métricas de la API y Grafana para visualizarlas. El stack se levanta con Terraform junto al contenedor de la aplicación, como parte del monitoreo local del PIN.
