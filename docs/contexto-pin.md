# Contexto general del proyecto — PIN DevOps

La documentación formal organizada por herramientas está en [README.md](./README.md).

Estoy trabajando en un Proyecto Integrador Final para una Diplomatura Universitaria en DevOps.

El objetivo general del PIN es integrar contenidos vistos durante la diplomatura mediante un proyecto práctico que combine:

* Infraestructura como código.
* CI/CD.
* Contenedores.
* Seguridad.
* Monitoreo.
* Trazabilidad.
* Buenas prácticas de entrega continua.

De las opciones propuestas en la consigna, se eligió el **Proyecto 1: CI/CD con GitHub Actions + Terraform + Docker**.

La idea no es construir una aplicación comercial compleja, sino una aplicación base simple y funcional que permita demostrar correctamente el flujo DevOps completo.

## Proyecto elegido

Proyecto 1: **CI/CD con GitHub Actions + Terraform + Docker**

Herramientas principales del proyecto:

* CI/CD: GitHub Actions.
* IaC: Terraform.
* Contenedores: Docker.
* Seguridad: ESLint, SBOM CycloneDX y luego Snyk.
* Monitoreo: Prometheus + Grafana.
* Aplicación base: API NestJS + TypeScript.

El proyecto debe entregar evidencia de:

* Workflow de GitHub Actions.
* Archivos Terraform `.tf`.
* Dockerfile.
* Imagen/artefacto Docker.
* SBOM en formato CycloneDX o SPDX.
* Controles de seguridad en el pipeline.
* Dashboard de métricas básicas en Prometheus/Grafana.
* Documentación clara con capturas y evidencia.

## Aplicación base

El proyecto se llama:

`devops-tasks-api`

Es una API REST simple desarrollada con:

* Node.js 24.
* NestJS.
* TypeScript.
* Yarn 4.18.0.
* Corepack.
* Jest.
* ESLint.
* Docker.
* Terraform.
* GitHub Actions.

La aplicación NO debe crecer innecesariamente. No se debe agregar base de datos, frontend, autenticación ni Kubernetes, salvo que se pida explícitamente más adelante.

La API trabaja con tareas en memoria. Esto es intencional: el objetivo del PIN no es persistencia de datos, sino demostrar CI/CD, contenedores, IaC, seguridad y monitoreo.

## Endpoints actuales

La aplicación actualmente expone estos endpoints:

```text
GET    /
GET    /health
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
PATCH  /tasks/:id/complete
DELETE /tasks/:id
```

Descripción funcional:

* `GET /` devuelve una respuesta básica de la aplicación.
* `GET /health` devuelve el estado del servicio.
* `GET /tasks` devuelve todas las tareas.
* `POST /tasks` crea una tarea.
* `PATCH /tasks/:id` permite editar una tarea, por ejemplo el título.
* `PATCH /tasks/:id/complete` marca una tarea como completada.
* `DELETE /tasks/:id` elimina una tarea.

El endpoint `/health` devuelve una estructura similar a:

```json
{
  "status": "ok",
  "service": "devops-tasks-api",
  "timestamp": "2026-07-28T18:18:43.966Z"
}
```

El endpoint `/tasks` devuelve un array de tareas.

## Estado actual del desarrollo

El proyecto ya cuenta con:

* Aplicación NestJS funcional.
* Endpoint `/health`.
* CRUD de tareas en memoria.
* DTOs.
* Validación con `class-validator` y `class-transformer`.
* `ValidationPipe` global configurado.
* Tests unitarios con Jest.
* ESLint funcionando.
* Build de NestJS funcionando.
* Dockerfile multi-stage.
* `.dockerignore`.
* Infraestructura Terraform local.
* Pipeline CI/CD en GitHub Actions.
* Generación de SBOM CycloneDX.
* Artifact del SBOM subido desde GitHub Actions.
* Documentación de evidencias en la carpeta `docs`.

