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
En el menú principal aparece el logo del juego, el botón "New Game" que inicia una nueva partida, el botón "Chat" para iniciar sesión y entrar en el lobby y los controles de cada jugador.

## Lobby
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211356210-9ff2f1c6-c5de-41ec-9342-bd22685d7f78.png" width="700" heigth="700"/>
</p>

Pantalla de lobby donde hay 2 secciones, una para el chat que muestra el historial de mensajes y los jugadores conectados y desconectados, y otra sección que muestra las cuentas activas en cada momento.

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

## Pantalla de ganador
<p align="center">
  <img src="https://user-images.githubusercontent.com/116154873/211355692-ca50a3e9-c4e7-4bfb-a4f9-07945155ec70.png" width="700" heigth="700"/>
</p>
Pantalla que muestra el ganador del juego.
