const fs = require('fs');

let css = fs.readFileSync('Calculadora de Descuentos/style.css', 'utf-8');

// The duplicate block starts at `.result-row {` after `}\n\n.result-row {`
// Let's just fix it by string manipulation or regex.
// Actually, I can just replace the whole duplicated section from `.result-row {` until `/* Desktop 2-Column Layout */` with nothing.

const duplicatePattern = /}\s*\.result-row\s*\{[\s\S]*?\/\* Desktop 2-Column Layout \*\//;
css = css.replace(duplicatePattern, '}\n\n/* Desktop 2-Column Layout */');

fs.writeFileSync('Calculadora de Descuentos/style.css', css);
