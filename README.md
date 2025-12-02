# TODAK Frontend

병원 헬스케어 자동화 서비스 TODAK 의 모바일 애플리케이션(Android/iOS)입니다.
STT 기반 진료 자동화, 건강 데이터 시각화, 병원 예약 등 모바일 환경에 특화된 기능을 제공합니다.

---
## 👤 Frontend Team
동국대학교 컴퓨터공학전공 23학번 서예원

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
\``
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
'
 
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

## Getting Started

### 1. Install Dependencies
npm install
또는
yarn install

### 2. iOS Setup (Mac 전용)
cd ios
pod install
cd ..

### 3. Run Application
**1) Metro 서버 실행**
npm start

**2) Android 실행**
npm run android

**3) iOS 실행**
npm run ios

---

