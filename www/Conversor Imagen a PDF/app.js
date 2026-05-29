document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imageGrid = document.getElementById('image-grid');
    const imgCountDisplay = document.getElementById('img-count');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');

    // Estado para guardar las imágenes (Base64)
    let images = [];

    // --- Manejo del Drag & Drop y Click ---
    
    // Al hacer clic en el área, simula un clic en el input de archivo
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Manejo de la selección de archivos
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Resetear el input para poder subir los mismos archivos de nuevo si se borran
    });

    // Efectos de arrastrar y soltar
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // --- Procesamiento de Imágenes ---

    function handleFiles(files) {
        // Filtrar solo imágenes
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) return;

        // Leer cada imagen usando FileReader
        imageFiles.forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imgData = e.target.result;
                images.push(imgData);
                renderPreview();
                updateUI();
            };
            
            reader.readAsDataURL(file);
        });
    }

    function renderPreview() {
        imageGrid.innerHTML = '';
        
        images.forEach((imgSrc, index) => {
            const card = document.createElement('div');
            card.className = 'img-preview-card';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'remove-img-btn';
            deleteBtn.innerHTML = '<i class="ph ph-x"></i>';
            deleteBtn.title = 'Eliminar';
            
            // Eliminar imagen específica
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic se propague (aunque no hay evento en la tarjeta)
                images.splice(index, 1);
                renderPreview();
                updateUI();
            });
            
            card.appendChild(img);
            card.appendChild(deleteBtn);
            imageGrid.appendChild(card);
        });
    }

    function updateUI() {
        imgCountDisplay.textContent = images.length;
        
        if (images.length > 0) {
            previewContainer.classList.remove('hidden');
            generatePdfBtn.disabled = false;
        } else {
            previewContainer.classList.add('hidden');
            generatePdfBtn.disabled = true;
        }
    }

    // --- Borrar Todo ---
    clearAllBtn.addEventListener('click', () => {
        images = [];
        renderPreview();
        updateUI();
    });

    // --- Generación del PDF (usando jsPDF) ---
    generatePdfBtn.addEventListener('click', () => {
        if (images.length === 0) return;

        // Cambiar estado del botón
        const originalText = generatePdfBtn.innerHTML;
        generatePdfBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Procesando...';
        generatePdfBtn.disabled = true;

        // Pequeño timeout para permitir que la UI se actualice antes del procesamiento pesado
        setTimeout(() => {
            try {
                // Crear nueva instancia de jsPDF
                // jsPDF está disponible globalmente por la etiqueta <script> en HTML
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, tamaño A4

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                images.forEach((imgSrc, index) => {
                    // Si no es la primera imagen, añadir una nueva página
                    if (index > 0) {
                        pdf.addPage();
                    }

                    // Crear un objeto de imagen temporal para obtener sus dimensiones reales
                    const img = new Image();
                    img.src = imgSrc;
                    
                    // Calcular proporciones para que la imagen quepa en la página A4 sin distorsionarse
                    const imgRatio = img.width / img.height;
                    const pageRatio = pageWidth / pageHeight;
                    
                    let finalWidth = pageWidth;
                    let finalHeight = pageWidth / imgRatio;

                    // Si la altura calculada es mayor que la página, ajustar por altura
                    if (finalHeight > pageHeight) {
                        finalHeight = pageHeight;
                        finalWidth = pageHeight * imgRatio;
                    }

                    // Centrar la imagen en la página
                    const x = (pageWidth - finalWidth) / 2;
                    const y = (pageHeight - finalHeight) / 2;

                    // Añadir la imagen al PDF (asumimos JPEG o PNG)
                    // Para mayor compatibilidad, a veces es mejor especificar el formato, pero jsPDF suele autodetectarlo
                    pdf.addImage(imgSrc, x, y, finalWidth, finalHeight);
                });

                // Descargar el PDF
                pdf.save('Documento_Imagenes.pdf');
            } catch (error) {
                console.error("Error al generar PDF:", error);
                alert("Hubo un error al generar el PDF.");
            } finally {
                // Restaurar botón
                generatePdfBtn.innerHTML = originalText;
                generatePdfBtn.disabled = false;
            }
        }, 100);
    });
});