# Vercel 배포 가이드

## 사전 준비사항

1. **GitHub 계정** (또는 GitLab, Bitbucket)
2. **Vercel 계정** (https://vercel.com)
3. **GoDaddy 도메인** (이미 구매했다고 가정)

---

## 1단계: GitHub에 코드 업로드

### 1.1 Git 저장소 초기화 (아직 안 했다면)

```bash
cd c:\Users\user\Desktop\cursor\jaehunpark_promotion
git init
git add .
git commit -m "Initial commit"
```

### 1.2 GitHub에 새 저장소 생성

1. GitHub.com 접속
2. 우측 상단 "+" 클릭 → "New repository"
3. 저장소 이름 입력 (예: `jaehunpark-promotion`)
4. "Create repository" 클릭

### 1.3 로컬 코드를 GitHub에 푸시

```bash
git remote add origin https://github.com/your-username/jaehunpark-promotion.git
git branch -M main
git push -u origin main
```

---

## 2단계: Vercel에 프로젝트 배포

### 2.1 Vercel 계정 생성 및 로그인

1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)

### 2.2 새 프로젝트 생성

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 선택 (`jaehunpark-promotion`)
3. "Import" 클릭

### 2.3 프로젝트 설정

- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 2.4 환경 변수 설정 (중요!)

"Environment Variables" 섹션에서 다음 변수들을 추가:

```
SMTP_HOST=smtp.naver.com
SMTP_PORT=465
SMTP_USER=humanics23@naver.com
SMTP_PASS=QMWFGQZUXGR2
RECIPIENT_EMAIL=admin@example.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**주의사항:**
- `NEXT_PUBLIC_BASE_URL`은 GoDaddy 도메인 연결 후 실제 도메인으로 변경 필요
- 모든 환경 변수는 "Production", "Preview", "Development" 모두에 추가

### 2.5 배포 시작

1. "Deploy" 버튼 클릭
2. 배포 완료까지 대기 (약 2-3분)
3. 배포 완료 후 Vercel이 제공하는 URL 확인 (예: `jaehunpark-promotion.vercel.app`)

---

## 3단계: GoDaddy 도메인 연결

### 3.1 Vercel에서 도메인 추가

1. Vercel 프로젝트 대시보드에서 "Settings" → "Domains" 클릭
2. "Add Domain" 클릭
3. GoDaddy에서 구매한 도메인 입력 (예: `yourdomain.com`)
4. "Add" 클릭

### 3.2 DNS 설정 확인

Vercel이 DNS 설정 방법을 안내합니다. 보통 다음과 같습니다:

**방법 1: CNAME 레코드 추가 (권장)**
- Type: `CNAME`
- Name: `@` 또는 `www`
- Value: `cname.vercel-dns.com.` (Vercel이 제공하는 값)

**방법 2: A 레코드 추가**
- Type: `A`
- Name: `@`
- Value: Vercel이 제공하는 IP 주소

### 3.3 GoDaddy에서 DNS 설정

1. GoDaddy.com 접속 → "My Products" → "DNS" 클릭
2. "Records" 섹션에서 DNS 레코드 추가/수정
3. Vercel에서 안내한 대로 설정

**예시:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com.
TTL: 600
```

또는

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP - 실제 값은 Vercel에서 확인)
TTL: 600
```

### 3.4 DNS 전파 대기

- DNS 변경사항이 전파되는데 보통 24-48시간 소요
- 빠르면 몇 분 내에 적용될 수도 있음
- https://dnschecker.org 에서 전세계 DNS 전파 상태 확인 가능

### 3.5 SSL 인증서 자동 발급

- Vercel이 자동으로 SSL 인증서를 발급합니다
- 도메인 연결 후 몇 분 내에 HTTPS가 활성화됩니다

---

## 4단계: 환경 변수 업데이트

도메인 연결이 완료되면:

1. Vercel 프로젝트 → "Settings" → "Environment Variables"
2. `NEXT_PUBLIC_BASE_URL` 값을 실제 도메인으로 변경:
   ```
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
3. "Redeploy" 클릭하여 재배포

---

## 5단계: 배포 확인

### 5.1 웹사이트 접속 확인

- 도메인으로 접속: `https://yourdomain.com`
- Vercel 제공 URL로도 접속 가능: `https://jaehunpark-promotion.vercel.app`

### 5.2 기능 테스트

1. 메인 페이지 접속 확인
2. 프로모션 신청 폼 제출 테스트
3. 어드민 페이지 접속 테스트 (`/admin`)
4. 이메일 알림 발송 테스트

---

## 주의사항

### 데이터 저장소

현재 프로젝트는 로컬 파일 시스템(`/data` 폴더)을 사용합니다.
Vercel은 서버리스 환경이므로 **파일 시스템에 영구 저장이 불가능**합니다.

**해결 방법:**
1. **Vercel KV** (Redis 기반) 사용
2. **Vercel Postgres** 사용
3. **외부 데이터베이스** (MongoDB, Supabase 등) 사용

배포 후 데이터가 저장되지 않을 수 있으니, 프로덕션 환경에서는 데이터베이스를 사용하는 것을 권장합니다.

### 환경 변수 보안

- `.env.local` 파일은 Git에 커밋하지 않음 (이미 `.gitignore`에 포함됨)
- 모든 민감한 정보는 Vercel 환경 변수로만 관리
- GitHub 저장소에는 실제 비밀번호가 노출되지 않도록 주의

---

## 문제 해결

### 배포 실패 시

1. Vercel 로그 확인: 프로젝트 → "Deployments" → 실패한 배포 클릭 → "Logs" 확인
2. 빌드 에러 확인: `npm run build` 로컬에서 실행하여 에러 확인
3. 환경 변수 확인: 모든 필수 환경 변수가 설정되었는지 확인

### 도메인 연결 실패 시

1. DNS 설정 확인: GoDaddy DNS 레코드가 올바른지 확인
2. DNS 전파 확인: https://dnschecker.org 에서 확인
3. Vercel 도메인 설정 확인: Vercel 대시보드에서 도메인 상태 확인

---

## 추가 리소스

- Vercel 공식 문서: https://vercel.com/docs
- Next.js 배포 가이드: https://nextjs.org/docs/deployment
- GoDaddy DNS 설정: https://www.godaddy.com/help
