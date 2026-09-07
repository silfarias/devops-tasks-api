# Monitoreo con Prometheus y Grafana — pendiente

## Estado

**Pendiente.** Todavía no está implementado en este proyecto.

## Objetivo en el PIN

Agregar monitoreo básico de la API y dejar evidencia visual (dashboard) para la entrega.

## Qué se espera implementar

1. Agregar métricas a NestJS (por ejemplo con `prom-client`).
2. Exponer un endpoint:

```text
GET /metrics
```

3. Levantar Prometheus y Grafana.
4. Crear un dashboard básico.
5. Guardar captura en `docs/capturas/`.
6. Completar esta documentación con evidencia real.

## Métricas básicas sugeridas

* Cantidad de requests
* Duración de requests
* Estado del servicio
* Métricas default de Node.js, si resulta viable

## Alternativas de despliegue local

Cuando se implemente, se puede elegir la opción más clara y defendible para el PIN:

* Ampliar Terraform para crear contenedores de Prometheus y Grafana
* Usar Docker Compose solo para monitoreo, si facilita el entorno local

## Reglas

* No romper endpoints existentes (`/health`, `/tasks`, etc.).
* No inventar capturas ni dashboards antes de tenerlos funcionando.
* Documentar el enfoque elegido cuando se implemente.

## Resumen para exposición oral (estado actual)

El monitoreo con Prometheus y Grafana todavía está pendiente. El plan es exponer `/metrics` desde la API, recolectar métricas con Prometheus, visualizarlas en Grafana y dejar captura como evidencia del PIN.
