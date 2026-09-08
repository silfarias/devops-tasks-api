output "container_name" {
  description = "Nombre del contenedor creado por Terraform"
  value       = docker_container.api.name
}

output "api_url" {
  description = "URL base de la API"
  value       = "http://localhost:${var.external_port}"
}

output "metrics_url" {
  description = "Endpoint de métricas Prometheus de la API"
  value       = "http://localhost:${var.external_port}/metrics"
}

output "health_url" {
  description = "Endpoint de health check"
  value       = "http://localhost:${var.external_port}/health"
}

output "tasks_url" {
  description = "Endpoint de tareas"
  value       = "http://localhost:${var.external_port}/tasks"
}

output "prometheus_url" {
  description = "URL de la UI de Prometheus"
  value       = "http://localhost:${var.prometheus_external_port}"
}

output "grafana_url" {
  description = "URL de la UI de Grafana"
  value       = "http://localhost:${var.grafana_external_port}"
}
