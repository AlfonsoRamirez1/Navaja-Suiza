const unitsData = {
    length: {
        meter: { name: 'Metro', factor: 1 },
        kilometer: { name: 'Kilómetro', factor: 1000 },
        centimeter: { name: 'Centímetro', factor: 0.01 },
        millimeter: { name: 'Milímetro', factor: 0.001 },
        mile: { name: 'Milla', factor: 1609.34 },
        yard: { name: 'Yarda', factor: 0.9144 },
        foot: { name: 'Pie', factor: 0.3048 },
        inch: { name: 'Pulgada', factor: 0.0254 }
    },
    weight: {
        kilogram: { name: 'Kilogramo', factor: 1 },
        gram: { name: 'Gramo', factor: 0.001 },
        milligram: { name: 'Miligramo', factor: 0.000001 },
        ton: { name: 'Tonelada', factor: 1000 },
        pound: { name: 'Libra', factor: 0.453592 },
        ounce: { name: 'Onza', factor: 0.0283495 }
    },
    temperature: {
        celsius: { name: 'Celsius' },
        fahrenheit: { name: 'Fahrenheit' },
        kelvin: { name: 'Kelvin' }
    },
    volume: {
        liter: { name: 'Litro', factor: 1 },
        milliliter: { name: 'Mililitro', factor: 0.001 },
        gallon_us: { name: 'Galón (EE. UU.)', factor: 3.78541 },
        gallon_uk: { name: 'Galón (Reino Unido)', factor: 4.54609 },
        fluid_ounce_us: { name: 'Onza líquida (EE. UU.)', factor: 0.0295735 },
        cup_us: { name: 'Taza (EE. UU.)', factor: 0.236588 },
        pint_us: { name: 'Pinta (EE. UU.)', factor: 0.473176 },
        quart_us: { name: 'Cuarto (EE. UU.)', factor: 0.946353 }
    },
    data: {
        byte: { name: 'Byte (B)', factor: 1 },
        kilobyte: { name: 'Kilobyte (KB)', factor: 1024 },
        megabyte: { name: 'Megabyte (MB)', factor: 1048576 },
        gigabyte: { name: 'Gigabyte (GB)', factor: 1073741824 },
        terabyte: { name: 'Terabyte (TB)', factor: 1099511627776 },
        petabyte: { name: 'Petabyte (PB)', factor: 1125899906842624 },
        bit: { name: 'Bit (b)', factor: 0.125 }
    }
};

// DOM Elements
const categoryTabs = document.getElementById('category-tabs');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const select1 = document.getElementById('unit1');
const select2 = document.getElementById('unit2');
const swapBtn = document.getElementById('swap-btn');

let currentCategory = 'length';
let isConverting = false; // Flag para evitar loops infinitos

// Initialize App
function init() {
    populateSelects(currentCategory);
    // Set default values
    const keys = Object.keys(unitsData[currentCategory]);
    select1.value = keys[0]; // Ej: Metro
    select2.value = keys[1]; // Ej: Kilómetro
    
    // Add event listeners
    categoryTabs.addEventListener('ionChange', handleTabClick);
    input1.addEventListener('ionInput', () => convert('forward'));
    input2.addEventListener('ionInput', () => convert('backward'));
    select1.addEventListener('ionChange', () => convert('forward'));
    select2.addEventListener('ionChange', () => convert('backward'));
    swapBtn.addEventListener('click', handleSwap);
    
    // Initial conversion
    convert('forward');
}

// Populate select options based on category
function populateSelects(category) {
    select1.innerHTML = '';
    select2.innerHTML = '';
    
    const units = unitsData[category];
    for (const key in units) {
        const option1 = document.createElement('ion-select-option');
        option1.value = key;
        option1.textContent = units[key].name;
        select1.appendChild(option1);
        
        const option2 = document.createElement('ion-select-option');
        option2.value = key;
        option2.textContent = units[key].name;
        select2.appendChild(option2);
    }
}

// Handle tab changes
function handleTabClick(e) {
    // Update category
    currentCategory = e.detail.value;
    
    // Repopulate and reset
    populateSelects(currentCategory);
    const keys = Object.keys(unitsData[currentCategory]);
    select1.value = keys[0];
    select2.value = keys[1] || keys[0];
    
    input1.value = 1;
    convert('forward');
}

// Handle swap button
function handleSwap() {
    // Animate button
    swapBtn.classList.toggle('rotate');
    
    // Swap select values
    const tempSelect = select1.value;
    select1.value = select2.value;
    select2.value = tempSelect;
    
    // Recalculate
    convert('forward');
}

// Format numbers to avoid extremely long decimals
function formatResult(value) {
    if (isNaN(value) || !isFinite(value)) return '';
    
    // If it's a very small or very large number, use exponential
    if (value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) > 1000000)) {
        return value.toExponential(4);
    }
    
    // Otherwise limit to 6 decimal places and remove trailing zeros
    return parseFloat(value.toFixed(6)).toString();
}

// Core conversion logic
function convert(direction) {
    if (isConverting) return;
    isConverting = true;
    
    const val1 = parseFloat(input1.value);
    const val2 = parseFloat(input2.value);
    
    const u1 = select1.value;
    const u2 = select2.value;
    
    if (currentCategory === 'temperature') {
        convertTemperature(direction, val1, val2, u1, u2);
    } else {
        convertStandard(direction, val1, val2, u1, u2);
    }
    
    isConverting = false;
}

// Standard conversion (Length, Weight, Volume, Data) using factors relative to a base unit
function convertStandard(direction, val1, val2, u1, u2) {
    const factor1 = unitsData[currentCategory][u1].factor;
    const factor2 = unitsData[currentCategory][u2].factor;
    
    if (direction === 'forward') {
        if (isNaN(val1)) {
            input2.value = '';
        } else {
            // Convert to base unit, then to target unit
            const baseValue = val1 * factor1;
            const result = baseValue / factor2;
            input2.value = formatResult(result);
        }
    } else {
        if (isNaN(val2)) {
            input1.value = '';
        } else {
            const baseValue = val2 * factor2;
            const result = baseValue / factor1;
            input1.value = formatResult(result);
        }
    }
}

// Special case for temperature due to formulas
function convertTemperature(direction, val1, val2, u1, u2) {
    if (direction === 'forward') {
        if (isNaN(val1)) {
            input2.value = '';
            return;
        }
        let celsiusValue;
        
        // Convert to Celsius first
        if (u1 === 'celsius') celsiusValue = val1;
        else if (u1 === 'fahrenheit') celsiusValue = (val1 - 32) * 5/9;
        else if (u1 === 'kelvin') celsiusValue = val1 - 273.15;
        
        // Convert from Celsius to Target
        let result;
        if (u2 === 'celsius') result = celsiusValue;
        else if (u2 === 'fahrenheit') result = (celsiusValue * 9/5) + 32;
        else if (u2 === 'kelvin') result = celsiusValue + 273.15;
        
        input2.value = formatResult(result);
    } else {
        if (isNaN(val2)) {
            input1.value = '';
            return;
        }
        let celsiusValue;
        
        if (u2 === 'celsius') celsiusValue = val2;
        else if (u2 === 'fahrenheit') celsiusValue = (val2 - 32) * 5/9;
        else if (u2 === 'kelvin') celsiusValue = val2 - 273.15;
        
        let result;
        if (u1 === 'celsius') result = celsiusValue;
        else if (u1 === 'fahrenheit') result = (celsiusValue * 9/5) + 32;
        else if (u1 === 'kelvin') result = celsiusValue + 273.15;
        
        input1.value = formatResult(result);
    }
}

// Start
init();