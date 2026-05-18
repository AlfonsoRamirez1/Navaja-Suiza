document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const editorContainer = document.getElementById('editor-container');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const colorPreview = document.getElementById('color-preview');
    const toleranceSlider = document.getElementById('tolerance-slider');
    const toleranceDisplay = document.getElementById('tolerance-display');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Estado original de la imagen
    let originalImageData = null;
    let selectedColor = null; // {r, g, b}

    // --- Manejo del Drag & Drop y Click ---
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0]);
        }
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadImage(e.dataTransfer.files[0]);
        }
    });

    // --- Carga de Imagen al Canvas ---
    function loadImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, sube una imagen válida.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Ajustar tamaño del canvas a la imagen
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Dibujar imagen
                ctx.drawImage(img, 0, 0);
                
                // Guardar los datos de los píxeles originales para poder restaurar y aplicar tolerancia
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Mostrar editor y ocultar zona de subida
                uploadArea.classList.add('hidden');
                editorContainer.classList.remove('hidden');
                
                // Resetear estado
                selectedColor = null;
                colorPreview.style.background = 'transparent';
                toleranceSlider.disabled = true;
                toleranceSlider.value = 20;
                toleranceDisplay.textContent = '20%';
                downloadBtn.disabled = false; // Se puede descargar la original si se quiere
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // --- Interacción con el Canvas (Gotero / Click) ---
    canvas.addEventListener('click', (e) => {
        if (!originalImageData) return;

        // Obtener coordenadas del clic relativas al canvas
        const rect = canvas.getBoundingClientRect();
        
        // Calcular la escala por si el canvas se muestra más pequeño por CSS
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        // Obtener el color del píxel exacto de los datos ORIGINALES (antes de cualquier transparencia)
        const pixelIndex = (y * canvas.width + x) * 4;
        const r = originalImageData.data[pixelIndex];
        const g = originalImageData.data[pixelIndex + 1];
        const b = originalImageData.data[pixelIndex + 2];
        const a = originalImageData.data[pixelIndex + 3];

        // Si se hizo clic en un píxel que ya es transparente en el original, ignorar
        if (a === 0) return;

        selectedColor = { r, g, b };
        
        // Actualizar UI
        colorPreview.style.background = `rgb(${r}, ${g}, ${b})`;
        toleranceSlider.disabled = false;
        
        // Aplicar la eliminación
        removeColor();
    });

    // --- Algoritmo de Eliminación de Color ---
    function removeColor() {
        if (!originalImageData || !selectedColor) return;

        const tolerance = parseInt(toleranceSlider.value);
        // La diferencia máxima de color es aprox 441 (sqrt(255^2 + 255^2 + 255^2))
        // Convertimos el % de tolerancia a un rango razonable
        const toleranceValue = (tolerance / 100) * 200; 

        // Crear una copia nueva de los datos originales
        const newImageData = new ImageData(
            new Uint8ClampedArray(originalImageData.data),
            originalImageData.width,
            originalImageData.height
        );

        const data = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // data[i+3] es el Alpha (opacidad)

            // Calcular la distancia (diferencia) entre este píxel y el color seleccionado
            // Usamos distancia euclidiana simple en el espacio RGB
            const distance = Math.sqrt(
                Math.pow(r - selectedColor.r, 2) +
                Math.pow(g - selectedColor.g, 2) +
                Math.pow(b - selectedColor.b, 2)
            );

            // Si el color es "suficientemente parecido" según la tolerancia, lo hacemos transparente
            if (distance <= toleranceValue) {
                data[i + 3] = 0; // Alpha = 0 (Totalmente transparente)
            }
        }

        // Poner los nuevos píxeles en el canvas
        ctx.putImageData(newImageData, 0, 0);
    }

    // --- Controles ---
    toleranceSlider.addEventListener('input', (e) => {
        toleranceDisplay.textContent = `${e.target.value}%`;
        removeColor(); // Re-aplicar el algoritmo en tiempo real al mover el slider
    });

    resetBtn.addEventListener('click', () => {
        if (!originalImageData) return;
        
        // Restaurar imagen original
        ctx.putImageData(originalImageData, 0, 0);
        
        // Resetear UI
        selectedColor = null;
        colorPreview.style.background = 'transparent';
        toleranceSlider.disabled = true;
    });

    // --- Descarga ---
    downloadBtn.addEventListener('click', () => {
        // Obtener la imagen del canvas como PNG (el PNG soporta transparencia)
        const dataURL = canvas.toDataURL('image/png');
        
        // Crear un enlace temporal para descargar
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'logo_transparente.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});