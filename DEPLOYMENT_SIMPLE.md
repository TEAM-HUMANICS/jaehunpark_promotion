# Vercel CLI로 직접 배포하기 (GitHub 없이)

## 사전 준비사항

1. **Vercel 계정** (https://vercel.com)
2. **Node.js 설치 확인** (이미 설치되어 있음)

---

## 1단계: Vercel CLI 설치

터미널에서 다음 명령어 실행:

```bash
npm install -g vercel
```

또는 프로젝트 폴더에서:

```bash
cd c:\Users\user\Desktop\cursor\jaehunpark_promotion
npm install -g vercel
```

---

## 2단계: Vercel 로그인

터미널에서 다음 명령어 실행:

```bash
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인하세요.

---

## 3단계: 프로젝트 배포

프로젝트 폴더에서 다음 명령어 실행:

```bash
cd c:\Users\user\Desktop\cursor\jaehunpark_promotion
vercel
```

### 배포 과정에서 질문:

1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → 본인의 계정 선택
3. **Link to existing project?** → `N` (No) - 새 프로젝트 생성
4. **What's your project's name?** → `jaehunpark-promotion` (또는 원하는 이름)
5. **In which directory is your code located?** → `./` (현재 디렉토리)
6. **Want to override the settings?** → `N` (No) - 기본 설정 사용

### 배포 완료!

배포가 완료되면 Vercel이 URL을 제공합니다:
- 예: `https://jaehunpark-promotion.vercel.app`

---

## 4단계: 환경 변수 설정

### 방법 1: Vercel 대시보드에서 설정 (권장)

1. https://vercel.com 접속 → 프로젝트 선택
2. "Settings" → "Environment Variables" 클릭
3. 다음 변수들 추가:

```
SMTP_HOST=smtp.naver.com
SMTP_PORT=465
SMTP_USER=humanics23@naver.com
SMTP_PASS=QMWFGQZUXGR2
RECIPIENT_EMAIL=admin@example.com
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

**주의:** 각 변수마다 "Production", "Preview", "Development" 모두 체크

### 방법 2: CLI로 설정

```bash
vercel env add SMTP_HOST
# 입력: smtp.naver.com
# 환경: Production, Preview, Development 모두 선택

vercel env add SMTP_PORT
# 입력: 465

vercel env add SMTP_USER
# 입력: humanics23@naver.com

vercel env add SMTP_PASS
# 입력: QMWFGQZUXGR2

vercel env add RECIPIENT_EMAIL
# 입력: admin@example.com

vercel env add NEXT_PUBLIC_BASE_URL
# 입력: https://your-domain.vercel.app
```

### 환경 변수 설정 후 재배포

```bash
vercel --prod
```

---

## 5단계: 프로덕션 배포

처음 `vercel` 명령어는 Preview 환경에 배포됩니다.
프로덕션에 배포하려면:

```bash
vercel --prod
```

---

## 6단계: GoDaddy 도메인 연결 (나중에)

### 6.1 Vercel 대시보드에서 도메인 추가

1. Vercel 프로젝트 → "Settings" → "Domains"
2. "Add Domain" 클릭
3. GoDaddy에서 구매한 도메인 입력
4. "Add" 클릭

### 6.2 GoDaddy DNS 설정

1. GoDaddy.com 접속 → "My Products" → "DNS"
2. Vercel이 제공한 DNS 레코드 추가:
   - Type: `CNAME`
   - Name: `@`
   - Value: `cname.vercel-dns.com.` (Vercel이 제공하는 값)

### 6.3 환경 변수 업데이트

도메인 연결 후 `NEXT_PUBLIC_BASE_URL`을 실제 도메인으로 변경:

```bash
vercel env rm NEXT_PUBLIC_BASE_URL
vercel env add NEXT_PUBLIC_BASE_URL
# 입력: https://yourdomain.com
```

재배포:

```bash
vercel --prod
```

---

## 업데이트 배포

코드를 수정한 후 다시 배포하려면:

```bash
vercel --prod
```

---

## 주요 Vercel CLI 명령어

```bash
# 로그인
vercel login

# 배포 (Preview)
vercel

# 프로덕션 배포
vercel --prod

# 환경 변수 추가
vercel env add VARIABLE_NAME

# 환경 변수 확인
vercel env ls

# 환경 변수 삭제
vercel env rm VARIABLE_NAME

# 프로젝트 목록 확인
vercel ls

# 배포 로그 확인
vercel logs
```

---

## 주의사항

### 데이터 저장소 문제

현재 프로젝트는 로컬 파일 시스템(`/data` 폴더)을 사용합니다.
Vercel은 서버리스 환경이므로 **파일 시스템에 영구 저장이 불가능**합니다.

**해결 방법:**
1. **Vercel KV** (Redis 기반) 사용
2. **Vercel Postgres** 사용
3. **외부 데이터베이스** (MongoDB, Supabase 등) 사용

배포 후 데이터가 저장되지 않을 수 있으니, 프로덕션 환경에서는 데이터베이스를 사용하는 것을 권장합니다.

---

## 문제 해결

### 배포 실패 시

```bash
# 빌드 로그 확인
vercel logs

# 로컬에서 빌드 테스트
npm run build
```

### 환경 변수 확인

```bash
vercel env ls
```

---

## 추가 리소스

- Vercel CLI 문서: https://vercel.com/docs/cli
- Vercel 배포 가이드: https://vercel.com/docs/deployments/overview
