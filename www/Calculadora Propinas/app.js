document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const billTotalInput = document.getElementById('billTotal');
    const tipPercentageRange = document.getElementById('tipPercentage');
    const tipPercentageDisplay = document.getElementById('tipPercentageDisplay');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const peopleCountInput = document.getElementById('peopleCount');
    const peopleCountDisplay = document.getElementById('peopleCountDisplay');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const basePerPersonDisplay = document.getElementById('basePerPerson');
    const tipPerPersonDisplay = document.getElementById('tipPerPerson');
    const totalPerPersonDisplay = document.getElementById('totalPerPerson');

    // Estado inicial
    let bill = 0;
    let tipPercent = 15;
    let people = 1;

    // Función principal para calcular y actualizar la UI
    function calculate() {
        if (people < 1) {
            people = 1;
            peopleCountInput.value = 1;
        }

        const basePerPerson = bill / people;
        const totalTip = (bill * tipPercent) / 100;
        const tipPerPerson = totalTip / people;
        const totalPerPerson = basePerPerson + tipPerPerson;

        // Formatear a moneda (USD por defecto, o la que consideres)
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });

        // Actualizar UI
        basePerPersonDisplay.textContent = formatter.format(basePerPerson);
        tipPerPersonDisplay.textContent = formatter.format(tipPerPerson);
        totalPerPersonDisplay.textContent = formatter.format(totalPerPerson);
        
        // Actualizar displays de texto
        tipPercentageDisplay.textContent = `${tipPercent}%`;
        peopleCountDisplay.textContent = people;
        
        // Actualizar estado activo de los botones preset
        presetBtns.forEach(btn => {
            if (parseInt(btn.dataset.tip) === tipPercent) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Event Listeners

    // Entrada del total de la cuenta
    billTotalInput.addEventListener('input', (e) => {
        bill = parseFloat(e.target.value) || 0;
        calculate();
    });

    // Rango de porcentaje de propina
    tipPercentageRange.addEventListener('input', (e) => {
        tipPercent = parseInt(e.target.value);
        calculate();
    });

    // Botones preestablecidos de propina
    presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tipPercent = parseInt(e.target.dataset.tip);
            tipPercentageRange.value = tipPercent; // Sincronizar el slider
            calculate();
        });
    });

    // Entrada directa de número de personas
    peopleCountInput.addEventListener('input', (e) => {
        people = parseInt(e.target.value) || 1;
        calculate();
    });

    // Botón menos personas
    btnMinus.addEventListener('click', () => {
        if (people > 1) {
            people--;
            peopleCountInput.value = people;
            calculate();
        }
    });

    // Botón más personas
    btnPlus.addEventListener('click', () => {
        people++;
        peopleCountInput.value = people;
        calculate();
    });

    // Calcular por primera vez al cargar
    calculate();
});