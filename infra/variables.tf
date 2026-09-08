variable "container_name" {
  description = "Nombre del contenedor Docker de la API"
  type        = string
  default     = "devops-tasks-api"
}

variable "image_name" {
  description = "Nombre de la imagen Docker que se usará para levantar la API"
  type        = string
  default     = "devops-tasks-api:0.1.0"
}

variable "internal_port" {
  description = "Puerto interno expuesto por la aplicación dentro del contenedor"
  type        = number
  default     = 3000
}

variable "external_port" {
  description = "Puerto externo disponible en la máquina local"
  type        = number
  default     = 3000
}

variable "prometheus_container_name" {
  description = "Nombre del contenedor Docker de Prometheus"
  type        = string
  default     = "prometheus"
}

variable "prometheus_image" {
  description = "Imagen Docker de Prometheus"
  type        = string
  default     = "prom/prometheus:v2.55.1"
}

variable "prometheus_external_port" {
  description = "Puerto externo de Prometheus en la máquina local"
  type        = number
  default     = 9090
}

variable "grafana_container_name" {
  description = "Nombre del contenedor Docker de Grafana"
  type        = string
  default     = "grafana"
}

variable "grafana_image" {
  description = "Imagen Docker de Grafana"
  type        = string
  default     = "grafana/grafana:11.2.2"
}

variable "grafana_external_port" {
  description = "Puerto externo de Grafana en la máquina local"
  type        = number
  default     = 3001
}

variable "grafana_admin_user" {
  description = "Usuario administrador de Grafana"
  type        = string
  default     = "admin"
}

variable "grafana_admin_password" {
  description = "Password administrador de Grafana (solo entorno local del PIN)"
  type        = string
  default     = "admin"
  sensitive   = true
}
