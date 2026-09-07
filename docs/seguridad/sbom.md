# Explicación del SBOM del proyecto

Este documento explica, de forma simple, qué es el SBOM en `devops-tasks-api`, cómo se genera y cómo se usa como evidencia de seguridad en el Proyecto Integrador DevOps.

Se basa únicamente en lo que ya existe en el repositorio.

## Explicación rápida (para entenderlo)

### ¿Qué es?

Un **SBOM** es una **lista de todo lo que usa tu aplicación**: NestJS, Jest, ESLint, RxJS, etc., con sus versiones.

No es una librería que corre con la API.  
No es un servicio.  
No es un escáner.

Es un **inventario en un archivo JSON**: `sbom/bom.json`.

### ¿Para qué sirve en este proyecto?

En el PIN piden evidencia de **seguridad / trazabilidad**. Una forma de cumplir eso es demostrar:

> “Sé qué componentes tiene mi software.”

Eso es el SBOM.  
Si mañana sale una vulnerabilidad en una librería, podés mirar el SBOM y decir: “sí, la usamos” o “no, no está”.

En este proyecto **todavía no corrige ni detecta vulnerabilidades**. Solo lista.  
Eso (detectar) sería después, con Snyk.

### ¿Instalamos alguna dependencia nueva?

**No como dependencia permanente del proyecto.**

En `package.json` no agregamos `@cyclonedx/...` en `dependencies` ni `devDependencies`.

Usamos esto:

```bash
yarn sbom
```

Ese script, por dentro, hace:

```bash
yarn dlx ... @cyclonedx/yarn-plugin-cyclonedx ...
```

`yarn dlx` = “descargá la herramienta, usala una vez y listo”.  
No queda instalada en la app.

### ¿Cómo corre?

Cuando vos (o el CI) ejecutás:

```bash
yarn sbom
```

pasa esto:

1. Yarn mira el proyecto y sus dependencias.
2. El plugin CycloneDX arma el inventario.
3. Escribe o actualiza `sbom/bom.json`.

La API **no usa** ese archivo para funcionar.  
`/health` y `/tasks` siguen igual con o sin SBOM.

### ¿En qué momento se creó?

En dos momentos:

1. **Localmente**, cuando se corrió `yarn sbom` durante la tarea de seguridad del PIN. Ahí nació `sbom/bom.json`.
2. **En cada CI**, el workflow hace lo mismo después de lint, test y build, y lo sube como artifact `cyclonedx-sbom`.

Se puede regenerar cuando quieras con `yarn sbom`.

### Analogía rápida

| Cosa | Analogía |
| --- | --- |
| Tu API NestJS | El producto |
| `node_modules` / dependencias | Los ingredientes |
| `sbom/bom.json` | La etiqueta de ingredientes |
| Snyk (aún no) | El control de calidad que busca ingredientes peligrosos |

### En una frase

> “El SBOM es el inventario de dependencias de nuestra API. Lo generamos con `yarn sbom` en formato CycloneDX y el pipeline lo publica como evidencia. Nos da trazabilidad; no reemplaza un escáner de vulnerabilidades.”

---

## 1. Qué es un SBOM

SBOM significa **Software Bill of Materials**, o “lista de materiales de software”.

Es un inventario estructurado de los componentes que forman una aplicación: librerías, dependencias y, en muchos casos, información de versión y licencia.

La analogía más simple es una etiqueta de ingredientes:

* Si una comida lista sus ingredientes, un SBOM lista los componentes de software.
* Sirve para saber **qué hay dentro** de una aplicación, no para cocinarla ni corregirla automáticamente.

## 2. Qué es un SBOM dentro de este proyecto

En este proyecto, el SBOM es el inventario de dependencias de `devops-tasks-api`.

Se guarda en:

```text
sbom/bom.json
```

Ese archivo describe los paquetes usados por la API NestJS (directos e indirectos), detectados a partir del proyecto Yarn.

También existe una explicación breve en:

```text
sbom/README.md
```

## 3. Para qué sirve

En el contexto del PIN, el SBOM sirve para:

* Documentar de forma trazable qué librerías usa el proyecto.
* Dejar evidencia de transparencia sobre la composición del software.
* Facilitar análisis de seguridad posteriores (por ejemplo, con herramientas de vulnerabilidades).
* Cumplir el entregable de seguridad asociado a inventarios de componentes.

