# Aragón, paso a paso — La Ginebrosa y sus vecinos

Prototipo de exploración sobre cartografía municipal oficial de IGEAR. El mapa contiene 731 municipios; esta expedición habilita La Ginebrosa y sus nueve limítrofes de Aragón: Aguaviva, Alcorisa, Calanda, La Cañada de Verich, La Cerollera, Foz-Calanda, Mas de las Matas, Torre de Arcas y Torrevelilla. Torre de Arcas pertenece a Matarraña / Matarranya; los otros nueve, a Bajo Aragón.

## Experiencia

- Interfaz clara con fondo blanco, mapa azul claro y territorios descubiertos en verde. Escudo real de Aragón en cabecera, con iluminación mediante CSS.
- Origen gratuito. Al elegirlo se entrega su carta completa y se habilita la presentación.
- Se avanza desde cualquiera de los municipios descubiertos, usando aristas compartidas en la cartografía original. Ningún requisito de comarca o provincia limita el camino.
- Los destinos sin descubrir muestran únicamente su contorno y un número de destino; no revelan nombre, datos, escudo ni bandera en mapa, ayudas, lista o selección.
- Al pulsar Descubrir comienza una presentación de cuatro pantallas: ubicación y km²; símbolos; población, año y un detalle local; patronos y celebración local.
- Tres preguntas para conseguir la carta. Los símbolos y siluetas de los distractores proceden solo de la colección y del destino estudiado. Si faltan símbolos se pregunta por el escudo o la silueta real. Máximo cuatro opciones.
- Cupo diario provisional de 3, configurable a 5 o 10 para probar. Origen, fallos y repasos no consumen cupo. Renovación por fecha Europe/Madrid.
- Colección y progreso existentes se conservan en el mismo almacenamiento local `aragon-explora-v1`.

## Datos y alcance

Superficies: campo `sup_of_km2` de la cartografía municipal IGEAR. Población: INE, tabla 2899, Padrón municipal a 1 de enero de 2025. Fuentes enlazadas en las lecciones y créditos. Singularidades y celebraciones: Ayuntamiento de La Ginebrosa, Turismo y Catálogo Cultural de la Comarca del Bajo Aragón y Turismo del Matarraña. Se distingue la celebración local de la festividad del santo cuando difieren.

Las representaciones de escudos y banderas proceden de Wikimedia Commons y llevan atribuciones en `dist/credits.json`. No se generan símbolos. Permanecen pendientes las imágenes de bandera de Calanda, La Cañada de Verich, Mas de las Matas y Torre de Arcas, y el escudo de La Cañada de Verich. Esto no implica que esos municipios carezcan de símbolos. Pueden jugarse sin imágenes inventadas.

La expansión termina en los diez municipios preparados; los siguientes territorios se incorporarán por fases. Los datos pueden enriquecerse sin cambiar los IDs ni perder cartas.

Guardado en este navegador, sin cuenta Google ni sincronización. El cupo local es una demostración de reglas, no una barrera antifraude. Futuras cuentas/competición/pagos requerirán validación en servidor. El juego de banderas posterior solo utilizará municipios descubiertos.

## Verificación

`node --test test/*.test.mjs`: reglas de origen, cupo, vecindad, fecha, persistencia, ocultación de información, cuatro pantallas, contenido y cuestionarios. Los tests de presentación usan un DOM mínimo simulado, no un navegador. La revisión visual en navegador no se ha podido realizar en esta sesión por falta de la capacidad control-browser.

La cartografía derivada y el contenido publicado están en `dist/`. `build_map.py` reconstruye el mapa usando los GeoJSON de investigación. Las evidencias de superficie/población seleccionadas están en `test/fixtures/official-data.json` para que las comprobaciones de contenido sean reproducibles sin descargar archivos de investigación.
