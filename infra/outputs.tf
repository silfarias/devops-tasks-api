output "container_name" {
  description = "Nombre del contenedor creado por Terraform"
  value       = docker_container.api.name
}

output "api_url" {
  description = "URL base de la API"
  value       = "http://localhost:${var.external_port}"
}

output "health_url" {
  description = "Endpoint de health check"
  value       = "http://localhost:${var.external_port}/health"
}

output "tasks_url" {
  description = "Endpoint de tareas"
  value       = "http://localhost:${var.external_port}/tasks"
}