# Aragón, paso a paso · integración de 38 municipios (17-10-2026)

Esta carpeta procede de `proyecto_actual` del paquete facilitado por el usuario. No sustituye ni publica la web existente.

## Hecho
- `dist/pilot-content.json` incluye los 38 municipios oficiales de Bajo Aragón y Matarraña/Matarranya (antes 10).
- Los 28 registros añadidos tienen superficie del WFS IGEAR y población total 2025 del archivo INE del propio paquete.
- Conservados los diez registros completos y sus imágenes. No se han inventado escudos, banderas, patronos ni anécdotas para los restantes 28.
- El cupo diario sigue desactivado. Las preguntas están limitadas a cuatro opciones.
- Actualizadas pruebas de presentación y fixture oficial para los 38 municipios. 12 pruebas pasan.

## Falta
- Investigar e integrar singularidades, fiestas y patronos con fuentes fiables para las 28 fichas nuevas.
- Incorporar símbolos reales y atribuciones/licencias para esas fichas cuando se encuentren.
- Comprobar visualmente en navegador escritorio y móvil. No se ha hecho esta comprobación interactiva aquí.
- No publicar hasta verificar contenidos y visuales.

## Ejecutar
`cd proyecto_actual && python3 -m http.server 8000 --directory dist`
Luego abre `http://localhost:8000/`. Test: `node --test test/*.test.mjs`.

## Nota
Los datos incompletos se presentan como pendientes de contrastar. El archivo `ultima_version_publicada` del ZIP original no fue editado.
