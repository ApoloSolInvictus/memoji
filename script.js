// Esperamos a que todo el HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Definición de Variables y Constantes ---

    // Los emojis para el nivel 1. ¡Dos pares!
    // Usamos un array que luego duplicaremos y barajaremos.
    const emojisBase = ['😀', '❤️'];
    
    // Duplicamos los emojis para tener los pares
    let emojisParaElJuego = [...emojisBase, ...emojisBase];

    // Variables para controlar el estado del juego
    let cartasVolteadas = 0;
    let primeraCarta = null;
    let segundaCarta = null;
    let bloqueoDeTablero = false; // Para evitar que se volteen más de 2 cartas
    let paresEncontrados = 0;

    // Obtenemos el tablero del HTML
    const gameBoard = document.getElementById('game-board');

    // --- 2. Funciones Principales ---

    /**
     * Función para barajar (mezclar) un array.
     * Algoritmo Fisher-Yates: moderno y eficiente.
     */
    function barajar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambio
        }
    }

    /**
     * Función para crear el tablero y las cartas.
     */
    function crearTablero() {
        // Primero, barajamos los emojis
        barajar(emojisParaElJuego);

        // Creamos una carta por cada emoji en el array
        emojisParaElJuego.forEach(emoji => {
            // Creamos los elementos HTML
            const carta = document.createElement('div');
            carta.classList.add('card');
            // Guardamos el emoji en el 'dataset' para poder compararlo luego
            carta.dataset.emoji = emoji;

            const cartaInner = document.createElement('div');
            cartaInner.classList.add('card-inner');

            const cartaFront = document.createElement('div');
            cartaFront.classList.add('card-front');
            cartaFront.textContent = '?'; // Lo que se ve boca abajo

            const cartaBack = document.createElement('div');
            cartaBack.classList.add('card-back');
            cartaBack.textContent = emoji; // El emoji

            // Armamos la estructura (como un sándwich)
            cartaInner.appendChild(cartaFront);
            cartaInner.appendChild(cartaBack);
            carta.appendChild(cartaInner);

            // Añadimos la carta al tablero
            gameBoard.appendChild(carta);

            // Añadimos el evento de click a la carta
            carta.addEventListener('click', () => voltearCarta(carta));
        });
    }

    /**
     * Función que se ejecuta al hacer clic en una carta.
     */
    function voltearCarta(carta) {
        // Si el tablero está bloqueado (esperando), o la carta ya está volteada
        // o ya hizo match, no hacemos nada.
        if (bloqueoDeTablero || carta === primeraCarta || carta.classList.contains('matched')) {
            return;
        }

        // Volteamos la carta añadiendo la clase 'flipped'
        carta.classList.add('flipped');

        if (cartasVolteadas === 0) {
            // Es la primera carta que volteamos
            cartasVolteadas = 1;
            primeraCarta = carta;
        } else {
            // Es la segunda carta
            cartasVolteadas = 2;
            segundaCarta = carta;
            
            // Bloqueamos el tablero mientras comprobamos
            bloqueoDeTablero = true;

            // Comprobamos si son iguales
            comprobarCoincidencia();
        }
    }

    /**
     * Comprueba si las dos cartas volteadas son iguales.
     */
    function comprobarCoincidencia() {
        // Comparamos los emojis guardados en el 'dataset'
        const esCoincidencia = primeraCarta.dataset.emoji === segundaCarta.dataset.emoji;

        if (esCoincidencia) {
            // ¡Es un par!
            // Usamos setTimeout para que el jugador vea la coincidencia
            // antes de que desaparezcan.
            setTimeout(manejarCoincidencia, 500);
        } else {
            // No es un par
            // Usamos setTimeout para dar tiempo al jugador de memorizar
            setTimeout(manejarNoCoincidencia, 1000);
        }
    }

    /**
     * Se ejecuta si las cartas coinciden.
     */
    function manejarCoincidencia() {
        primeraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');

        paresEncontrados++;
        
        // Reseteamos el estado para el siguiente turno
        resetearTurno();

        // Comprobamos si ganó
        if (paresEncontrados === emojisBase.length) {
            // Usamos setTimeout para que la última carta termine de desaparecer
            setTimeout(() => {
                alert('¡Felicidades, ganaste!');
                // (Aquí podríamos reiniciar el juego o pasar al siguiente nivel)
            }, 800);
        }
    }

    /**
     * Se ejecuta si las cartas NO coinciden.
     */
    function manejarNoCoincidencia() {
        // Les quitamos la clase 'flipped' para que vuelvan a su estado inicial
        primeraCarta.classList.remove('flipped');
        segundaCarta.classList.remove('flipped');

        // Reseteamos el estado para el siguiente turno
        resetearTurno();
    }

    /**
     * Resetea las variables después de cada turno.
     */
    function resetearTurno() {
        cartasVolteadas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueoDeTablero = false; // Desbloqueamos el tablero
    }

    // --- 3. Inicio del Juego ---
    
    // ¡Llamamos a la función para que todo comience!
    crearTablero();

});