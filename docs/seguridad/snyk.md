# Snyk en el proyecto

## Explicación rápida (para entenderlo)

### ¿Qué es?

**Snyk** es una herramienta de seguridad que analiza las dependencias del proyecto y detecta **vulnerabilidades conocidas**.

No reemplaza al SBOM:

* **SBOM** = lista de componentes (`sbom/bom.json`)
* **Snyk** = control que busca problemas de seguridad en esas dependencias

### ¿Para qué sirve en este proyecto?

En el Proyecto 1 del PIN, la rúbrica de seguridad pide:

> SBOM + análisis de código/dependencias en el pipeline

ESLint cubre calidad de código.  
SBOM cubre inventario.  
Snyk cubre el análisis de vulnerabilidades de dependencias.

## Estado

**Integrado en el workflow.** Pendiente validar una corrida exitosa en GitHub Actions y guardar captura.

## Cómo está implementado

### 1. Secret en GitHub

El token de Snyk se guarda como secret del repositorio:

```text
SNYK_TOKEN
```

El workflow lo consume así:

```yml
env:
  SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

Reglas:

* No hardcodear el token en el código
* No commitear el token en `.env`
* Si el token se expone, revocarlo y crear uno nuevo

### 2. Paso en GitHub Actions

En `.github/workflows/ci.yml`, después del SBOM y antes del Docker build:

```yml
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity=high --package-manager=yarn --file=yarn.lock
```

Qué hace:

* Escanea dependencias según el lockfile real de Yarn (`yarn.lock`)
* Falla el pipeline si encuentra vulnerabilidades de severidad **high** o superior
* Usa el secret `SNYK_TOKEN` para autenticarse contra Snyk

Importante: no usar `--file=package.json` en este proyecto, porque Snyk puede resolver como npm e ignorar las versiones fijadas por Yarn.
## Relación con el SBOM

| Aspecto | SBOM | Snyk |
| --- | --- | --- |
| Qué hace | Inventaría componentes | Busca vulnerabilidades conocidas |
| Evidencia | `sbom/bom.json` + artifact `cyclonedx-sbom` | Paso del workflow + logs/captura |
| ¿Detecta CVEs? | No | Sí |
| Estado | Validado | Integrado (validar corrida) |

Ver [sbom.md](./sbom.md).

## Cómo validarlo

1. Asegurarte de que el secret `SNYK_TOKEN` exista en GitHub.
2. Hacer push del cambio del workflow a `main` (o abrir un PR).
3. Abrir la pestaña **Actions** del repo.
4. Entrar al workflow `CI`.
5. Verificar el paso `Run Snyk to check for vulnerabilities`.
6. Guardar captura en `docs/capturas/` (por ejemplo `snyk-ci-success.png`).

## Posibles resultados

* **Verde:** no hay vulnerabilidades high/critical (o Snyk no encontró issues por encima del umbral).
* **Rojo por vulnerabilidades:** Snyk encontró issues high/critical; hay que revisar el log y decidir remediar o documentar el hallazgo.
* **Rojo por autenticación:** el secret está mal nombrado, vacío o el token fue revocado.

## Resumen para exposición oral

Integramos Snyk en GitHub Actions para escanear vulnerabilidades de dependencias. El token se guarda como secret `SNYK_TOKEN` y no se versiona en el repositorio. En el pipeline, después de generar el SBOM, Snyk analiza `package.json` y falla si detecta vulnerabilidades de severidad alta o crítica. Así cumplimos la parte de análisis de seguridad del Proyecto 1: el SBOM nos dice qué usamos; Snyk nos dice si eso tiene riesgos conocidos.
