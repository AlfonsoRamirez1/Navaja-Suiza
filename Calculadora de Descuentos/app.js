document.addEventListener('DOMContentLoaded', () => {
    const originalPriceInput = document.getElementById('originalPrice');
    const discountsContainer = document.getElementById('discounts-container');
    const addDiscountBtn = document.getElementById('add-discount-btn');
    
    const finalPriceDisplay = document.getElementById('finalPrice');
    const totalSavedDisplay = document.getElementById('totalSaved');
    const effectiveDiscountDisplay = document.getElementById('effective-discount');

    // Estado inicial
    let originalPrice = 0;
    // Empezamos con un input de descuento vacío
    let discounts = [{ id: Date.now(), value: '' }];

    // Formateador de moneda
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // Inicializar UI
    renderDiscounts();
    calculate();

    // Función principal para calcular
    function calculate() {
        // Validar y obtener el precio original
        let currentPrice = parseFloat(originalPriceInput.value) || 0;
        const initialPrice = currentPrice;

        // Aplicar descuentos uno por uno (descuentos en cadena)
        discounts.forEach(discountObj => {
            const discountValue = parseFloat(discountObj.value) || 0;
            if (discountValue > 0) {
                // El descuento no puede exceder el 100% en un solo paso
                const validDiscount = Math.min(discountValue, 100);
                currentPrice = currentPrice * (1 - (validDiscount / 100));
            }
        });

        // Asegurar que el precio final no sea negativo
        const finalPrice = Math.max(currentPrice, 0);
        const totalSaved = initialPrice - finalPrice;
        
        let effectivePercentage = 0;
        if (initialPrice > 0) {
            effectivePercentage = (totalSaved / initialPrice) * 100;
        }

        // Actualizar UI
        finalPriceDisplay.textContent = formatter.format(finalPrice);
        totalSavedDisplay.textContent = formatter.format(totalSaved);
        effectiveDiscountDisplay.textContent = `${effectivePercentage.toFixed(1)}% de descuento efectivo`;
    }

    // Renderizar los inputs de descuento
    function renderDiscounts() {
        discountsContainer.innerHTML = '';
        
        discounts.forEach((discount, index) => {
            const item = document.createElement('div');
            item.className = 'discount-item';
            
            item.innerHTML = `
                <div class="input-row has-percent-icon">
                    <input type="number" placeholder="0" min="0" max="100" value="${discount.value}" data-id="${discount.id}">
                    <i class="ph ph-percent percent-icon"></i>
                </div>
                ${discounts.length > 1 ? `
                <button class="remove-discount-btn" data-id="${discount.id}" title="Eliminar descuento">
                    <i class="ph ph-x"></i>
                </button>
                ` : ''}
            `;
            
            discountsContainer.appendChild(item);
        });

        // Añadir listeners a los nuevos elementos
        const inputs = discountsContainer.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const id = parseInt(e.target.dataset.id);
                const obj = discounts.find(d => d.id === id);
                if (obj) {
                    obj.value = e.target.value;
                    calculate();
                }
            });
        });

        const removeBtns = discountsContainer.querySelectorAll('.remove-discount-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                discounts = discounts.filter(d => d.id !== id);
                renderDiscounts();
                calculate();
            });
        });
    }

    // Eventos
    originalPriceInput.addEventListener('input', () => {
        calculate();
    });

    addDiscountBtn.addEventListener('click', () => {
        discounts.push({ id: Date.now(), value: '' });
        renderDiscounts();
        // Focus en el nuevo input
        const inputs = discountsContainer.querySelectorAll('input');
        if (inputs.length > 0) {
            inputs[inputs.length - 1].focus();
        }
    });
});