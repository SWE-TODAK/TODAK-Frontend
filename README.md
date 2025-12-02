# TODAK Frontend
병원 헬스케어 자동화 서비스 TODAK 의 모바일 애플리케이션(Android/iOS)입니다.
STT 기반 진료 자동화, 건강 데이터 시각화, 병원 예약 등 모바일 환경에 특화된 기능을 제공합니다.

--- 
## 프론트엔드 개발 팀원 
- 동국대학교 컴퓨터공학전공 23학번 서예원
---
## Features
### 1. 로그인 & 인증
   - 카카오 OAuth 기반 간편 로그인
   - 딥링크 기반 인가 코드 처리 (todak://kakao-login)
   - Access/Refresh Token 기반 자동 로그인

### 2. 진료 녹음 & 업로드
   - iOS/Android 마이크 권한 요청
   - WAV 포맷(16bit, 44.1kHz)으로 고품질 녹음
   - 녹음 파일 백엔드 업로드 → STT → 요약 자동 파이프라인 연동

### 3. 병원 예약 & 일정 관리
   - 병원/의사 리스트 조회
   - 예약 가능한 시간대 선택 UI
   - Monthly Calendar 기반 일정 확인
   - 바텀시트로 예약 상세 내역 제공

### 4. 건강 지표 모니터링
   - 혈압/혈당/간수치 등 건강 데이터 조회
   - SVG 기반 그래프 시각화 (Victory Native)
   - AI 분석 코멘트 제공

## Tech Stack
- **Language:** TypeScript
- **Framework:** React Native (CLI)
- **State Management:** React Hooks, Context API
- **Network:** Axios
- **Chart:** Victory Native
---

## Architecture

나중에 할거면..?

---

##  Project Structure
```bash
src
 ├─ api               # Axios 인스턴스 및 API 함수
 ├─ assets            # 아이콘, 로고 등 정적 이미지
 ├─ components        # 재사용 가능한 UI 요소
 │   ├─ Calendar      # 캘린더 컴포넌트
 │   ├─ Health        # 건강 지표 그래프/뷰
 │   ├─ Home          # 메인 화면
 │   ├─ Login         # 로그인 슬라이드 / 온보딩
 │   ├─ Mycare        # 진료 기록 / 카테고리 탭
 │   └─ Setting       # 설정 화면
 ├─ navigation        # 네비게이션(Stack/Bottom Tab)
 ├─ screens           # 주요 페이지(Login/Main/Health/Mycare 등)
 └─ utils             # 카카오 로그인, AsyncStorage 관련 유틸
```
 
---
## Core Logic Flows

### Authentication Flow
1. 로그인 버튼 → 카카오 OAuth 인가 요청
2. 인증 완료 후 딥링크(todak://kakao-login)로 인가 코드 수신
3. 인가 코드 기반 Access/Refresh Token 발급
4. 토큰 저장 후 자동 로그인 처리

### Recording & Upload Flow
1. 마이크 권한 요청
2. 녹음 시작/종료 제어 (버튼 애니메이션 포함)
3. 로컬 임시 저장 후 S3 업로드
4. 백엔드에서 STT → 요약까지 자동 진행

### Reservation Flow
1. 병원 → 의사 → 시간대 선택
2. 예약 요청
3. 월별 캘린더에서 예약 내역 확인
4. 날짜 클릭 시 상세 바텀시트 출력

### Health Flow
1. 서버에서 건강 데이터 조회
2. Victory Native 그래프로 시각화
3. 정상 범위 표시 + AI 코멘트 출력


---
## Getting Started — Android

프로젝트 실행 전 React Native 환경 설정(Node.js, JDK, Android Studio)이 완료해야함

### 1. 패키지 설치 (Install Dependencies)

프로젝트 루트에서 의존성 패키지를 설치

**npm 사용 시**
npm install
또는 **yarn 사용 시**
yarn install

### 2. Metro 서버 실행 (Start Metro)

React Native 번들러(번들러 서버)를 실행

npm start
또는
yarn start

### 3. 안드로이드 앱 실행 (Run Android)

새 터미널에서 아래 명령을 실행
(Android Emulator가 켜져 있거나 USB로 연결된 실제 기기가 필요)

npm run android
또는
yarn android

---

## Android 개발 환경 설정 (Android Setup)

이 프로젝트는 다음 환경에서 개발됨
- Android SDK 36 (Android 15)
- JDK 17 (Zulu OpenJDK 권장)

---

필수 설정 가이드

### 1. JDK 17 설치 및 버전 확인

JDK 17 설치 후 아래 명령으로 버전을 확인: java -version

### 2. Android Studio 설정
- Android Studio 설치
설치 후 SDK Manager로 이동: Android Studio → More Actions → SDK Manager

**SDK Platforms 탭**

아래 항목이 체크되어 있어야 함: Android 15.0 (VanillaIceCream) – API Level 36

**SDK Tools 탭**

아래 도구들이 설치되어 있어야 함:
- Android SDK Build-Tools (36.0.0)
- Android SDK Platform-Tools
- Android Emulator
- Android SDK Tools (Obsolete) — 필요 시 Show Package Details에서 확인
모두 선택 후 Apply 클릭

### 3. 환경 변수 설정 (Environment Variables)
**macOS / Linux**
~/.zshrc 또는 ~/.bash_profile에 다음을 추가:
- export ANDROID_HOME=$HOME/Library/Android/sdk
- export PATH=$PATH:$ANDROID_HOME/emulator
- export PATH=$PATH:$ANDROID_HOME/platform-tools

등록 후: source ~/.zshrc

**Windows**
환경 변수 설정 방법:
1. 제어판 → 시스템 및 보안 → 시스템
2. 고급 시스템 설정 → 환경 변수
3. 시스템 변수 추가
- 이름: ANDROID_HOME
- 값: C:\Users\사용자명\AppData\Local\Android\Sdk
4. Path에 추가: %ANDROID_HOME%\platform-tools

### 4️. 에뮬레이터 또는 기기 연결
**Android Emulator 실행**
Android Studio → Device Manager → Create Device
→ API Level 36 이미지 선택 → 실행

**실기기 연결**
1. USB 연결
2. 휴대폰 → 개발자 옵션 → USB 디버깅 활성화

