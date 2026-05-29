document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const editorContainer = document.getElementById('editor-container');
    
    const originalImg = document.getElementById('original-img');
    const compressedImg = document.getElementById('compressed-img');
    const originalSizeDisplay = document.getElementById('original-size');
    const compressedSizeDisplay = document.getElementById('compressed-size');
    
    const qualitySlider = document.getElementById('quality-slider');
    const qualityDisplay = document.getElementById('quality-display');
    const savingsPercentageDisplay = document.getElementById('savings-percentage');
    
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Variables de estado
    let originalFile = null;
    let originalSize = 0;
    let compressedBlob = null;

    // --- Formateo de bytes a KB/MB ---
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    // --- Manejo de Subida ---
    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
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
            handleFile(e.dataTransfer.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, sube un archivo de imagen válido.');
            return;
        }

        originalFile = file;
        originalSize = file.size;
        
        // Mostrar tamaño original
        originalSizeDisplay.textContent = formatBytes(originalSize);
        
        // Mostrar imagen original
        const originalUrl = URL.createObjectURL(file);
        originalImg.src = originalUrl;
        
        // Mostrar UI del editor
        uploadArea.classList.add('hidden');
        editorContainer.classList.remove('hidden');
        
        // Comprimir inicialmente con el valor por defecto del slider (80%)
        compressImage();
    }

    // --- Lógica de Compresión (usando Canvas) ---
    function compressImage() {
        if (!originalFile) return;

        const quality = parseInt(qualitySlider.value) / 100;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Crear un canvas con las dimensiones originales
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                
                // Si la imagen es PNG transparente y la guardamos como JPG, el fondo se vuelve negro.
                // Lo llenamos de blanco por defecto para evitar eso.
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Dibujar la imagen sobre el fondo blanco
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Convertir el canvas a Blob (JPG) aplicando la compresión
                // Nota: toBlob siempre usa 'image/jpeg' o 'image/webp' para aplicar quality
                canvas.toBlob((blob) => {
                    compressedBlob = blob;
                    const compressedUrl = URL.createObjectURL(blob);
                    
                    // Actualizar imagen comprimida
                    compressedImg.src = compressedUrl;
                    
                    // Actualizar tamaño comprimido
                    compressedSizeDisplay.textContent = formatBytes(blob.size);
                    
                    // Calcular y mostrar porcentaje de ahorro
                    const savings = ((originalSize - blob.size) / originalSize) * 100;
                    
                    if (savings > 0) {
                        savingsPercentageDisplay.textContent = `${savings.toFixed(1)}%`;
                        savingsPercentageDisplay.style.color = '#10b981'; // Verde
                    } else {
                        // A veces, al 100% de calidad, el tamaño sube (ahorro negativo)
                        savingsPercentageDisplay.textContent = `0% (Más pesada)`;
                        savingsPercentageDisplay.style.color = '#ef4444'; // Rojo
                    }
                    
                }, 'image/jpeg', quality);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(originalFile);
    }

    // --- Controles ---
    qualitySlider.addEventListener('input', (e) => {
        qualityDisplay.textContent = `${e.target.value}%`;
    });

    // En lugar de comprimir en cada píxel que se mueve (lo que causaría lag),
    // comprimimos cuando el usuario suelta el slider (evento 'change')
    qualitySlider.addEventListener('change', compressImage);

    resetBtn.addEventListener('click', () => {
        originalFile = null;
        fileInput.value = '';
        editorContainer.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        
        // Reset slider
        qualitySlider.value = 80;
        qualityDisplay.textContent = '80%';
    });

    downloadBtn.addEventListener('click', () => {
        if (!compressedBlob) return;
        
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generar un nombre de archivo
        const originalName = originalFile.name.split('.')[0];
        a.download = `${originalName}_comprimida.jpg`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});