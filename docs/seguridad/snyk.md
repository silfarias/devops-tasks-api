# Snyk — pendiente

## Estado

**Pendiente.** Todavía no está integrado en este proyecto.

## Objetivo en el PIN

Sumar un control de seguridad que analice vulnerabilidades conocidas en las dependencias, complementando el SBOM (que solo inventaría componentes).

## Relación con el SBOM

| SBOM (ya implementado) | Snyk (pendiente) |
| --- | --- |
| Lista qué componentes hay | Busca vulnerabilidades conocidas |
| Evidencia: `sbom/bom.json` | Evidencia: reporte / escaneo en CI |
| No detecta CVEs por sí solo | Analiza riesgos de seguridad |

Ver [sbom.md](./sbom.md).

## Cómo se piensa integrar (cuando se implemente)

1. Crear un secret de GitHub llamado `SNYK_TOKEN`.
2. Usarlo en el workflow como `${{ secrets.SNYK_TOKEN }}`.
3. Ejecutar análisis de dependencias en CI.
4. Guardar reporte o evidencia del análisis.
5. Documentar el resultado en esta carpeta (reemplazando este placeholder).

## Reglas

* No hardcodear tokens.
* No commitear secretos.
* No inventar resultados de escaneo antes de integrar la herramienta.

## Resumen para exposición oral (estado actual)

Hoy el proyecto ya tiene SBOM como inventario de componentes. El siguiente paso de seguridad es integrar Snyk para escanear vulnerabilidades, usando un secret `SNYK_TOKEN` en GitHub Actions, sin exponer credenciales en el repositorio.
