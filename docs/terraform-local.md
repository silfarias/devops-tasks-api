# Evidencia de infraestructura local con Terraform

## Objetivo

Validar que la infraestructura local de la aplicación `devops-tasks-api` puede ser gestionada mediante Terraform, utilizando Docker como entorno de ejecución.

## Recursos gestionados

Terraform crea los siguientes recursos:

* Una red Docker llamada `devops-tasks-api-network`.
* Un contenedor Docker llamado `devops-tasks-api`.
* Publicación del puerto `3000` para acceder a la API desde `localhost`.

## Comandos ejecutados

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Luego de aplicar la infraestructura, se validó el funcionamiento de la aplicación con:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
docker ps
```

## Resultado

La API respondió correctamente desde el contenedor creado por Terraform.

El endpoint `/health` devolvió el estado del servicio:

```json
{
  "status": "ok",
  "service": "devops-tasks-api",
  "timestamp": "2026-07-28T18:18:43.966Z"
}
```

El endpoint `/tasks` devolvió un arreglo vacío, confirmando que la API estaba disponible:

```json
[]
```

Finalmente, se ejecutó:

```bash
terraform destroy
```

Terraform eliminó correctamente los recursos creados.

## Conclusión

La infraestructura local del proyecto puede ser creada, validada, ejecutada y destruida mediante Terraform. Esto permite versionar la configuración de infraestructura como código y evita depender de comandos manuales como `docker run`.