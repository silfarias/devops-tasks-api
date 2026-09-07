# Evidencia de infraestructura local con Terraform

## Objetivo

Validar que la infraestructura local de la aplicación `devops-tasks-api` puede ser creada, administrada y destruida mediante Terraform, utilizando Docker como entorno de ejecución.

## Alcance

Esta prueba corresponde a la ejecución local de Terraform desde la máquina de desarrollo.

Terraform se utilizó para reemplazar la ejecución manual del contenedor con `docker run`, dejando la infraestructura declarada mediante archivos `.tf`.

## Recursos gestionados

Terraform crea los siguientes recursos:

| Recurso           | Nombre                     | Descripción                                       |
| ----------------- | -------------------------- | ------------------------------------------------- |
| Red Docker        | `devops-tasks-api-network` | Red utilizada por el contenedor de la aplicación. |
| Contenedor Docker | `devops-tasks-api`         | Contenedor que ejecuta la API NestJS.             |
| Puerto publicado  | `3000`                     | Permite acceder a la API desde `localhost:3000`.  |

## Archivos Terraform

La infraestructura se encuentra definida en la carpeta:

```text
infra/
```

Archivos principales:

| Archivo        | Propósito                                                                    |
| -------------- | ---------------------------------------------------------------------------- |
| `versions.tf`  | Define la versión requerida de Terraform y el provider Docker.               |
| `variables.tf` | Declara variables reutilizables como nombre de imagen, contenedor y puertos. |
| `main.tf`      | Define la red Docker y el contenedor de la API.                              |
| `outputs.tf`   | Expone URLs y datos útiles luego del despliegue.                             |

## Comandos ejecutados

Desde la carpeta `infra`, se ejecutaron los siguientes comandos:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

## Resultado del despliegue

Terraform creó correctamente los recursos definidos.

El resultado de `terraform apply` indicó:

```text
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

Los outputs generados fueron:

```text
api_url = "http://localhost:3000"
container_name = "devops-tasks-api"
health_url = "http://localhost:3000/health"
tasks_url = "http://localhost:3000/tasks"
```

## Validación de la API

Luego de aplicar la infraestructura, se verificó que la aplicación estuviera disponible desde el contenedor creado por Terraform.

Comandos ejecutados:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
docker ps
```

El endpoint `/health` respondió correctamente:

```json
{
  "status": "ok",
  "service": "devops-tasks-api",
  "timestamp": "2026-07-28T18:18:43.966Z"
}
```

El endpoint `/tasks` respondió correctamente:

```json
[]
```

Además, `docker ps` mostró el contenedor `devops-tasks-api` en ejecución, exponiendo el puerto `3000`.

## Destrucción de infraestructura

Finalmente, se ejecutó:

```bash
terraform destroy
```

Terraform eliminó correctamente los recursos creados.

El resultado fue:

```text
Destroy complete! Resources: 2 destroyed.
```

## Conclusión

La infraestructura local del proyecto puede ser creada, validada, ejecutada y destruida mediante Terraform.

Esto permite versionar la infraestructura como código, reducir pasos manuales y demostrar el uso de IaC dentro del Proyecto Integrador Final.
