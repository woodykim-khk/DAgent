# 웹사이트 배포 가이드

이 프로젝트를 웹에서 확인할 수 있도록 배포하는 방법입니다.

## 방법 1: Vercel (가장 쉬움, 추천) ⭐

### 장점
- 완전 무료
- GitHub와 자동 연동
- 자동 배포 (코드 푸시 시 자동 업데이트)
- 설정이 매우 간단

### 배포 방법

1. **Vercel 가입**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 가져오기**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 `woodykim-khk/DAgent` 선택
   - "Import" 클릭

3. **설정 (자동으로 감지됨)**
   - Framework Preset: **Vite** (자동 선택됨)
   - Build Command: `npm run build` (자동)
   - Output Directory: `dist` (자동)
   - Install Command: `npm install` (자동)

4. **Deploy 클릭**
   - 몇 분 후 배포 완료
   - 자동으로 URL 생성 (예: `https://d-agent.vercel.app`)

### 완료!
이제 생성된 URL로 접속하면 웹사이트를 확인할 수 있습니다.

---

## 방법 2: GitHub Pages

### 1단계: Vite 설정 수정

`vite.config.ts` 파일을 수정하여 base 경로를 설정합니다:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react],
  base: '/DAgent/',  // 저장소 이름과 동일하게
})
```

### 2단계: GitHub Actions 설정

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 3단계: GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. Settings → Pages
3. Source: **GitHub Actions** 선택
4. 저장

### 4단계: 배포 확인

- Actions 탭에서 배포 진행 상황 확인
- 완료 후 `https://woodykim-khk.github.io/DAgent/` 접속

---

## 방법 3: Netlify

1. https://netlify.com 접속
2. GitHub 계정으로 로그인
3. "Add new site" → "Import an existing project"
4. GitHub 저장소 선택
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. "Deploy site" 클릭

---

## 추천 순서

1. **Vercel** (가장 빠르고 쉬움) ⭐⭐⭐
2. Netlify (Vercel과 유사)
3. GitHub Pages (설정이 조금 복잡)

