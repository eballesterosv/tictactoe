# tictactoe
Tic-tac-toe game.
View in live -> PLAYIT (y)->  https://vsoft-tic-tac.netlify.app/

Este juego no implementa ningún algoritmo de teoría de juegos, como minimax.

Aunque el tablero del juego es tratado como un vector, el estado del juego no es almacenado en ningún arreglo o matriz.
Los estados tanto del jugador X como del jugador O son simplemente un numéro entero, cuyo valor depende de la posición elegida por el usuario sumado a las elecciones anteriores. 
Para poder conocer las posiciones seleccionadas durante el juego y elegir un movimiento automatizado,. el número o valor actual de O o de X es convertido a una representación binaria donde un cero representa un vacío y un 1 representa una celda ocupada. un ejemplo para X cuando x = 17 sería 17 a binario = "000010001" los ceros a la izquierda son anexados ya que nuestro tablero contiene 9 posiciones; Este binario representaría una tabla donde la primera y quinta celda están ocupadas por X, 
Por qué X tendría un valor de 17? por que cada posición tiene un valor sacado de 2 a la n potencia, en este caso los valores para las 9 posiciones son : 2^0, 2^1, 2^2, 2^3, 2^4,...2^9
o sea : 1, 2, 4, 8, 16...256.  como X esta ocupando la primera y la quinta posicion x = 1 + 16;

Sabido esto podemos calcular un movimiento automatico simplemente analizando el valor entero de X u O en decimal, o checando las posiciones ocupadas y analizando las lineas formadas mediante la conversión del valor decimal a un string binario.

La respuesta automata tiene tres bases :
1.- Tirar a ganar de ser posible, si no...
2.- Tirar a no perder, si el rival esta por hacerlo, si no ...
3.- Ejecutar una función que analize la mejor posicion posible en base a las celdas ocupadas por el rival.

Este código se vale de operadores bit a bit cuando es necesario saber las posiciones ocupadas por ambos oponentes (X y O).





