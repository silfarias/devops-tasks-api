provider "docker" {}

resource "docker_network" "app_network" {
  name = "${var.container_name}-network"
}

resource "docker_container" "api" {
  name  = var.container_name
  image = var.image_name

  restart = "unless-stopped"

  env = [
    "NODE_ENV=production"
  ]

  ports {
    internal = var.internal_port
    external = var.external_port
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}