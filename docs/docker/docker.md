# Docker en el proyecto

## Objetivo

Explicar cómo se empaqueta y ejecuta `devops-tasks-api` con Docker, y por qué el `Dockerfile` multi-stage es parte de la evidencia del PIN.

## Qué es Docker en este contexto

Docker permite empaquetar la API NestJS junto con su runtime en una imagen reproducible. Esa imagen se construye en CI y también se usa localmente, incluyendo el despliegue gestionado por Terraform.

## Archivos relevantes

| Archivo | Rol |
| --- | --- |
| `Dockerfile` | Define cómo se construye la imagen |
| `.dockerignore` | Excluye archivos innecesarios del contexto de build |

## Dockerfile multi-stage

El `Dockerfile` actual tiene tres stages:

1. **deps** — instala dependencias con Yarn 4.18.0
2. **builder** — compila la aplicación (`yarn build`)
3. **production** — imagen final con `dist` y dependencias, lista para ejecutar

### Puntos clave

* Imagen base: `node:24-alpine`
* Corepack se activa en cada stage que usa Yarn
* Yarn se prepara con: `corepack prepare yarn@4.18.0 --activate`
* Instalación: `yarn install --immutable`
* Puerto expuesto: `3000`
* Comando final: `node dist/main.js`
* Usuario no root: `USER node`

Importante: cada stage de Docker es independiente. Activar Corepack en `deps` no lo hereda automáticamente `builder`. Por eso ambos stages que ejecutan Yarn habilitan Corepack.

## Cómo construir la imagen

```bash
docker build -t devops-tasks-api:0.1.0 .
```

## Cómo ejecutarla manualmente

```bash
docker run --name devops-tasks-api -p 3000:3000 devops-tasks-api:0.1.0
```

En el PIN, el objetivo preferido es que Terraform gestione el contenedor local, en lugar de depender siempre de `docker run` manual. Ver [terraform/terraform-local.md](../terraform/terraform-local.md).

## Relación con CI

En GitHub Actions, después de lint, tests, build y SBOM, el job de aplicación ejecuta:

```bash
docker build -t devops-tasks-api:${{ github.sha }} .
```

Eso valida que la imagen se puede construir de forma automática en cada push o pull request a `main`.

## Validaciones recomendadas

```bash
docker build -t devops-tasks-api:0.1.0 .
docker run --rm -p 3000:3000 devops-tasks-api:0.1.0
curl http://localhost:3000/health
```

## Resumen para exposición oral

Empaquetamos la API con un Dockerfile multi-stage sobre Node 24 Alpine. Separamos instalación, build y producción para mantener una imagen más limpia. Como el proyecto usa Yarn 4, cada stage que ejecuta Yarn activa Corepack. La imagen se construye también en GitHub Actions y en local puede ejecutarse manualmente o, de forma preferida, mediante Terraform.
