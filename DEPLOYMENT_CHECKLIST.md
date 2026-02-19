# 배포 체크리스트 (내일 작업용)

## 오늘 준비할 것 ✅

- [x] 프로젝트 코드 완성
- [x] 이메일 발송 기능 테스트 완료
- [ ] GitHub 계정 준비 (없다면 생성)
- [ ] Vercel 계정 준비 (없다면 생성)

---

## 내일 배포 순서

### 1단계: GitHub에 코드 업로드

```bash
# 프로젝트 폴더로 이동
cd c:\Users\user\Desktop\cursor\jaehunpark_promotion

# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: 세짐 프로모션 페이지"

# GitHub에 새 저장소 생성 후 연결
git remote add origin https://github.com/your-username/jaehunpark-promotion.git
git branch -M main
git push -u origin main
```

**주의:** `.env.local` 파일은 Git에 포함되지 않습니다 (`.gitignore`에 포함됨)

---

### 2단계: Vercel에 배포

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - "Sign Up" → GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - Vercel 대시보드 → "Add New..." → "Project"
   - GitHub 저장소 선택 (`jaehunpark-promotion`)
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: Next.js (자동 감지)
   - Root Directory: `./`
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)

4. **환경 변수 설정** ⚠️ 중요!
   
   "Environment Variables" 섹션에서 다음 변수들 추가:
   
   ```
   SMTP_HOST=smtp.naver.com
   SMTP_PORT=465
   SMTP_USER=humanics23@naver.com
   SMTP_PASS=QMWFGQZUXGR2
   RECIPIENT_EMAIL=admin@example.com
   NEXT_PUBLIC_BASE_URL=https://jaehunpark-promotion.vercel.app
   ```
   
   **주의:**
   - 각 변수마다 "Production", "Preview", "Development" 모두 체크
   - `NEXT_PUBLIC_BASE_URL`은 먼저 Vercel이 제공하는 URL로 설정
   - 나중에 도메인 연결 후 실제 도메인으로 변경

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 배포 완료까지 대기 (약 2-3분)

---

### 3단계: 배포 확인

1. **Vercel 제공 URL로 접속**
   - 예: `https://jaehunpark-promotion.vercel.app`

2. **기능 테스트**
   - [ ] 메인 페이지 접속 확인
   - [ ] 프로모션 신청 폼 제출 테스트
   - [ ] 어드민 페이지 접속 (`/admin`)
   - [ ] 이메일 알림 발송 테스트

---

### 4단계: GoDaddy 도메인 연결 (선택사항)

1. **GoDaddy에서 도메인 구매** (아직 안 했다면)

2. **Vercel에서 도메인 추가**
   - 프로젝트 → "Settings" → "Domains"
   - "Add Domain" 클릭
   - 도메인 입력 (예: `yourdomain.com`)

3. **GoDaddy DNS 설정**
   - GoDaddy → "My Products" → "DNS"
   - Vercel이 제공한 DNS 레코드 추가:
     - Type: `CNAME`
     - Name: `@`
     - Value: `cname.vercel-dns.com.` (Vercel이 제공하는 값)

4. **환경 변수 업데이트**
   - `NEXT_PUBLIC_BASE_URL`을 실제 도메인으로 변경
   - 재배포

---

## 중요: 환경 변수 목록

배포 시 Vercel에 설정해야 할 환경 변수:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `SMTP_HOST` | `smtp.naver.com` | 네이버 메일 SMTP 서버 |
| `SMTP_PORT` | `465` | SMTP 포트 (SSL) |
| `SMTP_USER` | `humanics23@naver.com` | 발신 이메일 주소 |
| `SMTP_PASS` | `QMWFGQZUXGR2` | 애플리케이션 비밀번호 |
| `RECIPIENT_EMAIL` | `admin@example.com` | 기본 수신 이메일 (선택사항) |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | 사이트 URL |

---

## 주의사항 ⚠️

### 데이터 저장소 문제

현재 프로젝트는 로컬 파일 시스템(`/data` 폴더)을 사용합니다.
**Vercel은 서버리스 환경이므로 파일 시스템에 영구 저장이 불가능합니다.**

**임시 해결책:**
- 배포 후 데이터가 저장되지 않을 수 있음
- 어드민 페이지에서 데이터 조회는 가능하지만, 제출 데이터가 사라질 수 있음

**장기 해결책 (나중에):**
- Vercel KV (Redis 기반) 사용
- Vercel Postgres 사용
- 외부 데이터베이스 (MongoDB, Supabase 등) 사용

---

## 문제 해결

### 배포 실패 시

1. Vercel 로그 확인
   - 프로젝트 → "Deployments" → 실패한 배포 → "Logs"

2. 로컬 빌드 테스트
   ```bash
   npm run build
   ```

3. 환경 변수 확인
   - 모든 필수 환경 변수가 설정되었는지 확인

### 도메인 연결 실패 시

1. DNS 설정 확인
   - GoDaddy DNS 레코드가 올바른지 확인
   - https://dnschecker.org 에서 전파 상태 확인

2. Vercel 도메인 설정 확인
   - Vercel 대시보드에서 도메인 상태 확인

---

## 참고 문서

- 상세 배포 가이드: `DEPLOYMENT.md`
- Vercel 공식 문서: https://vercel.com/docs
- Next.js 배포 가이드: https://nextjs.org/docs/deployment

---

## 내일 작업 시 체크리스트

- [ ] GitHub 계정 준비 완료
- [ ] Vercel 계정 준비 완료
- [ ] 코드를 GitHub에 업로드
- [ ] Vercel에 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 완료 확인
- [ ] 기능 테스트 완료
- [ ] (선택) GoDaddy 도메인 연결
