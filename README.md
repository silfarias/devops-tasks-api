# devops-tasks-api

API REST simple de tareas desarrollada con **NestJS** y **TypeScript**.

Este proyecto se utiliza como aplicación base para implementar un flujo DevOps completo dentro del **Proyecto Integrador Final (PIN)** de la Diplomatura Universitaria en DevOps.

## Contexto del PIN

El repositorio corresponde al **Proyecto 1: CI/CD con GitHub Actions + Terraform + Docker**.

El objetivo técnico es demostrar, sobre una aplicación funcional y simple:

* CI/CD automatizado.
* Construcción de contenedores Docker.
* Infraestructura como código con Terraform.
* Controles de seguridad con ESLint, SBOM y Snyk.
* Monitoreo local con Prometheus y Grafana.
* Documentación técnica con evidencias.

La aplicación trabaja con tareas en memoria. No incluye base de datos, frontend ni autenticación, ya que el foco principal del proyecto es el flujo DevOps y no la complejidad funcional de la aplicación. Para facilitar la exploración de endpoints, la API incluye documentación interactiva con **Swagger** en `/api`.

## Stack utilizado

| Categoría                   | Tecnología             |
| --------------------------- | ---------------------- |
| Entorno de despliegue       | Ubuntu Server + Docker Engine |
| Runtime                     | Node.js 22 LTS         |
| Package manager             | Yarn 4.18.0 + Corepack |
| Framework                   | NestJS + TypeScript    |
| Documentación de API        | Swagger (OpenAPI)      |
| Calidad y testing           | Jest + ESLint          |
| Contenedores                | Docker                 |
| Infraestructura como código | Terraform              |
| CI/CD                       | GitHub Actions         |
| SBOM                        | CycloneDX              |
| Seguridad                   | Snyk                   |
| Monitoreo                   | Prometheus + Grafana   |

## Endpoints principales

```text
GET    /
GET    /health
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
PATCH  /tasks/:id/complete
DELETE /tasks/:id
GET    /metrics
```

La documentación interactiva de la API está disponible con **Swagger** en:

```text
http://localhost:3000/api
```

## Requisitos

Para desplegar el entorno completo (Ubuntu Server):

* Git
* Docker Engine
* Terraform >= 1.8

Node.js y Yarn **no** son necesarios en el servidor: la imagen Docker ya los incluye.

Para desarrollar o ejecutar lint, tests y SBOM fuera de Docker:

* Node.js 22 LTS (versión fijada en `.nvmrc` y `engines`)
* Corepack

> Se fijó Node.js 22 LTS porque Yarn 4.18.0 falla de forma intermitente en `yarn install` con Node.js 24.20 (error `The onCancel handler was attached after the promise settled`).

## Desarrollo local

### 1. Preparar Yarn con Corepack

```bash
corepack enable
corepack prepare yarn@4.18.0 --activate
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Levantar la aplicación

```bash
yarn start:dev
```

### 4. Probar endpoints principales

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
curl http://localhost:3000/metrics
```

En Windows PowerShell usar `curl.exe` en lugar de `curl`.

También se puede explorar la API desde Swagger UI:

```text
http://localhost:3000/api
```

## Scripts principales

```bash
yarn lint
yarn test
yarn build
yarn sbom
```

| Script       | Descripción                                  |
| ------------ | -------------------------------------------- |
| `yarn lint`  | Ejecuta análisis estático con ESLint.        |
| `yarn test`  | Ejecuta tests unitarios con Jest.            |
| `yarn build` | Compila la aplicación NestJS.                |
| `yarn sbom`  | Genera el SBOM CycloneDX en `sbom/bom.json`. |

## Docker

Construir la imagen Docker:

```bash
docker build -t devops-tasks-api:0.1.0 .
```

Ejecutar la imagen manualmente:

```bash
docker run --name devops-tasks-api -p 3000:3000 devops-tasks-api:0.1.0
```

> En el flujo principal del PIN, el contenedor se gestiona con Terraform. La ejecución manual con `docker run` se mantiene solo como prueba directa de la imagen.

## Infraestructura local con Terraform

Terraform gestiona la infraestructura local sobre Docker Engine en Ubuntu Server, usando el provider `kreuzwerker/docker`.

Recursos creados:

* Red Docker del proyecto.
* Contenedor de la API.
* Contenedor de Prometheus.
* Contenedor de Grafana.

Terraform **no construye** la imagen de la API: usa la imagen local `devops-tasks-api:0.1.0`, que debe existir antes de `terraform apply`.

Comandos principales:

