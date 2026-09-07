# Aplicación base: devops-tasks-api

## Objetivo

Describir la aplicación NestJS que sirve de base al Proyecto Integrador DevOps. La API es intencionalmente simple: el foco del PIN no es la lógica de negocio, sino el flujo de CI/CD, contenedores, IaC, seguridad y monitoreo.

## Stack

| Tecnología | Uso en el proyecto |
| --- | --- |
| Node.js 24 | Runtime |
| NestJS + TypeScript | Framework de la API |
| Yarn 4.18.0 + Corepack | Gestión de dependencias |
| Jest | Tests unitarios |
| ESLint | Lint / calidad de código |
| Docker | Empaquetado y ejecución |
| Terraform | Infraestructura local |
| GitHub Actions | Pipeline CI/CD |

## Qué hace la API

Es una API REST de tareas en memoria. No usa base de datos, frontend ni autenticación.

### Endpoints

```text
GET    /
GET    /health
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
PATCH  /tasks/:id/complete
DELETE /tasks/:id
```

| Endpoint | Descripción |
| --- | --- |
| `GET /` | Respuesta básica de la aplicación |
| `GET /health` | Estado del servicio |
| `GET /tasks` | Lista todas las tareas |
| `POST /tasks` | Crea una tarea |
| `PATCH /tasks/:id` | Edita una tarea (por ejemplo el título) |
| `PATCH /tasks/:id/complete` | Marca una tarea como completada |
| `DELETE /tasks/:id` | Elimina una tarea |

### Ejemplo de `/health`

```json
{
  "status": "ok",
  "service": "devops-tasks-api",
  "timestamp": "2026-07-28T18:18:43.966Z"
}
```

## Qué ya está implementado

* CRUD de tareas en memoria
* DTOs y validación con `class-validator` / `class-transformer`
* `ValidationPipe` global
* Tests con Jest
* ESLint y build de NestJS

## Qué no se agrega (salvo pedido explícito)

* Base de datos
* Frontend
* Login / JWT / roles
* Kubernetes
* Cloud (AWS, Azure, GCP)

## Cómo validar en local

```bash
yarn install
yarn lint
yarn test
yarn build
yarn start:dev
```

Luego:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
```

## Resumen para exposición oral

La aplicación `devops-tasks-api` es una API NestJS simple con healthcheck y CRUD de tareas en memoria. No busca ser un producto comercial complejo: existe para demostrar, de forma clara y defendible, un flujo DevOps completo alrededor de una base funcional.
