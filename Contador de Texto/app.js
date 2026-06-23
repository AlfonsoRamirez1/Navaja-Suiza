document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const textInput = document.getElementById('text-input');
    const clearBtn = document.getElementById('clear-btn');
    
    const wordCountDisplay = document.getElementById('word-count');
    const charCountDisplay = document.getElementById('char-count');
    const charNoSpacesCountDisplay = document.getElementById('char-no-spaces-count');
    const paragraphCountDisplay = document.getElementById('paragraph-count');

    // Función para actualizar las estadísticas
    function updateCounts() {
        const text = textInput.value;

        // 1. Conteo de palabras
        // Se usa una expresión regular para encontrar secuencias de no-espacios.
        // El filtro elimina strings vacíos que pueden aparecer si hay múltiples espacios.
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;

        // 2. Conteo de caracteres (con espacios)
        const charCount = text.length;

        // 3. Conteo de caracteres (sin espacios)
        const charNoSpacesCount = text.replace(/\s/g, '').length;

        // 4. Conteo de párrafos
        // Se considera un párrafo a un bloque de texto separado por uno o más saltos de línea.
        const paragraphs = text.trim().split(/\n+/).filter(p => p.length > 0);
        const paragraphCount = paragraphs.length;

        // Actualizar la UI
        wordCountDisplay.textContent = wordCount;
        charCountDisplay.textContent = charCount;
        charNoSpacesCountDisplay.textContent = charNoSpacesCount;
        paragraphCountDisplay.textContent = paragraphCount;
    }

    // Event Listeners

    // Actualizar en tiempo real mientras se escribe
    textInput.addEventListener('ionInput', updateCounts);

    // Botón para limpiar el área de texto
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCounts(); // Actualizar contadores a cero
        textInput.setFocus(); // Devolver el foco al textarea
    });

    // Llamada inicial para que los contadores muestren 0 si no hay texto
    updateCounts();
});