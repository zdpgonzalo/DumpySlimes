# DUMPY SLIMES

## Temática
Dumpy Slimes será un juego de plataformas online en el que varios jugadores competirán entre ellos durante varias rondas para alzarse con la victoria. 
Existirán distintos modos de juego, en los que se controlará a un slime que podrá saltar entre plataformas en niveles verticales generados proceduralmente. 
Los jugadores también podrán usar distintos power-ups para imponerse sobre sus rivales.

## Integrantes
Cécile Laura Bello Duprez / Correo: cl.bello.2020@alumnos.urjc.es / Cuenta: clbello <br />
Christian Campos Pan / Correo: c.campos.2020@alumnos.urjc.es / Cuenta: Ubermewtwo <br />
Gonzalo Gómez Tejedor / Correo: g.gomezt.2020@alumnos.urjc.es / Cuenta: zdpgonzalo <br />
Umesh Mostajo Sáez / Correo: u.mostajo.2020@alumnos.urjc.es / Cuenta: Miles766 <br />
Paula Rojo de la Fuente / Correo: p.rojo.2020@alumnos.urjc.es / Cuenta: PaulaRojo <br />
Eva Sanz García-Muro /Correo: e.sanzg.2020@alumnos.urjc.es / Cuenta: JustV3x <br />

## Trello
https://trello.com/b/2rsKGfLB/jergrupo-c <br/>

## Diseño del juego
El estilo del juego es de tipo Cartoon, con colores suaves y formas redondeadas. Sus personajes son Slimes, que tienen colores básicos que representan a cada jugador, y tienen efecto para simular a un slime real. Además, sus escenarios están ambientados en la selva, con grandes árboles con enredaderas, y con plataformas de piedra.<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/204624327-9c32ab65-33f8-4c02-a2f9-0a55238c06ef.png" width="400" heigth="400"/>
</p>

## Diagrama de navegación
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211354153-d06018a8-5834-44e7-8d52-87c2440ac7a2.png" width="400" heigth="400"/>
</p>
Una vez iniciado el juego, se enseña el menú del juego, desde el cual, se accede a un lobby si la partida es online, y sino se inicia directamente la partida. En cada partida hay varias rondas, donde los jugadores han de pasarse los niveles, y tras la finalización de estos, se accede a un ranking donde se muestran los puntos de cada jugador. Si un jugador consigue todos los puntos necesarios, se muestra la pantalla de victoria.<br/>


## Diagrama de clases
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211353854-3e1b1308-a80d-4cdb-9824-69c4e2258aed.jpeg" width="700" heigth="700"/>
</p>

## Menú principal
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211355132-d1d5a67c-9fe5-4f7e-8eaf-f607e80333b2.png" width="700" heigth="700"/>

</p>
En el menú principal aparece el logo del juego, el botón "New Game" que inicia una nueva partida y los controles de cada jugador.

## Chat
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211356210-9ff2f1c6-c5de-41ec-9342-bd22685d7f78.png" width="700" heigth="700"/>
</p>

Pantalla de chat donde los usuarios pueden enviar mensajes.

## Pantalla de juego
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211355473-ef3e77b4-a7c6-405c-bccd-db2a12e2e1a9.png" width="700" heigth="700"/>
</p>
En la pantalla de juego se desarrolla la partida en la cual pueden participar dos jugadores y está compuesta de 3 rondas. La pantalla de juego está dividida en dos para mostrar el mismo escenario para cada jugador, de esta manera cada uno puede ir a su ritmo. Las burbujas son power-ups que otorgan habilidades especiales a los jugadores si estos las cogen. La corona es la meta y el primer jugador que la alcance gana la ronda. El jugador con más rondas logradas es el vencedor.

## Pantalla de ranking
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211355692-ca50a3e9-c4e7-4bfb-a4f9-07945155ec70.png" width="700" heigth="700"/>
</p>
Pantalla que muestra la puntuación de la ronda de cada uno de los jugadores de la partida.

## Protocolo de WebSockets
Para el correcto funcionamiento de websockets, se han creado varias clases en
Spring para sincronizar las partidas de dos jugadores:
● Account: usada para manejar a los jugadores conectados al servidor. Los atributos
más importantes son el id de la partida (Game) a la que pertenecen y la sesión de
WebSockets a la que corresponden
● Game: esta clase tiene un id para identificar a cada partida y una lista jugadores,
cuyo número máximo es 2, aunque este tamaño máximo está controlado por el
WebSocketsEchoHandler.
● GamesController: este controller configura la petición get de la clase Game, que
puede ser:
○ url/games: devuelve la lista de partidas que tiene WebSocketsEchoHandler.
○ url/games/{id}: devuelve el tamaño de la lista de jugadores de la partida con
ese id.
● WebSocketsEchoHandler: maneja los mensajes recibidos de las distintas sesiones
de WebSockets. Su funcionamiento se explicará en parte en el apartado del
protocolo

## Protocolo
La comunicación entre clientes y el servidor usando WebSockets tiene lugar sólo en
la escena Play del juego.
Al abrir la escena, se inicia la conexión con WebSockets, detectada por
WebSocketsEchoHandler. Si no hay ninguna partida abierta a la que le falten jugadores, se
crea una nueva partida (Game); si no es el caso, une al jugador asociado con dicha
conexión a la partida abierta.
Una vez un jugador se ha unido a una partida, WebSocketsEchoHandler envía un
mensaje para informar a la escena Play cuál es el Slime que controla ese jugador (Rosa o
Azul). Esto se consigue debido a que todos los mensajes que reciben los clientes tienen un
atributo que hace referencia a una función implementada en Play, y al recibir un mensaje, el
cliente ejecuta la función asociada. En el caso del mensaje enviado cuando un jugador es
añadido a una partida, la función es setPlayer.
Inmediatamente, después de saber que Slime controla, el cliente empieza a mandar
mensajes por el Socket con el estado de dicho Slime (posición, velocidad, sprite, etc), y al
recibirlo, el handler se lo envía al resto de sesiones cuyo Game sea el mismo que el
emisario. Estos mensajes se mandan aunque el emisario sea el único jugador dentro de la
partida
Mientras se ejecuta la función setPlayer, el juego comprueba constantemente si hay
2 jugadores en la partida, para ello, envía las peticiones Get url/games/{id} mencionadas
anteriormente. Mientras falten jugadores, la partida no comenzará.
En cuanto un segundo jugador se une al Game, el juego comienza para ambos. Los
mensajes con la información de los Slimes que envía cada cliente son recibidos por el otro e
invocan su función Update, lo que permite sincronizar ambos clientes para que todos los
Slimes se actualicen según las acciones de los distintos jugadores.
Durante el transcurso de la partida, si un jugador usa un Power Up que afecte al
otro, se manda un mensaje por el Socket, con un funcionamiento similar al anterior, aunque
en vez de invocar a la función Update del otro cliente invoca una función determinada según
el Power Up usado.
Finalmente, cuando un jugador llega a la meta, manda dos mensajes.
El primero sirve para actualizar la posición del Slime que ha llegado a la meta en el
otro cliente. El segundo mensaje avisa a WebSocketsEchoHandler de que que la partida ha
terminado y que puede ser eliminada de la lista de Game.
Tras esto, ambos clientes pasan a la escena Winner, donde se muestra al jugador
vencedor. Esta escena carece de cualquier funcionalidad de WebSockets, por lo que ambos
jugadores pueden volver al menú principal y volver a buscar partida, en cuyo caso se crean
sesiones de WebSocket nuevas, ya que las antiguas no se han eliminado.

