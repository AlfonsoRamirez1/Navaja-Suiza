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
            const item = document.createElement('ion-item');
            
            item.innerHTML = `
                <ion-icon name="pricetag-outline" slot="start"></ion-icon>
                <ion-input type="number" placeholder="0" min="0" max="100" value="${discount.value}" data-id="${discount.id}"></ion-input>
                <ion-icon name="percent" slot="end" color="medium"></ion-icon>
                ${discounts.length > 1 ? `
                <ion-button fill="clear" color="danger" slot="end" class="remove-discount-btn" data-id="${discount.id}">
                    <ion-icon name="close" slot="icon-only"></ion-icon>
                </ion-button>
                ` : ''}
            `;
            
            discountsContainer.appendChild(item);
        });

        // Añadir listeners a los nuevos elementos
        const inputs = discountsContainer.querySelectorAll('ion-input');
        inputs.forEach(input => {
            input.addEventListener('ionInput', (e) => {
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
    originalPriceInput.addEventListener('ionInput', () => {
        calculate();
    });

    addDiscountBtn.addEventListener('click', () => {
        discounts.push({ id: Date.now(), value: '' });
        renderDiscounts();
        // Focus en el nuevo input
        const inputs = discountsContainer.querySelectorAll('ion-input');
        if (inputs.length > 0) {
            inputs[inputs.length - 1].setFocus();
        }
    });
});