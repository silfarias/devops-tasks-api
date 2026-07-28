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