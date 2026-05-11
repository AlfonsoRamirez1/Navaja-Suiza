const qrText = document.getElementById('qr-text');
const generateBtn = document.getElementById('generate-btn');
const qrCodeDiv = document.getElementById('qr-code');
const errorMsg = document.getElementById('error-msg');

let qrcode = null;

generateBtn.addEventListener('click', () => {
    const text = qrText.value.trim();

    if (!text) {
        errorMsg.classList.remove('hidden');
        qrCodeDiv.style.display = 'none';
        return;
    }

    errorMsg.classList.add('hidden');
    qrCodeDiv.style.display = 'block';

    // Si ya existe un código QR, lo borramos para crear uno nuevo
    if (qrcode) {
        qrcode.clear();
        qrCodeDiv.innerHTML = '';
    }

    // Generamos el nuevo código QR
    qrcode = new QRCode(qrCodeDiv, {
        text: text,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});

// Permitir generar al presionar "Enter"
qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});
