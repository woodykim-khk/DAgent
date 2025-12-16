# GitHub에 프로젝트 업로드 가이드

## 1단계: Git 사용자 정보 설정

터미널에서 다음 명령어를 실행하세요 (GitHub 계정 정보로 변경):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

또는 이 저장소에만 적용하려면 `--global` 옵션을 제거하세요:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 2단계: 초기 커밋 생성

```bash
git add .
git commit -m "Initial commit: AI Agent Studio Prototype"
```

## 3단계: GitHub에서 새 저장소 생성

1. GitHub 웹사이트(https://github.com)에 로그인
2. 우측 상단의 **+** 버튼 클릭 → **New repository** 선택
3. 저장소 설정:
   - **Repository name**: 원하는 이름 입력 (예: `ai-agent-studio-prototype`)
   - **Description**: "AI 에이전트 스튜디오 프로토타입"
   - **Visibility**: **Public** 선택
   - **Initialize this repository with**: 체크하지 않기 (이미 로컬에 파일이 있으므로)
4. **Create repository** 버튼 클릭

## 4단계: 로컬 저장소를 GitHub에 연결

GitHub에서 생성한 저장소의 URL을 복사한 후, 다음 명령어를 실행하세요:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

예시:
```bash
git remote add origin https://github.com/username/ai-agent-studio-prototype.git
```

## 5단계: 코드 업로드

```bash
git branch -M main
git push -u origin main
```

## 완료!

이제 GitHub에서 프로젝트를 확인할 수 있습니다.

## 추가 팁

### .gitignore 확인
프로젝트에는 이미 `.gitignore` 파일이 포함되어 있어 다음 항목들이 자동으로 제외됩니다:
- `node_modules/`
- `dist/`
- 로그 파일
- 에디터 설정 파일

### README 업데이트
필요에 따라 `README.md`를 수정하여 프로젝트 설명을 더 자세히 작성할 수 있습니다.

### 라이선스 추가 (선택사항)
퍼블릭 저장소에 라이선스 파일을 추가하는 것을 권장합니다:
- `LICENSE` 파일 생성
- MIT, Apache 2.0, GPL 등 원하는 라이선스 선택

