# Schedule tasks

### Push notifications en recarga

En general:

- recibir notificaciones de backend sin mostrarlas (NO FUNCIONA CON LA PROP shouldShowALert)
  No puedo seguir

---

- leer la data de cada una
- verificar cual no fue completada
- enviar 1 notificacion con los numeros que tuvieron error

Tareas a completar

- Enviar notificacion, desactivando en el telefono con un boton, y verificaer si llega o no al movil
- Leer una notificacion enviada desde la herramienta online, y estudiarla en consola, nuscar campo data
  Si lo anterior funciona:

Luego de realizar el pago para completar la recarga (PagoScreen)

- guardar lista de contactos a los que se ha recargado en storage (Antes de limpiar estado)
- desactivar que lleguen las notificaciones (hasta haberlas recibido todas)

En donde corresponda:

- Crear porcion de codigo para parsear notificaciones - puede ser necesario comunicar con backend - si no logro comunicar, lo dejo en pausa
  En la porcion de codigo anterior, debe incluir:
- Detectar TIpo de notificacion
- detectar que recarga no fue completada
- volver a activar recibo de notificaciones en el telefono
- enviar notificacion con numeros de las recargas fallidas

---

Nuevos pasos:
estudiar socket.io, enviar propuesta a backend.
