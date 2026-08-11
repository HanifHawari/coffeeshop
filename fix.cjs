const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add flex col to menu cards
html = html.split('class="menu-card ').join('class="menu-card flex flex-col ');

// Add flex to the p-6 container inside menu cards.
// We must be careful not to replace p-6 everywhere, but actually there are 3 other p-6 elements
// Admin login and Cart footer. Replacing them with flex flex-col flex-1 is harmless or we can be specific.
html = html.replace(/<div class="p-6">/g, '<div class="p-6 flex flex-col flex-1">');

fs.writeFileSync('index.html', html);
console.log('Done');
