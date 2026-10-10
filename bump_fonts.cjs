const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function bumpFontsInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Bump arbitrary pixel values by 2
    content = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
        return `text-[${parseInt(p1) + 2}px]`;
    });
    
    // Map of tailwind sizes to bump up one level
    const sizeMap = {
        'text-xs': 'text-sm',
        'text-sm': 'text-base',
        'text-base': 'text-lg',
        'text-lg': 'text-xl',
        'text-xl': 'text-2xl',
        'text-2xl': 'text-3xl',
        'text-3xl': 'text-4xl',
        'text-4xl': 'text-5xl',
        'text-5xl': 'text-6xl',
        'text-6xl': 'text-7xl'
    };
    
    // Replace standard sizes using a replacer function to avoid double-bumping
    // Need word boundaries to match exact classes
    content = content.replace(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g, (match) => {
        return sizeMap[match] || match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            bumpFontsInFile(fullPath);
        }
    });
}

walkDir(srcDir);
console.log('Fonts bumped successfully.');
