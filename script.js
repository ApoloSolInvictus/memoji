// Esperamos a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Definición de Variables y Constantes ---

    // Lista Maestra de Emojis (¡Añade todos los que quieras!)
    // Necesitamos al menos 9 para cubrir los 18 pares que mencionaste.
    const EMOJI_MASTER_LIST = [
        '😀', '❤️', '😎', '🚀', '🧠', '🧩', '🔥', '🦄', '🥑',
        '🍕', '💡', '🎸', '🌟', '🤖', '👻', '👽', '👾', '👑'
    ];

    // Configuración de los niveles que mencionaste
    // 'pares': cuántos pares únicos.
    // 'grid': cómo se verá el tablero (columnas x filas).
    const nivelesConfig = {
        1: { pares: 2,  grid: 'repeat(2, 100px)' }, // 4 cartas (2x2)
        2: { pares: 3,  grid: 'repeat(3, 100px)' }, // 6 cartas (3x2)
        3: { pares: 4,  grid: 'repeat(4, 100px)' }, // 8 cartas (4x2)
        4: { pares: 5,  grid: 'repeat(5, 100px)' }, // 10 cartas (5x2)
        5: { pares: 6,  grid: 'repeat(4, 100px)' }, // 12 cartas (4x3) - Ajustado
        6: { pares: 7,  grid: 'repeat(7, 100px)' }, // 14 cartas (7x2)
        7: { pares: 8,  grid: 'repeat(4, 100px)' }, // 16 cartas (4x4) - Ajustado
        8: { pares: 9,  grid: 'repeat(6, 100px)' }, // 18 cartas (6x3) - Ajustado
    };

    // Variables de estado del juego (se resetean con cada juego)
    let cartasVolteadas = 0;
    let primeraCarta = null;
    let segundaCarta = null;
    let bloqueoDeTablero = false;
    let paresEncontrados = 0;
    let totalParesDelNivel = 0;

    // Obtenemos los elementos del DOM
    const gameBoard = document.getElementById('game-board');
    const levelButtons = document.querySelectorAll('.level-btn');

    // --- 2. Funciones Principales del Juego ---

    /**
     * Función para barajar (mezclar) un array.
     * Algoritmo Fisher-Yates.
     */
    function barajar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Función Maestra: Inicia o Reinicia el juego para un nivel específico.
     */
    function iniciarJuego(nivel) {
        // Reseteamos el estado del juego
        resetearEstadoJuego();

        // Obtenemos la configuración del nivel
        const config = nivelesConfig[nivel];
        if (!config) {
            console.error('Nivel no configurado:', nivel);
            return;
        }

        totalParesDelNivel = config.pares;

        // Ajustamos el CSS del tablero dinámicamente
        gameBoard.style.gridTemplateColumns = config.grid;

        // --- Preparar las cartas ---
        
        // 1. Barajamos la lista maestra para obtener variedad cada vez
        barajar(EMOJI_MASTER_LIST);
        
        // 2. Tomamos solo los emojis necesarios para este nivel
        const emojisBase = EMOJI_MASTER_LIST.slice(0, totalParesDelNivel);
        
        // 3. Duplicamos los emojis para tener los pares
        let emojisParaElJuego = [...emojisBase, ...emojisBase];
        
        // 4. Barajamos el mazo final del juego
        barajar(emojisParaElJuego);

        // Creamos las cartas en el HTML
        crearTablero(emojisParaElJuego);
    }

    /**
     * Resetea las variables globales y limpia el tablero.
     */
    function resetearEstadoJuego() {
        cartasVolteadas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueoDeTablero = false;
        paresEncontrados = 0;
        totalParesDelNivel = 0;
        gameBoard.innerHTML = ''; // Limpiamos el tablero anterior
    }

    /**
     * Función para crear el tablero y las cartas en el HTML.
     */
    function crearTablero(emojis) {
        emojis.forEach(emoji => {
            const carta = document.createElement('div');
            carta.classList.add('card');
            carta.dataset.emoji = emoji;

            const cartaInner = document.createElement('div');
            cartaInner.classList.add('card-inner');

            const cartaFront = document.createElement('div');
            cartaFront.classList.add('card-front');
            cartaFront.textContent = '?';

            const cartaBack = document.createElement('div');
            cartaBack.classList.add('card-back');
            cartaBack.textContent = emoji;

            cartaInner.appendChild(cartaFront);
            cartaInner.appendChild(cartaBack);
            carta.appendChild(cartaInner);
            gameBoard.appendChild(carta);

            carta.addEventListener('click', () => voltearCarta(carta));
        });
    }

    /**
     * Lógica de voltear carta (igual que antes).
     */
    function voltearCarta(carta) {
        if (bloqueoDeTablero || carta === primeraCarta || carta.classList.contains('matched')) {
            return;
        }

        carta.classList.add('flipped');

        if (cartasVolteadas === 0) {
            cartasVolteadas = 1;
            primeraCarta = carta;
        } else {
            cartasVolteadas = 2;
            segundaCarta = carta;
            bloqueoDeTablero = true;
            comprobarCoincidencia();
        }
    }

    /**
     * Lógica de comprobar coincidencia (igual que antes).
     */
    function comprobarCoincidencia() {
        const esCoincidencia = primeraCarta.dataset.emoji === segundaCarta.dataset.emoji;

        if (esCoincidencia) {
            setTimeout(manejarCoincidencia, 500);
        } else {
            setTimeout(manejarNoCoincidencia, 1000);
        }
    }

    /**
     * Lógica de manejo de coincidencia (casi igual, comprueba la victoria).
     */
    function manejarCoincidencia() {
        primeraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');

        paresEncontrados++;
        
        resetearTurno();

        // Comprobamos si ganó el nivel
        if (paresEncontrados === totalParesDelNivel) {
            setTimeout(() => {
                alert('¡Felicidades, ganaste el nivel!');
                // (Aquí podríamos pasar al siguiente nivel automáticamente)
            }, 800);
        }
    }

    /**
     * Lógica de NO coincidencia (igual que antes).
     */
    function manejarNoCoincidencia() {
        primeraCarta.classList.remove('flipped');
        segundaCarta.classList.remove('flipped');
        resetearTurno();
    }

    /**
     * Lógica de resetear turno (igual que antes).
     */
    function resetearTurno() {
        cartasVolteadas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueoDeTablero = false;
    }

    // --- 3. Inicio e Interacción ---

    // Añadimos los 'listeners' a los botones de nivel
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nivel = button.dataset.level;
            iniciarJuego(nivel);
        });
    });

    // Iniciamos el juego en el Nivel 1 por defecto al cargar la página
    iniciarJuego(1);

});
