document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const markdownInput = document.getElementById('markdown-input');
    const previewOutput = document.getElementById('preview-output');
    const clearBtn = document.getElementById('clear-btn');
    const exportHtmlBtn = document.getElementById('export-html-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const formatBtns = document.querySelectorAll('.format-btn');

    // Configurar la librería Marked.js
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
    });

    // --- Función principal de renderizado ---
    function renderMarkdown() {
        const markdownText = markdownInput.value;
        const htmlText = marked.parse(markdownText);
        previewOutput.innerHTML = htmlText;
    }

    // --- Inserción de Formato ---
    function insertFormat(formatObj) {
        const startPos = markdownInput.selectionStart;
        const endPos = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(startPos, endPos);
        const currentText = markdownInput.value;

        let insertion = '';
        let newCursorPos = 0;

        switch (formatObj) {
            case 'bold':
                insertion = `**${selectedText || 'texto'}**`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 2;
                break;
            case 'italic':
                insertion = `*${selectedText || 'texto'}*`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 1;
                break;
            case 'h1':
                insertion = `\n# ${selectedText || 'Título'}\n`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 3;
                break;
            case 'h2':
                insertion = `\n## ${selectedText || 'Subtítulo'}\n`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 4;
                break;
            case 'list-ul':
                insertion = `\n- ${selectedText || 'Elemento'}`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 3;
                break;
            case 'list-ol':
                insertion = `\n1. ${selectedText || 'Elemento'}`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 4;
                break;
            case 'quote':
                insertion = `\n> ${selectedText || 'Cita'}`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 3;
                break;
            case 'link':
                insertion = `[${selectedText || 'texto del enlace'}](https://url.com)`;
                newCursorPos = selectedText ? startPos + insertion.length : startPos + 1;
                break;
        }

        // Reemplazar texto
        markdownInput.value = currentText.substring(0, startPos) + insertion + currentText.substring(endPos);
        
        // Restaurar foco y cursor
        markdownInput.focus();
        markdownInput.setSelectionRange(newCursorPos, newCursorPos);
        
        // Actualizar vista previa
        renderMarkdown();
    }

    // --- Event Listeners ---

    // Botones de formato
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            insertFormat(btn.dataset.format);
        });
    });

    // Renderizar en tiempo real mientras se escribe
    markdownInput.addEventListener('input', renderMarkdown);

    // Botón de limpiar
    clearBtn.addEventListener('click', () => {
        markdownInput.value = '';
        renderMarkdown();
        markdownInput.focus();
    });

    // --- Funciones de Exportación ---

    // 1. Exportar a HTML
    exportHtmlBtn.addEventListener('click', () => {
        const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Documento Markdown</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1, h2, h3 { color: #1a1a1a; }
        blockquote { border-left: 4px solid #dfe2e5; color: #6a737d; padding-left: 15px; }
        code { background-color: rgba(27,31,35,0.05); padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    ${previewOutput.innerHTML}
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 2. Exportar a PDF
    exportPdfBtn.addEventListener('click', () => {
        const element = previewOutput;
        
        const opt = {
            margin:       10,
            filename:     'documento.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const originalText = exportPdfBtn.innerHTML;
        exportPdfBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Generando...';
        exportPdfBtn.disabled = true;

        html2pdf().from(element).set(opt).save().then(() => {
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
        }).catch(err => {
            console.error("Error al generar PDF:", err);
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
        });
    });

    // Renderizar el texto de ejemplo inicial
    renderMarkdown();
});