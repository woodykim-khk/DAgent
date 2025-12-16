import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');
const indexHtml = path.join(distPath, 'index.html');
const notFoundHtml = path.join(distPath, '404.html');

// index.html을 404.html로 복사
fs.copyFileSync(indexHtml, notFoundHtml);
console.log('✓ Copied index.html to 404.html');

