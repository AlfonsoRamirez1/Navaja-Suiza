document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const optionsInput = document.getElementById('options-input');
    const clearBtn = document.getElementById('clear-btn');
    const optionsCountDisplay = document.getElementById('options-count');
    const spinBtn = document.getElementById('spin-btn');
    
    const resultDisplay = document.getElementById('result-display');
    const winnerLabel = document.getElementById('winner-label');

    // Variables de estado
    let options = [];
    let isSpinning = false;

    // --- Funciones auxiliares ---
    function updateOptions() {
        // Obtener texto, dividir por saltos de línea, quitar espacios extras y eliminar líneas vacías
        const text = optionsInput.value;
        options = text.split('\n')
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0);
        
        // Actualizar contador
        const count = options.length;
        optionsCountDisplay.textContent = `${count} ${count === 1 ? 'opción ingresada' : 'opciones ingresadas'}`;
        
        // Habilitar/Deshabilitar botón de girar
        spinBtn.disabled = count < 2;
    }

    // --- Event Listeners ---
    optionsInput.addEventListener('ionInput', updateOptions);

    clearBtn.addEventListener('click', () => {
        optionsInput.value = '';
        updateOptions();
        
        // Restaurar pantalla de resultado
        resultDisplay.innerHTML = '<span class="placeholder-text">Ingresa opciones y gira</span>';
        resultDisplay.className = 'result-display';
        winnerLabel.classList.add('hidden');
        optionsInput.setFocus();
    });

    spinBtn.addEventListener('click', () => {
        if (options.length < 2 || isSpinning) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        
        // Limpiar estado visual anterior
        winnerLabel.classList.add('hidden');
        resultDisplay.className = 'result-display spinning';
        
        // Animación tipo slot machine / ruleta
        let currentLoop = 0;
        const maxLoops = 20; // Cuántos saltos dará antes de parar
        const baseSpeed = 50; // Velocidad inicial en ms
        
        function spin() {
            // Mostrar una opción al azar rápidamente
            const randomIndex = Math.floor(Math.random() * options.length);
            resultDisplay.textContent = options[randomIndex];
            
            currentLoop++;
            
            if (currentLoop < maxLoops) {
                // Hacer que la velocidad disminuya al final (efecto de frenado)
                const nextSpeed = baseSpeed + (currentLoop * 5);
                setTimeout(spin, nextSpeed);
            } else {
                // Selección final
                const winnerIndex = Math.floor(Math.random() * options.length);
                const winner = options[winnerIndex];
                
                resultDisplay.textContent = winner;
                resultDisplay.className = 'result-display winner';
                winnerLabel.classList.remove('hidden');
                
                // Efecto de Confeti (si la librería está cargada)
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#a855f7', '#9333ea', '#ffffff'] // Colores morados
                    });
                }
                
                isSpinning = false;
                spinBtn.disabled = false;
            }
        }
        
        // Iniciar animación
        spin();
    });

    // Inicializar estado
    updateOptions();
});