## Reglas importantes del proyecto

Mantener el proyecto simple.

No agregar:

* Base de datos.
* MySQL.
* PostgreSQL.
* MongoDB.
* Frontend.
* Login.
* JWT.
* Roles de usuario.
* Kubernetes.
* AWS.
* Azure.
* GCP.
* Docker Compose, salvo que se pida para monitoreo.
* SonarQube pesado, salvo que se pida explícitamente.
* Cambios grandes de arquitectura sin justificar.

El objetivo es cumplir la rúbrica del PIN de la forma más clara y defendible posible.

## Versiones y entorno

El proyecto está alineado a:

* Node.js 24.
* Yarn 4.18.0.
* Corepack.
* Docker con imagen base Node 24 Alpine.
* Terraform 1.10.5 en GitHub Actions.

El `package.json` define:

```json
"packageManager": "yarn@4.18.0"
```

Por eso, cualquier entorno de CI o Docker debe activar Corepack antes de ejecutar comandos Yarn.

En GitHub Actions y Docker se debe usar:

```bash
corepack enable
corepack prepare yarn@4.18.0 --activate
```

No usar Yarn 1.22.22. Si aparece Yarn 1.22.22, está mal configurado el entorno.

## Regla crítica sobre GitHub Actions y Yarn

En `.github/workflows/ci.yml`, no usar:

```yml
cache: yarn
```

Y tampoco permitir que `actions/setup-node` intente usar Yarn antes de Corepack.

El setup correcto debe usar:

```yml
- name: Setup Node.js
  uses: actions/setup-node@v5
  with:
    node-version: 24
    package-manager-cache: false
```

Después de eso, recién activar Corepack:

```yml
- name: Enable Corepack
  run: corepack enable

- name: Prepare Yarn
  run: corepack prepare yarn@4.18.0 --activate

- name: Check versions
  run: |
    node --version
    yarn --version
```

En el paso `Check versions`, debe verse Yarn `4.18.0`.

Para instalar dependencias en CI se debe usar:

```bash
yarn install --immutable
```

No usar:

```bash
yarn install --frozen-lockfile
```

## Docker

El proyecto ya tiene un `Dockerfile` multi-stage.

El Dockerfile debe:

* Usar Node 24 Alpine.
* Activar Corepack en cada stage donde se use Yarn.
* Preparar Yarn 4.18.0.
* Instalar dependencias con `yarn install --immutable`.
* Ejecutar `yarn build`.
* Copiar `dist` al stage de producción.
* Exponer el puerto `3000`.
* Ejecutar la app con:

```bash
node dist/main.js
```

Importante: cada stage de Docker es independiente. Si se activa Corepack en `deps`, eso no se hereda automáticamente en `builder`. Por eso, cualquier stage que ejecute Yarn debe activar Corepack.

La imagen se construye con:

```bash
docker build -t devops-tasks-api:0.1.0 .
```

Y se puede ejecutar manualmente con:

```bash
docker run --name devops-tasks-api -p 3000:3000 devops-tasks-api:0.1.0
```

Pero el objetivo del PIN es que Terraform pueda gestionar esa infraestructura local, no depender siempre de `docker run`.

## Terraform

La infraestructura está en la carpeta:

```text
infra/
```

Archivos esperados:

```text
infra/
├── versions.tf
├── variables.tf
├── main.tf
├── outputs.tf
└── .terraform.lock.hcl
```

Terraform usa el provider Docker para crear infraestructura local.

Actualmente Terraform gestiona:

* Una red Docker llamada `devops-tasks-api-network`.
* Un contenedor Docker llamado `devops-tasks-api`.
* El puerto externo `3000`.
* Outputs con URLs útiles de la API.

El flujo local validado es:

```bash
cd infra
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Luego se valida con:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
docker ps
```

Finalmente se destruye con:

```bash
terraform destroy
```

Terraform ya fue probado localmente y funcionó. Creó 2 recursos: red Docker y contenedor Docker.

