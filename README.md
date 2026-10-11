# KARAOKE-INSCRIPCION

Formulario público de inscripción Karaoke con diseño neón, preparado para Vercel.

## Despliegue

1. Importa este repositorio en Vercel.
2. Framework Preset: **Other**.
3. No hace falta comando de build.
4. En **Settings → Environment Variables**, añade:
   - `APPS_SCRIPT_URL` = URL de despliegue de Apps Script **INSCRIPCION** terminada en `/exec`.
5. Despliega.

## Conexión necesaria con Apps Script

El frontend utiliza `/api/catalog` y `/api/signup`, que actúan como puente servidor-a-servidor para evitar llamadas directas del navegador a Apps Script. El proyecto Apps Script de inscripción debe responder JSON a las peticiones `?api=catalog` y `?api=signup`. La versión actual de Apps Script, que usa `google.script.run`, todavía no ofrece esos endpoints; hay que actualizar y desplegar una nueva versión de `inscripcion/Code.gs` antes de que el formulario de Vercel pueda cargar y enviar datos.

La hoja y el proyecto CONTROL existentes no se modifican con este repositorio.
