const fs = require('fs');
const path = require('path');

const dictionariesPath = '/Users/lahyabderrahmane/Desktop/Web-Projects/Clients/pansite/apps/web/src/lib/dictionaries.ts';
let dictContent = fs.readFileSync(dictionariesPath, 'utf8');

// Find the index of "export const dictionaries = {" or similar, or just "en: {"
const enStartIndex = dictContent.indexOf('en: {');
const esStartIndex = dictContent.indexOf('es: {', enStartIndex);

if (enStartIndex !== -1 && esStartIndex !== -1) {
    let enBlock = dictContent.substring(enStartIndex, esStartIndex);
    enBlock = enBlock.replace(/Port Autonome de Nouadhibou \(PAN\)/g, 'Autonomous Port of Nouadhibou');
    dictContent = dictContent.substring(0, enStartIndex) + enBlock + dictContent.substring(esStartIndex);
    fs.writeFileSync(dictionariesPath, dictContent, 'utf8');
    console.log('Updated dictionaries.ts');
}

// Now update all page.tsx metadata
const rootDir = '/Users/lahyabderrahmane/Desktop/Web-Projects/Clients/pansite/apps/web/src/app/[locale]';
function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(filepath, 'utf8');
            // We want to replace it only on lines that start with `en:`
            const lines = content.split('\n');
            let modified = false;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/^\s*en:\s*['"`]/)) {
                    if (lines[i].includes('Port Autonome de Nouadhibou (PAN)')) {
                        lines[i] = lines[i].replace(/Port Autonome de Nouadhibou \(PAN\)/g, 'Autonomous Port of Nouadhibou');
                        modified = true;
                    }
                }
            }
            if (modified) {
                fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
                console.log(`Updated ${filepath}`);
            }
        }
    }
}
walk(rootDir);