En resumen: permite responder con evidencia a la pregunta “¿qué componentes tiene esta aplicación?”.

## 4. Qué significa que el formato sea CycloneDX JSON

El SBOM de este proyecto no es un texto libre: usa el estándar **CycloneDX** en formato **JSON**.

Eso implica:

* Es un archivo JSON válido y estructurado.
* Sigue un esquema conocido (`bomFormat: CycloneDX`).
* En este proyecto se usa la especificación **1.6**.

Ejemplo tomado del archivo real:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6"
}
```

CycloneDX es un formato habitual en seguridad de software. Al usar JSON, el archivo es legible por personas y también por herramientas.

## 5. Qué contiene el archivo `sbom/bom.json`

El archivo actual incluye, entre otras cosas:

### Metadatos del proyecto

* Nombre de la aplicación: `devops-tasks-api`
* Versión: `0.0.1`
* Fecha/hora de generación
* Herramientas usadas para generar el SBOM

### Componentes

Lista de librerías detectadas. Cada componente puede incluir:

* nombre
* versión
* tipo (`library`, etc.)
* licencia (cuando está disponible)
* identificador PURL (`pkg:npm/...`)

### Dependencias

Relaciones entre componentes: qué paquete depende de qué otro.

### Estado validado del archivo actual

Al analizar `sbom/bom.json` se observa:

* Formato: CycloneDX
* Spec: 1.6
* Componentes: 704
* Dependencias: 705

La herramienta usada para generarlo (según el propio SBOM) es `@cyclonedx/yarn-plugin-cyclonedx` junto con Yarn 4.18.0.

## 6. Cómo se genera el SBOM localmente

Pasos locales:

1. Tener el proyecto instalado con Yarn 4.18.0.
2. Desde la raíz del repositorio, ejecutar el script de SBOM.
3. Verificar que se cree o actualice `sbom/bom.json`.

No hace falta instalar el plugin CycloneDX como dependencia permanente del proyecto: se ejecuta bajo demanda con `yarn dlx`.

## 7. Qué comando exacto se usa

El comando exacto definido por el script del proyecto es:

```bash
yarn dlx -q @cyclonedx/yarn-plugin-cyclonedx --output-format JSON --output-file sbom/bom.json
```

Qué hace, en corto:

* `yarn dlx -q ...`: descarga y ejecuta el plugin sin dejarlo instalado de forma permanente.
* `--output-format JSON`: genera salida CycloneDX en JSON.
* `--output-file sbom/bom.json`: escribe el resultado en la carpeta `sbom/`.

## 8. Qué script del `package.json` permite generarlo

En `package.json` existe el script:

```json
"sbom": "yarn dlx -q @cyclonedx/yarn-plugin-cyclonedx --output-format JSON --output-file sbom/bom.json"
```

Por eso, en la práctica se usa:

```bash
yarn sbom
```

Ese es el comando recomendado tanto en local como en CI.

## 9. Cómo se integra al pipeline de GitHub Actions

En `.github/workflows/ci.yml`, dentro del job de aplicación, el SBOM se genera **después** de:

* instalar dependencias
* lint
* tests
* build

Los pasos relevantes son:

```yml
- name: Generate SBOM
  run: yarn sbom

- name: Upload CycloneDX SBOM
  uses: actions/upload-artifact@v6
  with:
    name: cyclonedx-sbom
    path: sbom/bom.json
    if-no-files-found: error
