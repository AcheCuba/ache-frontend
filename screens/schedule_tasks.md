# Schedule tasks

### Push notifications en recarga

En general:

- recibir notificaciones de backend sin mostrarlas (NO FUNCIONA CON LA PROP shouldShowALert)
  No puedo seguir

En donde corresponda:

- Crear porcion de codigo para parsear notificaciones - puede ser necesario comunicar con backend - si no logro comunicar, lo dejo en pausa
  En la porcion de codigo anterior, debe incluir:
- Detectar TIpo de notificacion
- detectar que recarga no fue completada
- volver a activar recibo de notificaciones en el telefono
- enviar notificacion con numeros de las recargas fallidas

---

Notas para backend  
 NOTA2: haciendo esto descubri que cuando un usuario tiene un premio en checkout y lo pierde, no ganara mas ninguno (Nada todo el tiempo)
NOTA3: por que un usuario comienza a ganar nada indefinidamente? tiene que ver con tener premios sin cobrar?

=========================================================

## Notas mias

- usuario sin conexion a internet.
  /screens: todas, antes de realizar las operaciones
  /si no tiene internet: toast: verifica que tienes una conexion a internet estable (cuando el usuario abre la app: home o en splash screen)

## Pending

**F**

- screen home: TODO -- quitar segundo premio ganado (toast), ver con diseno (modal)
- modal siempre que que ganes un premio (incluso con nada)
- home screen: confetis
- cambios (con diseno) en la pantalla de cobrar premio
- multiples idiomas (mnecisito textos)
- promociones

**B + F**

- pago stripe
- push not con recargas fallidas al realizar una rec (Socket io)
- borrar usuario si desinstala la apk

> screen registro: TODO -- placeholder del input telefono / ver con diseno
> (Consultar con adriana): Cuando expira con el user dentro, que hacer? - propuesta: timer descendente como modal siempre visible.

### Mis notas pa corregir

**Funcionamiento de recarga directa y Cobrar premio**

- Si entras por recarga directa, no sucede nada nuevo, puedes agregar codigo al primer contacto
- Si entras por CObrar premio, se agrega un usuario al final de los agregados, con su premio (si hay un slot libre, el premio se agrega a ese slot)
- Siempre se podra eliminar el premio

  codigo para utilizar - f03ff5d5-b965-4092-b7ba-0c472cbe28ca

### Pending pero no para ahora

- capitalize en email
- cuando presionas boton para submit, mintras esta en loading el boton que no se vea hundido. (sugerencia de Ale)

### Info

app-specific-password (appleid)
yorg-nzvb-ojea-gtnv

app SKU
an.id.for.ache.app.

**github token (deleted):** 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
**ultimo valido** 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

### proximo build> 8 de septiembre

avieriguar si el apple id tiene apple push not activado

### reunion

1 - push notification socket

mandar id del socket en el endpoint de complete transaction
promociones : id de productos en una lista, sera puesto en el endpoint

### ================ Planifiacion

**1- SOCKET + PUSH**

EN general:

- Luego de realizar el pago para completar la recarga (PagoScreen) > guardar lista de contactos a los que se ha recargado en storage (Antes de limpiar estado)
- Leer la data de cada una
- verificar cual no fue completada
- enviar 1 notificacion con los numeros que tuvieron error

pasos

- crear boton para abrir y cerrar sockets, comprobar que pincha - (estado global) _OK_ (en pantalla inicial)
- guardar el socket id (que luego tendre que enviar a backend) _OK_ / **implementado en estado global, al tocar el boton (archivo app.js)**
- crear apertura de ese socket cuando el cliente hace una recarga **(llamar a open connect y poder recuperar el id | probar simplemente al tocar el boton de recarga directa / archivo GameScreen.js)**
- crear data de prueba similar a la que recibire, parsearla y crear push notification con recargas fallidas.
- esperar a que backend este disponible para probar

**2- Stripe Pago**
Retomar la parte fronted y seguir con el backend de prueba
Estudiar cantidades (montos, para no cometer errores) y reembolso
Poner todos los ids en .env file

**3 Multiples Lenguajes Implementar**
Pasar todos los textos que salen a un json (con traduccion en ingles)
Cargar Idioma del storage (configuracion de usuario)
cuando el usuario cambie (guardar en storage)
el estado se carga (con la APP abierta) siempre desde un estado global con context api

**4 Confetis cuadndo se ganan los premios**

**5 Crear modal de segundo premio ganado**

**6 Implementar toast de "no tienes internet"**

#### quedaria pendiente

- implementar bien todo en lo que interviene backend
- cambio de diseno en "Cobrar premio"
