# VoiceResume - Vercel 배포 가이드

## 배포 준비 사항

### 1. Vercel 계정 생성
- [vercel.com](https://vercel.com)에서 계정 생성
- GitHub 계정으로 로그인 권장

### 2. 필수 환경 변수

Vercel 프로젝트 설정에서 다음 환경 변수를 추가하세요:

#### Supabase 설정
```
NEXT_PUBLIC_SUPABASE_URL=https://hvdugbjgcawfsvmqtlvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### 앱 URL
```
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
```

### 3. Supabase에서 필수 정보 얻기

**Supabase 대시보드에서:**

1. Project Settings → API 탭
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL` 복사
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` 복사
   
2. Project Settings → Database
   - `Service Role Key` 복사 → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Google OAuth 설정 (선택사항)

이미 설정했다면 Supabase에서 자동으로 처리됩니다.

Google Cloud Console에서 redirect URI 추가:
```
https://yourdomain.vercel.app/auth/callback
```

## 배포 단계

### 옵션 A: Vercel 웹 대시보드 사용 (권장)

1. [vercel.com/dashboard](https://vercel.com/dashboard) 접속
2. "Add New" → "Project" 선택
3. GitHub 저장소 선택 (`suhyunmoon1998/resumeai`)
4. Framework: "Next.js" (자동 감지됨)
5. "Environment Variables" 섹션에서 위의 환경 변수 추가
6. "Deploy" 클릭

### 옵션 B: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 배포 후 확인사항

- [ ] 앱 URL 접속 가능한지 확인
- [ ] 로그인 페이지 정상 로드
- [ ] Google OAuth 로그인 정상 작동
- [ ] 대시보드 접속 가능
- [ ] 카드/QR 코드 기능 정상 작동
- [ ] 모바일 반응형 확인

## 트러블슈팅

### 에러: "NEXT_PUBLIC_SUPABASE_URL is required"
- Vercel 환경 변수 설정 확인
- 재배포: `vercel --prod`

### 에러: "Google OAuth 리다이렉트 실패"
- Google Cloud Console의 redirect URI 확인
- 형식: `https://yourdomain.vercel.app/auth/callback`
- Supabase 인증 설정 확인

### 느린 로딩
- Vercel 빌드 로그 확인: `vercel logs <url>`
- 이미지 최적화 확인
- API 응답 속도 확인

## 커스텀 도메인 연결

1. Vercel 프로젝트 → Settings → Domains
2. 도메인 추가
3. DNS 레코드 설정 (CNAME/A record)
4. 도메인 검증 완료 후 HTTPS 자동 적용

## 환경 변수 업데이트

배포 후 환경 변수를 변경해야 할 경우:
1. Vercel 대시보드에서 환경 변수 수정
2. 자동 재배포 또는 "Redeploy" 버튼 클릭

---

**더 자세한 정보**: [Vercel 문서](https://vercel.com/docs)
