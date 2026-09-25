# TMG 2.0 — Paquete de producción

Este paquete reemplaza las 12 páginas de metanoiagroup.vip (6 en español, 6 en inglés).

## Qué contiene

| Archivo | Qué es |
|---|---|
| `index.html`, `el-marco.html`, `el-modelo.html`, `mario.html`, `mision.html`, `conversacion.html` | Páginas en español |
| `en.html`, `the-framework.html`, `the-model.html`, `mario-en.html`, `mission.html`, `conversation.html` | Páginas en inglés |
| `assets/tmg.css` | Sistema de diseño compartido (una sola hoja para todo el sitio) |
| `assets/tmg.js` | Comportamientos compartidos (menú, navegación, matriz, órbita, pestañas) |
| `assets/flame.webp` | La flama de TMG con fondo transparente (logo de navegación y favicon) |
| `assets/seal.webp` | Logo oficial circular (sello en la home) |
| `assets/logoh.webp` | Logo oficial horizontal (firma al pie de todas las páginas) |
| `sitemap.xml`, `robots.txt` | Para que Google indexe ambos idiomas correctamente |

## Cómo subirlo

1. **Respalda el sitio actual.** Descarga una copia completa de lo que hoy está en el servidor antes de tocar nada.
2. **Sube todo el contenido de esta carpeta a la raíz del dominio**, respetando la carpeta `assets/`. Las 12 páginas reemplazan a sus versiones 1.0 con el mismo nombre, así que los enlaces que ya circulan en LinkedIn, WhatsApp o Google siguen funcionando.
3. **No borres nada de lo siguiente**, porque el sitio 2.0 lo sigue usando:
   - la carpeta `downloads/` con todos los PDF (brochures ES/EN, diferenciadores y perfiles de Mario);
   - `og-image.jpg` (la imagen que aparece al compartir un enlace);
   - `mfb1.html`, `mfb2.html`, `mgl1.html`, `mgl2.html` y `tmmb.html`.
4. Los archivos `new_logo.svg` y `new_favicon.svg` ya no se usan; pueden quedarse sin problema.

## Revisión después de subir (5 minutos)

- Abre la home en tu teléfono y en tu computadora.
- Cambia de idioma en dos páginas y confirma que te lleva a la misma página en el otro idioma.
- Descarga un brochure desde El Modelo.
- Envía una prueba desde el formulario de Conversación y confirma que llega a mario@metanoiagroup.vip (usa la misma cuenta de Web3Forms que la versión 1.0).
- Comparte el enlace de la home por WhatsApp y confirma que aparece la imagen de vista previa.

## Qué se mide en Google Analytics

La misma propiedad (G-KHNZVPJX1N). Ahora cada clic se registra con su propia etiqueta: botón de conversación por ubicación (navegación, menú móvil, barra fija, puerta), WhatsApp, email, LinkedIn, cada brochure, cada diferenciador, cada nivel de MSA, Substack y YouTube. Los envíos del formulario se registran como `generate_lead`.
