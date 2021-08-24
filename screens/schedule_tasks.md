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

INFO

app-specific-password (appleid)
yorg-nzvb-ojea-gtnv

app SKU
an.id.for.ache.app.

Notas de Adriana:

- screen registro de usuario -
  (+) los inputs no dejan de estar enfocados -> no puedes salir tocando fuera del campo
  (+) no se ve el input del numero de telefono
  (+) teclado de email para el input de email - el @
  (4) TODO -- placeholder del input telefono / ver con diseno

NOTA: _todo_ autocapitaize false en email

solucion: revisar componente que sugirio alejandro/ empujar los contactos o permitir scroll/ permitir desenfocar
tratar de colocar un enter en teclado numerico de ios

+\* borrar usuario si desinstala la apk

solucion: investigar - la solucion mas cercana que encuentro es con push notifications, pero no es para nada segura

ideas:

idea 1

- plazo determinado para borrar el usuario en backend (aproximadamente 5 dias desde el ultimo request) - se soluciona el problema de acumulacion de usuarios
- activar un contador en la app, similar al de los premios, si se ha excedido (en useCachedResources) - re-submit (se puede usar un booleano para indicar resubmit)

idea 2

- booleano en backend asociado a cada usuario - variable "canReSubmit"
- canReSubmit comienza en falso
- en backend, si pasa una semana desde el ultimo request, la variable pasa a true
- en la app, si despues de una semana el usuario abre la app, avisar en backend (endpoint mediante), para poner en false
- si un usuario intenta loggearse con un numero y un correo de un user ya creado con canReSubmit en true, entonces no da error de "duplicado"
  Nota: Una forma relativamente sencilla para que backend inicie el conteo del "lapso de tiempo" es hacer un request cada vez que el usuario abra la app.

idea 3:
two factor auth, dar opcion en caso de duplicado, mediante email o sms

- screen home:
  (1) TODO -- quitar segundo premio ganado, ver con diseno
  (+) centrar la bola roja de la ruleta.

- modal de generar codigo o cobrar premio:
  (+) -BUG- despues de cancelar recarga por error, las imagenes que indican que hay premio permanecen, pero el premio no existe
  NOTA: lo que esta pasando es que no se esta finalizando el checkout de los premios - revisar
  NOTA2: haciendo esto descubri que cuando un usuario tiene un premio en checkout y lo pierde, no ganara mas ninguno (Nada todo el tiempo)
  (+) en presionar terminar, tambien copiar codigo al portapapeles

- screen de recarga directa:
  (1) modal para quitar premio, similar al que sale para codigo
  / el modal tiene una foto del premio en el centro, y debajo dos botones (izquierda salir, derecha quitar premio)
  (+) "toca para ir a contactos": sensibilidad (ver) en simulador

- screen de contactos del telefono:
  (1) scroll en lista de contactos - en el medio
  (2) a adriana se le trava - ver video

- screen de recargas disponibles
  (1) quitar boton de continuar y doble check

- screen de prepago (proceso de pago)
  (1) no funciona el boton de para atras en ios
  (2) en ios puedes ir para atras como te da la gana, prohibir eso

Notas mias

- usuario sin conexion a internet.
  screens:
- todas, antes de realizar las operaciones
  si no tiene internet: toast: verifica que tienes una conexion a internet estable
- cuando el usuario abre la app: home

## TODO hoy (24 de agosto)

- bugs en recarga directa (In progress)
  - ir a NuevoContactoInput, funcion 'onPressDeletePrize'
  - reajustar funcion 'onPressOkModal' en screen NuevaRecargaScreen
    codigo para utilizar - f03ff5d5-b965-4092-b7ba-0c472cbe28ca
- bugs en multiples contactos
- bugs en recargas disponibles
- bugs en proceso de pago
- comunicar a backend la opcion para eliminar usuario

## Pending

- capitalize en email
- finish checkout cuando eliminas un slot (contacto=premio si tiene)
