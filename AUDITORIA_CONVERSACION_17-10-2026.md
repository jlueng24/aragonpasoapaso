# Auditoría frente a la conversación (17/10/2026)

Fuente: `Aragon_conversacion_para_continuar.pdf` aportado por el usuario. Se respetan las decisiones más recientes.

## Implementado y comprobado en código
- Inicio por buscador antes de abrir el mapa, sin colección inicial de 731 escudos.
- Fondo claro, cabecera con escudo aragonés y navegación sin antiguo menú lateral.
- Mapa y rutas por fronteras reales compartidas: cualquier municipio descubierto abre sus vecinos elegibles, no solo el origen. Los 38 son alcanzables desde los 38 orígenes (prueba automatizada).
- Los municipios por descubrir no revelan nombre, bandera ni escudo en el mapa o colección. Se muestran como destinos sin identificar, con contorno.
- 38 municipios: 20 Bajo Aragón y 18 Matarraña. Superficie de IGEAR y habitantes del padrón INE de 2025, con fuentes.
- Pantallas de aprendizaje: cuatro; después, tres preguntas con entre dos y cuatro alternativas distintas y una única correcta.
- Sin cupo de tres descubrimientos diarios durante la prueba, también para progreso recuperado; clave de guardado `aragon-explora-v1` preservada.
- Textos eliminados: «Un poco más lejos», «Tu próximo descubrimiento está al otro lado de una frontera» y «A tu ritmo. Puedes volver atrás cuando quieras».

## Mejoras implementadas ahora
- En preguntas de símbolos se emplean banderas o escudos solamente cuando existe otra opción descubierta y documentada del mismo tipo; en caso contrario se comparan siluetas reales. Nunca se inventan imágenes.
- Los textos de aprendizaje de símbolos y patronazgo reconocen explícitamente las lagunas documentales en vez de presentarlas como datos verificados.
- Tres pruebas nuevas: límite máximo tras coleccionar 38 municipios, preguntas por silueta sin símbolos y ausencia de filtración en mapa/colección. 15/15 pruebas superadas.

## Lo que permanece pendiente
- De las 38 fichas, diez estaban desarrolladas culturalmente en el paquete inicial y 28 añadidas tienen datos de población, superficie y geografía, pero no toda su información heráldica, histórica, patronal y festiva verificada. No se han rellenado por suposición.
- Revisión visual/interactiva en escritorio y móvil con navegador real; no se ha completado.
- Publicación: no realizada, para no reemplazar la versión en uso sin revisión.
- Modos de historia, patrimonio, lenguas y fotografías: ideas para el futuro, no funcionalidades aprobadas para desarrollar ahora.

## Cómo probar
En `proyecto_actual`: `python3 -m http.server 8000 --directory dist` y navegar a `http://localhost:8000`.
Pruebas: `node --test test/*.test.mjs`.
No abrir HTML como `file://` porque usa fetch para JSON.

## Precaución
El ZIP del código **no** contiene los progresos personales guardados en `localStorage` del navegador del jugador. Mantener origen de alojamiento y clave de almacenamiento durante despliegues posteriores.
