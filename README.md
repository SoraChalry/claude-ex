# Workroom

소규모 팀이 업무 상태·담당자·마감일을 칸반 보드에서 관리하는 반응형 업무 관리 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## MVP 범위

- 백로그·예정·진행·QA·완료 칸반 보드
- 제목 기반 업무 생성, 삭제, 드래그 상태 변경
- 담당자·우선순위·마감일·설명·막힘 상태 편집
- 내 업무의 지연·오늘·이번 주 요약
- Supabase 공개 공용 보드 저장소(연결 실패 시 `localStorage` fallback)
- 모바일 칸반 가로 스크롤 및 상세 패널

## Supabase 설정

1. `.env.example`을 `.env`로 복사하고 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 입력합니다.
2. Supabase Dashboard의 SQL Editor에서 `supabase/migrations/20260908000000_create_tasks.sql`을 실행합니다.
3. Data API 설정에서 `public.tasks`가 노출되어 있는지 확인한 뒤 `npm run dev`를 실행합니다.

현재는 인증 없는 공개 보드입니다. anon 키가 포함된 브라우저 앱을 사용하는 누구나 업무를 읽고 생성·수정·삭제할 수 있으므로, 실제 운영 데이터에는 인증과 사용자별 RLS 정책을 추가해야 합니다. `service_role` 또는 secret 키는 브라우저 환경 변수에 넣지 마세요.

Supabase 설정이 없거나 원격 조회에 실패하면 샘플 데이터와 브라우저 `localStorage`로 계속 사용할 수 있습니다.
