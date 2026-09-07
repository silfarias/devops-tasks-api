# SBOM

Este directorio contiene el Software Bill of Materials (SBOM) del proyecto `devops-tasks-api`.

El SBOM es un inventario de los componentes de software y dependencias que forman parte de la aplicación. Sirve para documentar de forma trazable qué librerías se utilizan y facilitar el análisis de seguridad.

## Archivo generado

El comando `yarn sbom` genera el archivo:

`sbom/bom.json`

El formato utilizado es **CycloneDX JSON**. El SBOM lista los componentes y las dependencias del proyecto.
