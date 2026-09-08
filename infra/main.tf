provider "docker" {}

locals {
  monitoring_root = abspath("${path.module}/../monitoring")
}

resource "docker_network" "app_network" {
  name = "${var.container_name}-network"
}

resource "docker_image" "prometheus" {
  name         = var.prometheus_image
  keep_locally = true
}

resource "docker_image" "grafana" {
  name         = var.grafana_image
  keep_locally = true
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

resource "docker_container" "prometheus" {
  name  = var.prometheus_container_name
  image = docker_image.prometheus.image_id

  restart = "unless-stopped"

  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--web.enable-lifecycle"
  ]

  ports {
    internal = 9090
    external = var.prometheus_external_port
  }

  volumes {
    host_path      = "${local.monitoring_root}/prometheus/prometheus.yml"
    container_path = "/etc/prometheus/prometheus.yml"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [
    docker_container.api
  ]
}

resource "docker_container" "grafana" {
  name  = var.grafana_container_name
  image = docker_image.grafana.image_id

  restart = "unless-stopped"

  env = [
    "GF_SECURITY_ADMIN_USER=${var.grafana_admin_user}",
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_admin_password}",
    "GF_USERS_ALLOW_SIGN_UP=false",
    "GF_AUTH_ANONYMOUS_ENABLED=false"
  ]

  ports {
    internal = 3000
    external = var.grafana_external_port
  }

  volumes {
    host_path      = "${local.monitoring_root}/grafana/provisioning"
    container_path = "/etc/grafana/provisioning"
    read_only      = true
  }

  volumes {
    host_path      = "${local.monitoring_root}/grafana/dashboards"
    container_path = "/var/lib/grafana/dashboards"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [
    docker_container.prometheus
  ]
}
