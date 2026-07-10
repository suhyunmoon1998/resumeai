# 🚀 VoiceResume 배포 가이드 (약 15분)

순서대로 따라 하면 됩니다. **비밀 키는 절대 채팅/깃허브에 붙여넣지 마세요.**

---

## 1단계. Supabase (~5분)

1. [supabase.com](https://supabase.com) → 가입 → **New Project** (이름: `voiceresume`, 리전: Northeast Asia 추천)
2. 왼쪽 메뉴 **SQL Editor** → **New query** → 이 저장소의 [`supabase/setup.sql`](./supabase/setup.sql) 내용 **전체 복사 → 붙여넣기 → Run**
   - ✅ 테이블 + 보안정책 + 실시간 알림 + **스토리지 버킷까지 전부** 한 번에 생성됩니다
3. **Settings → API** 에서 3개 복사해 메모:
   - `Project URL`
   - `anon public` 키
   - `service_role` 키 (🔒 비밀)

## 2단계. Google 로그인 (~5분)

1. [console.cloud.google.com](https://console.cloud.google.com) → 프로젝트 생성
2. **APIs & Services → OAuth consent screen** → External → 앱 이름 입력 → 저장
3. **Credentials → Create Credentials → OAuth client ID** → *Web application*
   - **Authorized redirect URIs** 에 추가:
     `https://<내-프로젝트-ID>.supabase.co/auth/v1/callback`
     (`<내-프로젝트-ID>`는 1단계 Project URL에서 확인)
4. 발급된 **Client ID / Client Secret** 을
   Supabase → **Authentication → Providers → Google** 에 붙여넣고 **Enable**

## 3단계. Anthropic API 키 (~2분)

[console.anthropic.com](https://console.anthropic.com) → 결제수단 등록(최소 $5) → **API Keys → Create Key**

## 4단계. Vercel 배포 (~3분)

아래 버튼 클릭 (README에도 있음):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuhyunmoon1998%2Fresumeai&project-name=voiceresume&repository-name=voiceresume&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,ANTHROPIC_API_KEY,NEXT_PUBLIC_APP_URL&envDescription=Supabase%20URL%2Fkeys%2C%20Anthropic%20API%20key%2C%20and%20your%20deployed%20URL)

버튼이 환경변수 5개를 순서대로 물어봅니다:

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 1단계 Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 1단계 anon 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 1단계 service_role 키 |
| `ANTHROPIC_API_KEY` | 3단계 키 |
| `NEXT_PUBLIC_APP_URL` | 일단 `https://voiceresume.vercel.app` 입력 (배포 후 실제 주소로 수정) |

**Deploy** 클릭 → 2~3분 후 `https://voiceresume-xxx.vercel.app` 발급 🎉

## 5단계. 마지막 연결 (⚠️ 잊으면 로그인이 안 됩니다)

배포된 주소를 Supabase에 알려주기:

1. Supabase → **Authentication → URL Configuration**
   - **Site URL**: `https://voiceresume-xxx.vercel.app`
   - **Redirect URLs**에 추가: `https://voiceresume-xxx.vercel.app/auth/callback`
2. Vercel → Settings → Environment Variables → `NEXT_PUBLIC_APP_URL`을 실제 주소로 수정 → **Redeploy**

## ✅ 배포 후 스모크 테스트

- [ ] 구글 로그인 → 대시보드 진입
- [ ] 학교 선택 (예: 연세대)
- [ ] 인터뷰: 역할 선택 → 질문 2~3개 답하고 나머지 Skip → 이력서 생성 확인
- [ ] DOCX 다운로드
- [ ] 명함 만들기: 사진 업로드 + 스티커 → QR 화면에서 카드 뒤집기
- [ ] 폰 카메라로 QR 스캔 → "Delivered! 💌" 확인 → 연락처 저장(.vcf)
- [ ] 폰 브라우저 메뉴 → "홈 화면에 추가" → 앱 아이콘 확인

## 문제 해결

| 증상 | 원인/해결 |
|------|-----------|
| 로그인 후 localhost로 튕김 | 5단계 Site URL/Redirect URLs 미설정 |
| 로그인 자체가 실패 | 2단계 redirect URI 오타 (`/auth/v1/callback` 확인) |
| 이력서 생성 실패 | `ANTHROPIC_API_KEY` 오타 또는 크레딧 부족 |
| 학교 검색이 비어있음 | 1단계 setup.sql 실행 안 됨 |