```

Luego el pipeline continúa con el build de la imagen Docker.

Eso significa que el SBOM forma parte del flujo automatizado de calidad y seguridad, no es un paso manual aislado.

## 10. Qué significa que GitHub Actions lo suba como artifact

Un **artifact** es un archivo que el workflow guarda como resultado de la ejecución.

En este proyecto:

* Nombre del artifact: `cyclonedx-sbom`
* Contenido: `sbom/bom.json`

Ventajas:

* Queda disponible para descargar desde la corrida del workflow.
* Sirve como evidencia reproducible del inventario generado en CI.
* Si el archivo no se genera, el paso falla (`if-no-files-found: error`).

## 11. Qué archivo queda disponible como evidencia para el Proyecto Integrador

Evidencias principales relacionadas con SBOM:

| Evidencia | Ubicación / nombre | Uso |
| --- | --- | --- |
| SBOM generado | `sbom/bom.json` | Inventario CycloneDX del proyecto |
| Explicación breve | `sbom/README.md` | Descripción corta del directorio |
| Artifact de CI | `cyclonedx-sbom` | Evidencia descargable desde GitHub Actions |
| Esta explicación | `docs/seguridad/sbom.md` | Documentación para presentar y defender el entregable |

Para la entrega del PIN, el archivo central de evidencia técnica es `sbom/bom.json`, respaldado por la corrida de CI que lo genera y lo publica como artifact.

## 12. Qué relación tiene esto con seguridad

El SBOM es una práctica de **transparencia y trazabilidad**.

En seguridad ayuda porque:

* Deja visible la superficie de dependencias del proyecto.
* Permite saber qué versiones están en uso.
* Es la base para análisis posteriores de vulnerabilidades o licencias.
* Mejora la capacidad de respuesta ante incidentes (“¿usamos esa librería afectada?”).

No reemplaza un escáner, pero es un control de seguridad importante y alineado a buenas prácticas DevSecOps.

## 13. Diferencia entre generar un SBOM y escanear vulnerabilidades con Snyk

| Aspecto | SBOM (ya implementado) | Snyk (pendiente en este proyecto) |
| --- | --- | --- |
| Qué hace | Inventaría componentes | Busca vulnerabilidades conocidas |
| Resultado típico | Lista de dependencias (`bom.json`) | Reporte de issues / CVEs |
| ¿Detecta fallos de seguridad? | No por sí solo | Sí (según bases de datos de vulnerabilidades) |
| ¿Corrige problemas? | No | Puede sugerir remedios; no los aplica solo |
| Estado en el proyecto | Implementado en local y CI | Todavía no integrado |

En una frase:

* **SBOM** = “qué componentes tenemos”.
* **Snyk** = “cuáles de esos componentes tienen vulnerabilidades conocidas”.

Ambos se complementan. Primero se inventaría; después se analiza.

## 14. Qué decir en la presentación si preguntan qué es el SBOM

Podés responder algo así:

> “El SBOM es el inventario de componentes de nuestra API. En este proyecto lo generamos en formato CycloneDX JSON con Yarn y el plugin de CycloneDX. El archivo `sbom/bom.json` lista las dependencias del sistema. Además, el pipeline de GitHub Actions lo genera automáticamente y lo publica como artifact llamado `cyclonedx-sbom`, para dejar evidencia de trazabilidad y seguridad.”

Si te piden más detalle técnico, agregá:

> “Usamos el script `yarn sbom`, que ejecuta `@cyclonedx/yarn-plugin-cyclonedx` y escribe el resultado en `sbom/bom.json`.”

## 15. Limitaciones del SBOM

Es importante ser honestos en la exposición:

* El SBOM **lista e inventaría** componentes.
* El SBOM **no corrige** vulnerabilidades.
* El SBOM **no detecta** vulnerabilidades por sí solo.
* Tener un SBOM no significa que el software esté libre de riesgos.
* Su valor está en la visibilidad y en habilitar controles posteriores (como Snyk).

Por eso, en la rúbrica del PIN, el SBOM cubre la parte de inventario/trazabilidad de seguridad, y el escaneo con Snyk es un paso complementario pendiente.

## Flujo actual del SBOM en el proyecto

```text
Código + dependencias Yarn
        ↓
yarn sbom
        ↓
sbom/bom.json (CycloneDX JSON)
        ↓
GitHub Actions genera el mismo archivo
        ↓
Artifact cyclonedx-sbom disponible como evidencia
```

## Resumen para exposición oral

En este proyecto implementamos un SBOM, es decir, un inventario de los componentes de software de la API NestJS. Lo generamos en formato CycloneDX JSON con el comando `yarn sbom`, usando el plugin oficial de CycloneDX para Yarn, y el resultado se guarda en `sbom/bom.json`. Ese mismo proceso está integrado al pipeline de GitHub Actions: después de lint, tests y build se genera el SBOM y se publica como artifact `cyclonedx-sbom`. Esto nos da trazabilidad y transparencia sobre las dependencias del sistema. Es un control de seguridad importante, aunque no reemplaza un escáner de vulnerabilidades: el SBOM nos dice qué componentes usamos; herramientas como Snyk, que todavía están pendientes en el proyecto, sirven para analizar si esos componentes tienen vulnerabilidades conocidas.