## Archivos Terraform que NO se deben commitear

No commitear:

```text
.terraform/
terraform.tfstate
terraform.tfstate.backup
*.tfvars
*.tfvars.json
crash.log
crash.*.log
```

Sí se debe commitear:

```text
infra/.terraform.lock.hcl
```

Ese archivo fija las versiones de providers usadas por Terraform.

## GitHub Actions

El workflow principal está en:

```text
.github/workflows/ci.yml
```

Actualmente el pipeline se ejecuta en:

* Push a `main`.
* Pull request hacia `main`.

El workflow tiene dos jobs principales:

```text
Lint, test, build and Docker
Terraform validate
```

El job de aplicación debe ejecutar:

1. Checkout del repositorio.
2. Setup de Node.js 24.
3. Corepack enable.
4. Corepack prepare Yarn 4.18.0.
5. Check de versiones.
6. `yarn install --immutable`.
7. `yarn lint`.
8. `yarn test`.
9. `yarn build`.
10. `yarn sbom`.
11. Upload del artifact `cyclonedx-sbom`.
12. `docker build`.

El job de Terraform debe ejecutar:

```bash
terraform fmt -check
terraform init -input=false
terraform validate
```

Importante: GitHub Actions NO debe ejecutar:

```bash
terraform apply
terraform destroy
```

Motivo: el despliegue actual es local y depende de Docker Desktop en la máquina de desarrollo. GitHub Actions solo debe validar la infraestructura, no intentar crear infraestructura local.

## SBOM

El proyecto ya genera un SBOM en formato CycloneDX JSON.

El archivo generado es:

```text
sbom/bom.json
```

También existe:

```text
sbom/README.md
```

El comando para generar SBOM es:

```bash
yarn sbom
```

Resultado validado localmente:

```text
CycloneDX 1.6 704
```

Esto significa que se generó un SBOM CycloneDX válido con 704 componentes/dependencias detectadas.

En GitHub Actions, el SBOM se sube como artifact llamado:

```text
cyclonedx-sbom
```

Usar `actions/upload-artifact@v6`, no `@v4`, para evitar advertencias por Node 20 deprecado.

## Documentación

La documentación del proyecto está organizada en:

```text
docs/
├── README.md
├── contexto-pin.md
├── aplicacion/
├── cicd/
├── docker/
├── terraform/
├── seguridad/
├── monitoreo/
└── capturas/
```

El índice formal está en `docs/README.md`. Cada herramienta tiene su carpeta con explicación y evidencia.

## Estado frente a la rúbrica del PIN

Estado actual estimado:

```text
Pipeline CI/CD: muy avanzado
Infraestructura Terraform: muy avanzado
Contenedor Docker: muy avanzado
Seguridad: avanzado parcialmente
Monitoreo: pendiente
Documentación: en progreso
```

Ya se cumple:

* Aplicación base funcional.
* Pipeline CI/CD con GitHub Actions.
* Lint.
* Tests.
* Build.
* Docker build.
* Dockerfile.
* Terraform local.
* Validación de Terraform en CI.
* SBOM CycloneDX generado.
* Artifact del SBOM en GitHub Actions.
* Evidencias documentadas.

Falta completar:

* Escaneo de vulnerabilidades con Snyk.
* Monitoreo con Prometheus + Grafana.
* Endpoint `/metrics`.
* Dashboard de métricas básicas.
* Captura del dashboard.
* README general final del proyecto.
* Paquete final comprimido para entrega.

## Próximos pasos recomendados

Los próximos pasos deben hacerse en este orden:

1. Integrar Snyk al pipeline.
2. Usar un secret de GitHub llamado `SNYK_TOKEN`.
3. Ejecutar análisis de dependencias.
4. Guardar reporte o evidencia del análisis.
5. Agregar documentación de seguridad en `docs/security-evidence.md`.
6. Luego agregar métricas a la API con `prom-client`.
7. Crear endpoint `GET /metrics`.
8. Levantar Prometheus y Grafana.
9. Crear dashboard básico.
10. Guardar captura del dashboard.
11. Documentar monitoreo en `docs/monitoring-evidence.md`.

