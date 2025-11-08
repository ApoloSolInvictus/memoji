// Esperamos a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Definición de Variables y Constantes ---

    const EMOJI_MASTER_LIST = [
        '😀', '❤️', '😎', '🚀', '🧠', '🧩', '🔥', '🦄', '🥑',
        '🍕', '💡', '🎸', '🌟', '🤖', '👻', '👽', '👾', '👑'
    ];

    // Configuración de los niveles
    // MODIFICACIÓN: Quitamos 'grid' y añadimos 'nombre' para el slider.
    const nivelesConfig = {
        1: { pares: 2,  nombre: 'Fácil (4 cartas)' },
        2: { pares: 3,  nombre: 'Medio (6 cartas)' },
        3: { pares: 4,  nombre: 'Difícil (8 cartas)' },
        4: { pares: 5,  nombre: 'Experto (10 cartas)' },
        5: { pares: 6,  nombre: 'Maestro (12 cartas)' },
        6: { pares: 7,  nombre: 'Leyenda (14 cartas)' },
        7: { pares: 8,  nombre: 'Genio (16 cartas)' },
        8: { pares: 9,  nombre: 'Emoji Dios (18 cartas)' },
    };

    // Variables de estado del juego
    let cartasVolteadas = 0;
    let primeraCarta = null;
    let segundaCarta = null;
    let bloqueoDeTablero = false;
    let paresEncontrados = 0;
    let totalParesDelNivel = 0;

    // Obtenemos los elementos del DOM
    const gameBoard = document.getElementById('game-board');
    
    // NUEVO: Elementos del slider
    const levelSlider = document.getElementById('level-slider');
    const levelDisplay = document.getElementById('level-display');

    // --- 2. Funciones Principales del Juego ---

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
        resetearEstadoJuego();

        const config = nivelesConfig[nivel];
        if (!config) {
            console.error('Nivel no configurado:', nivel);
            return;
        }

        totalParesDelNivel = config.pares;

        // --- IMPORTANTE: Eliminamos la línea de JS que controlaba el CSS ---
        // gameBoard.style.gridTemplateColumns = config.grid; <-- ¡ESTA LÍNEA SE VA!
        // Ahora el CSS (style.css) maneja esto automáticamente.

        // --- Preparar las cartas (esto sigue igual) ---
        barajar(EMOJI_MASTER_LIST);
        const emojisBase = EMOJI_MASTER_LIST.slice(0, totalParesDelNivel);
        let emojisParaElJuego = [...emojisBase, ...emojisBase];
        barajar(emojisParaElJuego);

        crearTablero(emojisParaElJuego);
    }

    function resetearEstadoJuego() {
        cartasVolteadas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueoDeTablero = false;
        paresEncontrados = 0;
        totalParesDelNivel = 0;
        gameBoard.innerHTML = '';
    }

    function crearTablero(emojis) {
        // (Esta función es exactamente igual que antes)
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

    // --- Funciones de Lógica de Juego (Exactamente igual que antes) ---

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

    function comprobarCoincidencia() {
        const esCoincidencia = primeraCarta.dataset.emoji === segundaCarta.dataset.emoji;
        if (esCoincidencia) {
            setTimeout(manejarCoincidencia, 500);
        } else {
            setTimeout(manejarNoCoincidencia, 1000);
        }
    }

    function manejarCoincidencia() {
        primeraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');
        paresEncontrados++;
        resetearTurno();

        if (paresEncontrados === totalParesDelNivel) {
            setTimeout(() => {
                alert('¡Felicidades, ganaste el nivel!');
            }, 800);
        }
    }

    function manejarNoCoincidencia() {
        primeraCarta.classList.remove('flipped');
        segundaCarta.classList.remove('flipped');
        resetearTurno();
    }

    function resetearTurno() {
        cartasVolteadas = 0;
        primeraCarta = null;
        segundaCarta = null;
        bloqueoDeTablero = false;
    }

    // --- 3. Inicio e Interacción (Conectamos el Slider) ---

    // Evento 'input': Se dispara CADA VEZ que mueves el slider.
    // Lo usamos para actualizar el texto (ej. "Fácil", "Medio").
    levelSlider.addEventListener('input', () => {
        const nivel = levelSlider.value;
        levelDisplay.textContent = nivelesConfig[nivel].nombre;
    });

    // Evento 'change': Se dispara cuando SUELTAS el slider.
    // Lo usamos para (re)iniciar el juego con la nueva dificultad.
    levelSlider.addEventListener('change', () => {
        const nivel = levelSlider.value;
        iniciarJuego(nivel);
    });

    // Sincronizamos el texto del display al cargar la página
    levelDisplay.textContent = nivelesConfig[levelSlider.value].nombre;
    
    // Iniciamos el juego en el Nivel 1 por defecto
    iniciarJuego(levelSlider.value);

});
