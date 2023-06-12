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
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/fb4a9878-6e4a-497d-a599-2866cfbc35f0"/>
</p>
Una vez iniciado el juego, se enseña el menú del juego, desde el cual, se accede a un lobby si la partida es online, y sino se inicia directamente la partida. En cada partida hay varias rondas, donde los jugadores han de pasarse los niveles, y tras la finalización de estos, se accede a un ranking donde se muestran los puntos de cada jugador. Si un jugador consigue todos los puntos necesarios, se muestra la pantalla de victoria.<br/>


## Diagrama de clases
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/ea4648a4-64fc-46b7-baea-683aee7452d1"/>
</p>

## Menú principal
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/dd1d1f6e-f7dc-4b4b-89a0-9fe7d8883b0b"/>

</p>
En el menú principal aparece el logo del juego, el botón "New Game" que inicia una nueva partida, el botón "Chat" para iniciar sesión y entrar en el lobby y los controles de cada jugador.

## Lobby
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/f8e243ef-3e54-48e8-8f36-531c3d4304d4" width="700" heigth="700"/>
</p>

Pantalla de lobby donde hay 2 secciones, una para el chat que muestra el historial de mensajes y los jugadores conectados y desconectados, y otra sección que muestra las cuentas activas en cada momento.

## Pantalla de juego
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/c4efed10-cc3f-4b4f-98b0-849f0c81df07" width="700" heigth="700"/>
</p>
En la pantalla de juego se desarrolla la partida en la cual pueden participar dos jugadores y está compuesta de 3 rondas. La pantalla de juego está dividida en dos para mostrar el mismo escenario para cada jugador, de esta manera cada uno puede ir a su ritmo. Las burbujas son power-ups que otorgan habilidades especiales a los jugadores si estos las cogen. La corona es la meta y el primer jugador que la alcance gana la ronda. El jugador con más rondas logradas es el vencedor.

## Pantalla de ranking
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/aa11bc7b-2642-4161-93c9-4741ace94247" width="700" heigth="700"/>
</p>
Pantalla que muestra la puntuación de la ronda de cada uno de los jugadores de la partida.

## Pantalla de ganador
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/f2dd308d-29d5-46fa-ac1c-65249d64bb68" width="700" heigth="700"/>
</p>
Pantalla que muestra el ganador del juego.

## Instrucciones para ejecutar el .jar
Para ejecutar el .jar hay que abrir el cmd y escribir el comando cd seguido de la ruta donde está el .jar y dar a enter, tras esto hay que escribir java -jar seguido del nombre del archivo .jar, como en la siguiente imagen:
<p align="center">
  <img src="https://github.com/zdpgonzalo/DumpySlimes/assets/86959459/dd2a9305-49e0-411b-aab5-801c2cb7e02b" width="700" heigth="700"/>
</p>