## Snyk

Snyk todavía no está integrado.

Cuando se integre, hacerlo con cuidado:

* No hardcodear tokens.
* No commitear secretos.
* Usar GitHub Secrets.
* El secret debe llamarse:

```text
SNYK_TOKEN
```

El pipeline debe usar ese secret desde:

```yml
${{ secrets.SNYK_TOKEN }}
```

No poner el valor real del token en ningún archivo.

El objetivo de Snyk es analizar dependencias y vulnerabilidades.

## Monitoreo pendiente

Todavía falta monitoreo con Prometheus y Grafana.

La implementación recomendada es:

* Agregar `prom-client` a NestJS.
* Crear endpoint:

```text
GET /metrics
```

* Exponer métricas básicas:

  * Cantidad de requests.
  * Duración de requests.
  * Estado del servicio.
  * Métricas default de Node.js si es viable.

Luego levantar:

* Prometheus.
* Grafana.

Se puede usar Docker Compose para monitoreo si facilita el entorno local, pero no introducirlo sin justificarlo. Otra alternativa es ampliar Terraform para crear los contenedores de Prometheus y Grafana. Elegir la opción más clara y defendible para el PIN.

El dashboard de Grafana debe mostrar métricas visibles y debe guardarse una captura en:

```text
docs/capturas/
```

## Criterios generales para próximos cambios

Antes de modificar código:

1. Entender qué criterio de la rúbrica cubre el cambio.
2. Hacer el cambio mínimo necesario.
3. No romper endpoints existentes.
4. No introducir complejidad innecesaria.
5. Mantener el proyecto defendible para una exposición oral.
6. Actualizar documentación si se agrega una herramienta nueva.
7. Ejecutar validaciones locales antes de sugerir commit.

Validaciones obligatorias después de cambios relevantes:

```bash
yarn lint
yarn test
yarn build
```

Si el cambio afecta SBOM:

```bash
yarn sbom
```

Si el cambio afecta Docker:

```bash
docker build -t devops-tasks-api:0.1.0 .
```

Si el cambio afecta Terraform:

```bash
cd infra
terraform fmt
terraform validate
terraform plan
```

No ejecutar `terraform apply` sin avisar antes.

## Convención de commits sugerida

Usar commits claros:

```text
feat: ...
fix: ...
ci: ...
docs: ...
security: ...
chore: ...
```

Ejemplos:

```text
security: add Snyk dependency scanning
monitoring: expose Prometheus metrics
docs: add monitoring evidence
ci: upload security scan report
```

## Reglas de respuesta para el agente

Cuando te pida una tarea:

* Explicá brevemente qué vas a cambiar.
* Indicá archivos que vas a tocar.
* No hagas refactors grandes no solicitados.
* No cambies el stack.
* No agregues herramientas nuevas sin justificar.
* No modifiques documentación vieja si no hace falta.
* No elimines evidencia existente.
* No reemplaces Node/Yarn sin motivo.
* No agregues secretos.
* Al finalizar, indicá comandos para validar.
* Indicá qué archivos cambiaron.
* Sugerí un mensaje de commit.

## Resumen conceptual del proyecto

Este proyecto demuestra un flujo DevOps sobre una API NestJS simple.

El flujo buscado es:

```text
Código fuente
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Lint + tests + build
    ↓
Generación de SBOM
    ↓
Docker build
    ↓
Validación Terraform
    ↓
Infraestructura local con Docker gestionada por Terraform
    ↓
Monitoreo con Prometheus/Grafana
```

La aplicación base no es el foco principal. El foco es demostrar que el equipo sabe automatizar, empaquetar, validar, documentar, analizar seguridad y monitorear una aplicación.