```bash
cd infra
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Para destruir el entorno local:

```bash
terraform destroy
```

## Despliegue en Ubuntu Server

### 1. Preparar el servidor

Con Git, Docker Engine y Terraform instalados, permitir que el usuario use Docker sin `sudo` (Terraform se conecta a `/var/run/docker.sock`):

```bash
sudo usermod -aG docker $USER
```

Cerrar sesión y volver a entrar para que el cambio tenga efecto. Verificar:

```bash
docker version
terraform version
```

### 2. Clonar el repositorio y construir la imagen

```bash
git clone <url-del-repositorio>
cd devops-tasks-api
docker build -t devops-tasks-api:0.1.0 .
```

### 3. Levantar el entorno con Terraform

```bash
cd infra
terraform init
terraform plan
terraform apply
```

### 4. Verificar desde el servidor

```bash
docker ps
curl http://localhost:3000/health
curl http://localhost:3000/metrics
```

### 5. Acceder desde la máquina host

Ubuntu Server no tiene navegador. Swagger, Prometheus y Grafana se abren desde la máquina host usando la IP del servidor (`ip a` para obtenerla):

```text
http://<IP-DEL-SERVIDOR>:3000/api
http://<IP-DEL-SERVIDOR>:9090
http://<IP-DEL-SERVIDOR>:3001
```

Si el firewall `ufw` está activo, habilitar los puertos:

```bash
sudo ufw allow 3000,3001,9090/tcp
```

Si la VM usa NAT y no es accesible por IP, se puede usar un túnel SSH desde el host:

```bash
ssh -L 3000:localhost:3000 -L 9090:localhost:9090 -L 3001:localhost:3001 usuario@<IP-o-puerto-de-la-VM>
```

### 6. Destruir el entorno

```bash
cd infra
terraform destroy
```

## URLs locales

Desde el servidor se usa `localhost`; desde la máquina host, la IP del servidor.

| Servicio     | URL                           |
| ------------ | ----------------------------- |
| API          | http://localhost:3000         |
| Swagger UI   | http://localhost:3000/api     |
| Health check | http://localhost:3000/health  |
| Métricas     | http://localhost:3000/metrics |
| Prometheus   | http://localhost:9090         |
| Grafana      | http://localhost:3001         |

Credenciales locales de Grafana:

```text
Usuario: admin
Password: admin
```

## Pipeline CI/CD

El workflow principal se encuentra en:

```text
.github/workflows/ci.yml
```

Se ejecuta automáticamente ante:

* Push a `main`.
* Pull request hacia `main`.

El pipeline realiza:

1. Configuración de Node.js 22.
2. Activación de Corepack y Yarn 4.18.0.
3. Instalación de dependencias con `yarn install --immutable`.
4. Análisis de código con ESLint.
5. Ejecución de tests con Jest.
6. Compilación de la aplicación.
7. Generación del SBOM CycloneDX.
8. Publicación del SBOM como artifact.
9. Escaneo de dependencias con Snyk.
10. Construcción de imagen Docker.
11. Validación de Terraform con `fmt`, `init` y `validate`.

GitHub Actions valida Terraform, pero no ejecuta `terraform apply` ni `terraform destroy`, porque el despliegue es local y depende de Docker Engine en Ubuntu Server. La imagen que se construye en CI sirve como validación del Dockerfile; en el servidor la imagen se construye localmente antes del `terraform apply`.

## Seguridad

El proyecto incluye controles de seguridad orientados al pipeline:

* **ESLint** para análisis estático y buenas prácticas de código.
* **SBOM CycloneDX** para inventariar componentes y dependencias.
* **Snyk** para análisis de vulnerabilidades en dependencias.
* **GitHub Secrets** para gestionar el token `SNYK_TOKEN`.

No se hardcodean secretos en el repositorio.

El SBOM se genera en:

```text
sbom/bom.json
```

Y también se publica como artifact del workflow con el nombre:

```text
cyclonedx-sbom
```

## Monitoreo

La API expone métricas en:

```text
GET /metrics
```

El endpoint utiliza `prom-client` y expone:

* Métricas default de Node.js.
* Cantidad total de requests HTTP.
* Duración de requests HTTP.
* Labels por método, ruta y status code.

Prometheus recolecta las métricas desde:

```text
devops-tasks-api:3000/metrics
```

Grafana utiliza Prometheus como datasource y muestra un dashboard básico provisionado automáticamente.

El stack de monitoreo se levanta localmente con Terraform.

## Documentación y evidencias

La carpeta [`docs/`](./docs/) concentra la evidencia de entrega:

* Resumen del PIN y tabla de evidencias ([`docs/readme.md`](./docs/readme.md))
* Capturas en [`docs/capturas/`](./docs/capturas/)

## Estado frente a la rúbrica

| Criterio                  | Estado    |
| ------------------------- | --------- |
| Pipeline CI/CD            | Listo     |
| Infraestructura Terraform | Listo     |
| Contenedor Docker         | Listo     |
| Seguridad                 | Listo     |
| Observabilidad            | Listo     |
| Documentación             | En cierre |

## Aclaración sobre la opción local

El proyecto utiliza la **opción local**, no nube.

La infraestructura se ejecuta sobre Ubuntu Server con Docker Engine y se gestiona mediante Terraform. Esta decisión permite demostrar infraestructura como código, contenedores, monitoreo y seguridad sin depender de costos, permisos o recursos externos de AWS, Azure o GCP.