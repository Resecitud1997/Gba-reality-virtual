# GBA Reality Emulator — versión inicial 0.1

Aplicación de escritorio para Windows/macOS/Linux basada en Electron. Esta primera entrega pone en marcha la estructura del proyecto:

- Carga de ROM GBA `.gba` desde un archivo local.
- Integración del núcleo GBA de EmulatorJS (requiere internet para descargar sus archivos de ejecución).
- Cámara y seguimiento de mano con MediaPipe Hands.
- Objetos virtuales de demostración anclados aproximadamente a la palma.
- Inventario de objetos extraídos durante la sesión.
- Exportación de una geometría STL esférica de demostración para impresión 3D.

## Requisitos

- Node.js 20 o superior (incluye npm).
- Conexión a internet para EmulatorJS, MediaPipe y las fuentes de interfaz.
- Cámara web para la función AR.
- Para imprimir: laminador 3D y una impresora 3D.

## Ejecutar

1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `gba-reality-emulator`.
3. Ejecuta:

   ```bash
   npm install
   npm start
   ```

4. Pulsa **Cargar ROM** y selecciona una ROM `.gba` que tengas derecho a utilizar.
5. En **Realidad aumentada**, activa la cámara, muestra la palma y pulsa **Extraer a mi mano**.
6. En **Fabricación 3D**, exporta el STL de demostración.

## Límites conocidos de esta versión

- Es un prototipo funcional de arquitectura, no un emulador escrito desde cero ni una certificación de compatibilidad total. La emulación la realiza EmulatorJS. La aplicación sirve su interfaz y la ROM desde un servidor HTTP local para evitar problemas habituales de carga desde el protocolo file:// de Electron.
- El anclaje AR actual usa un punto aproximado de la palma; todavía no tiene oclusión realista, calibración de escala, física ni seguimiento 3D robusto.
- La exportación STL genera una esfera básica. No reconstruye automáticamente cada sprite o modelo del juego y no incluye aún piezas encajables, bisagras ni mecanismos.
- El objeto que aparece en la mano es una superposición digital en la pantalla de la cámara. Para sostener un objeto material se necesita imprimirlo o fabricar hardware adicional.
- EmulatorJS y MediaPipe se descargan desde CDN. La aplicación necesita internet para esas dependencias.

## Próximas etapas

1. Integrar un núcleo mGBA/libretro local con controles, guardado/carga y estados.
2. Extraer sprites y metadatos de ROMs propias, con herramientas que respeten el formato y los derechos aplicables.
3. Mejorar AR con seguimiento 3D, calibración, iluminación y oclusión.
4. Crear modelos 3D imprimibles por objeto, con piezas separadas, tolerancias y validación de malla.
5. Añadir persistencia de inventario, editor de objetos y sincronización entre el juego y el sistema AR.

## Privacidad

La cámara se procesa localmente en el renderer mediante MediaPipe. Esta versión no contiene código para grabar ni subir vídeo.
