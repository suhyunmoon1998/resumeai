# VoiceResume - Neon + NextAuth.js 설정 가이드

## 1️⃣ Neon PostgreSQL 설정

### 1. Neon 계정 생성
- [neon.tech](https://neon.tech) 접속
- "Sign up" 클릭
- GitHub 또는 이메일로 가입

### 2. 새 프로젝트 생성
1. "New Project" 클릭
2. 프로젝트명: `voiceresume`
3. Database: `voiceresume`
4. Region: 원하는 지역 선택 (Asia 권장)
5. "Create project" 클릭

### 3. 연결 문자열 복사
1. 프로젝트 대시보드에서 "Connection string" 찾기
2. "Pooled connection" 선택
3. 전체 문자열 복사

**예시:**
```
postgresql://user:password@ep-xxx.neon.tech/voiceresume?sslmode=require
```

## 2️⃣ 환경 변수 설정

### .env.local 파일 수정
```bash
# .env.local 파일 생성 또는 수정
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/voiceresume?sslmode=require

# NextAuth 설정
NEXTAUTH_SECRET=<32자 이상의 랜덤 문자열>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (이전 설정 유지)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### NEXTAUTH_SECRET 생성
```bash
# 터미널에서 실행
openssl rand -base64 32
```

## 3️⃣ 데이터베이스 마이그레이션

### Prisma 마이그레이션 실행
```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# 또는 기존 스키마 적용
npx prisma db push
```

### 데이터베이스 초기화 확인
```bash
# Prisma Studio로 확인
npx prisma studio
```

## 4️⃣ 로컬 테스트

### 개발 서버 시작
```bash
npm run dev
```

### 테스트 흐름
1. `http://localhost:3000` 접속
2. "Continue with Google" 클릭
3. Google 계정으로 로그인
4. 대시보드 접속 확인
5. 카드 생성/편집 가능 확인

## 5️⃣ Vercel 배포

### 환경 변수 설정
Vercel 프로젝트 Settings → Environment Variables에서:

1. `DATABASE_URL`: Neon 연결 문자열
2. `NEXTAUTH_SECRET`: 생성한 비밀키
3. `NEXTAUTH_URL`: `https://yourdomain.vercel.app`
4. `GOOGLE_CLIENT_ID`: Google OAuth ID
5. `GOOGLE_CLIENT_SECRET`: Google OAuth Secret
6. `NEXT_PUBLIC_APP_URL`: `https://yourdomain.vercel.app`

### 배포
```bash
git push origin claude/app-development-q10ku5
```
Vercel에서 자동으로 배포됩니다.

## 6️⃣ 트러블슈팅

### 에러: "DATABASE_URL is not set"
- `.env.local` 파일 확인
- Neon 연결 문자열 정확한지 확인
- 개발 서버 재시작

### 에러: "Google OAuth 리다이렉트 실패"
- Google Cloud Console에서 redirect URI 확인
- 형식: `http://localhost:3000/api/auth/callback/google`
- 또는 프로덕션: `https://yourdomain.vercel.app/api/auth/callback/google`

### 데이터베이스 초기화
```bash
# 모든 테이블 삭제 (⚠️ 데이터 손실!)
npx prisma migrate reset
```

## 📚 참고 링크

- [Neon 문서](https://neon.tech/docs)
- [NextAuth.js 문서](https://next-auth.js.org)
- [Prisma 문서](https://www.prisma.io/docs)
- [Google OAuth 설정](https://next-auth.js.org/providers/google)

---

**마이그레이션 완료!** 🎉
