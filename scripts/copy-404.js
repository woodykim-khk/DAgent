import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');
const indexHtml = path.join(distPath, 'index.html');
const notFoundHtml = path.join(distPath, '404.html');

// index.html 내용 읽기
let indexContent = fs.readFileSync(indexHtml, 'utf-8');

// 404.html에 SPA 리다이렉트 스크립트 추가
const redirectScript = `
<script>
  // Single Page Apps for GitHub Pages
  // 모든 경로를 index.html로 리다이렉트하여 React Router가 처리하도록 함
  (function() {
    var path = window.location.pathname;
    var basePath = '/DAgent';
    
    // 이미 basePath로 시작하는 경우 React Router가 처리하도록 함
    if (path.startsWith(basePath)) {
      // React Router가 처리
      return;
    }
    
    // basePath가 아닌 경우 리다이렉트
    if (path === '/' || path === '') {
      window.location.replace(basePath + '/');
    } else {
      window.location.replace(basePath + path);
    }
  })();
</script>
`;

// </head> 태그 앞에 스크립트 추가
indexContent = indexContent.replace('</head>', redirectScript + '</head>');

// 404.html로 저장
fs.writeFileSync(notFoundHtml, indexContent);
console.log('✓ Created 404.html with SPA redirect script');

