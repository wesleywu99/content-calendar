# Content Calendar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建一個自訂內容日曆 Web App：團隊在漂亮的 UI 上檢視/編輯/審核 小紅書·IG·FB 貼文，並手動觸發（需確認花費）你們 AI 平台上的 n8n flow 來自動生成文案與圖片；資料存在 Supabase，作為多 flow 共享的中央資料層。

**Architecture:** Next.js (App Router) on Vercel 當前端與 API；Supabase (Postgres + Auth + Storage + RLS) 當資料中樞與登入；n8n flow 住在使用者既有的「AI 平台」，透過 platform adapter（介面 + mock，真實 endpoint 待補）以 webhook/API 觸發；所有觸發手動、每次寫一筆 `flow_runs` 稽核。無專屬審核角色——團隊共用一介面，狀態流 `draft → review → approved` 仍保留，任何人可推進。

**Tech Stack:** Next.js 15 (App Router, TypeScript, React 19) · Tailwind CSS · Supabase (`@supabase/supabase-js`, `@supabase/ssr`) · date-fns · Vitest + @testing-library/react · Playwright (e2e, optional) · Vercel.

---

## 依賴與前置（需使用者提供 / 確認）

這些不阻塞 Phase 0–5；到 Phase 6/7 觸發真實 flow 時才需要。先以 adapter + mock 開發。

- 平台觸發 API：endpoint、認證方式（API key / Bearer）、如何指定 flow、同步或非同步、如何回報完成。
- 各 flow 單次價格（顯示在確認框）。
- flow 是否能直接寫我們的 Supabase 表（建議：能）。
- 圖片儲存：Supabase Storage（預設）或外部 URL。
- 登入：**本期不做**，改用 URL token 輕量門禁（見修訂 A）。

---

## 修訂 A（2026-06-24）— 不做登入，改用 URL token 輕量門禁

本期 MVP **不做 Google 登入**，改用「**網址帶 token 的輕量門禁**」擋掉無關使用者。token = `openbeauty`（存於環境變數 `APP_ACCESS_TOKEN`）。以下內容覆蓋計畫中所有認證相關部分，opencode 以此為準：

- **Phase 2 Task 2.2（Google 登入 / callback）：本期整個跳過，不要做。**
- **改為 token 門禁（middleware）**：訪問需帶 `?token=openbeauty`；通過後寫入一個 httpOnly cookie，之後免帶；未通過 → 回 401。實作：
  ```ts
  // src/middleware.ts
  import { NextResponse, type NextRequest } from 'next/server'
  const COOKIE = 'app_access'
  export function middleware(req: NextRequest) {
    const token = process.env.APP_ACCESS_TOKEN
    const qp = new URL(req.url).searchParams.get('token')
    const has = req.cookies.get(COOKIE)?.value === token
    if (token && (qp === token || has)) {
      const res = NextResponse.next()
      if (qp === token) res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' })
      return res
    }
    return new NextResponse('需要存取權杖（在網址後加 ?token=…）', { status: 401 })
  }
  export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
  ```
- **Phase 2 Task 2.1**：只做「伺服器端 service_role client」，不做 browser client / SSR cookie。所有 DB 存取一律走伺服器端（Server Component / Action / Route Handler）。實作：
  ```ts
  // src/lib/supabase/server.ts
  import { createClient as createSb } from '@supabase/supabase-js'
  export async function createClient() {
    return createSb(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,   // 伺服器端專用
      { auth: { persistSession: false } },
    )
  }
  ```
  （RLS 保持開啟；service_role 繞過 RLS，故 `0002_rls.sql` 照建即可。）
- **Phase 6.2 觸發 route**：移除 `auth.getUser()` 與 401 檢查；`triggered_by` 暫填 `'system'`。
- **Phase 7.3 realtime**：本期延後（realtime 需 client + 登入/RLS）。改用動作後 `router.refresh()` 更新畫面。
- **Phase 8 部署**：⚠️ token 門禁只是「擋無關的人」，**不是真正的安全**（連結外洩即失效；會留在瀏覽器/伺服器 log）。對外正式上線前仍須補正式登入（見文末附錄）。本期僅供本機 / 內部測試。
- `.env.local` 需含：`NEXT_PUBLIC_SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`APP_ACCESS_TOKEN`。

---

## 檔案結構（File Structure）

```
content-calendar/
├─ docs/
│  ├─ specs/2026-06-24-content-calendar-design.md
│  └─ plans/2026-06-24-content-calendar-implementation-plan.md   ← 本檔
├─ supabase/
│  ├─ migrations/0001_init.sql           # schema：enums + 4 張表
│  ├─ migrations/0002_rls.sql            # RLS 政策
│  └─ seed.sql                           # 範例資料
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                      # 根 layout（字體、Tailwind）
│  │  ├─ globals.css                     # Tailwind + 設計變數
│  │  ├─ login/page.tsx                  # Google 登入頁
│  │  ├─ auth/callback/route.ts          # OAuth callback
│  │  ├─ (app)/layout.tsx                # 受保護區：側欄 + 頂列
│  │  ├─ (app)/page.tsx                  # 儀表板（月曆 + 需要處理）
│  │  ├─ (app)/calendar/page.tsx         # 月曆全頁
│  │  ├─ (app)/board/page.tsx            # 看板
│  │  └─ api/flows/trigger/route.ts      # 觸發 flow（寫 flow_runs → 呼叫 platform）
│  ├─ components/
│  │  ├─ Sidebar.tsx · TopBar.tsx
│  │  ├─ CalendarGrid.tsx                # 自訂月曆（含換月）
│  │  ├─ Board.tsx · ContentCard.tsx · Queue.tsx
│  │  ├─ ContentDrawer.tsx               # 卡片詳情：改文案、狀態、圖片、重生
│  │  ├─ GenerateModal.tsx               # 生成：選平台 + 費用確認 + 生成中
│  │  └─ Toaster.tsx · StatusBadge.tsx · PlatformBadge.tsx
│  ├─ lib/
│  │  ├─ supabase/client.ts · server.ts  # browser / server client
│  │  ├─ types.ts                        # DB 型別（與 schema 對齊）
│  │  ├─ repo/content.ts                 # content_items 讀寫
│  │  ├─ repo/insights.ts · repo/assets.ts · repo/flowRuns.ts
│  │  ├─ domain/status.ts                # 狀態流轉規則（純函式）
│  │  ├─ domain/fingerprint.ts           # 去重指紋（純函式）
│  │  ├─ domain/cost.ts                  # 費用計算（純函式）
│  │  └─ platform/index.ts               # platform adapter 介面
│  │     platform/mock.ts · platform/http.ts
│  └─ test/setup.ts
├─ .env.local.example
├─ vitest.config.ts · tailwind.config.ts · next.config.ts · tsconfig.json
└─ package.json
```

設計原則（符合既有模組化偏好）：純邏輯（status / fingerprint / cost / platform）獨立於 React 與 Supabase，可單測；repo 層包住所有 DB 存取；platform adapter 以介面隔離外部系統。

---

# Phase 0 — 專案骨架（可跑空殼）

### Task 0.1：建立 Next.js + Tailwind + 測試環境

**Files:**
- Create: `content-calendar/`（Next 專案）、`vitest.config.ts`、`src/test/setup.ts`、`.env.local.example`

- [ ] **Step 1: 建立 Next 專案**

```bash
cd C:/Users/wesleywu/content-calendar
npx create-next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --no-eslint --use-npm
```
（若資料夾非空，先把 `docs/` 暫移出再移回，或於空子資料夾建立後移動。）

- [ ] **Step 2: 安裝相依**

```bash
npm i @supabase/supabase-js @supabase/ssr date-fns
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 3: 設定 Vitest**

`vitest.config.ts`：
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```
`src/test/setup.ts`：
```ts
import '@testing-library/jest-dom/vitest'
```
`package.json` scripts 加：`"test": "vitest run"`, `"test:watch": "vitest"`。

- [ ] **Step 4: 環境變數樣板**

`.env.local.example`：
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_EMAIL_DOMAIN=fimmick.com
# Phase 6+：平台觸發
PLATFORM_API_BASE=
PLATFORM_API_KEY=
```

- [ ] **Step 5: 驗證可跑 + commit**

```bash
npm run dev      # 開 http://localhost:3000 確認預設頁
npm run test     # 0 tests, exit 0
git init && git add -A && git commit -m "chore: bootstrap next.js + tailwind + vitest"
```
Expected：dev 起得來、test 通過。

---

### Task 0.2：純邏輯——狀態流轉（TDD）

**Files:**
- Create: `src/lib/types.ts`、`src/lib/domain/status.ts`
- Test: `src/lib/domain/status.test.ts`

- [ ] **Step 1: 定型別**

`src/lib/types.ts`：
```ts
export type Platform = 'xiaohongshu' | 'instagram' | 'facebook'
export type ContentStatus = 'idea' | 'draft' | 'review' | 'approved'
export type AssetStatus = 'none' | 'queued' | 'generating' | 'ready' | 'failed'

export interface ContentItem {
  id: string
  title: string
  platform: Platform
  publish_date: string | null      // 'YYYY-MM-DD'
  caption: string | null
  content_status: ContentStatus
  asset_status: AssetStatus
  insight_id: string | null
  fingerprint: string
  owner: string | null
  generated_by: string | null
  human_edited: boolean
  created_at: string
  updated_at: string
}
export interface Asset {
  id: string; content_item_id: string; type: 'image' | 'video'
  url: string; prompt: string | null; fingerprint: string; created_at: string
}
export interface FlowRun {
  id: string; flow_key: string; triggered_by: string; cost: number | null
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  request_meta: Record<string, unknown>; result_meta: Record<string, unknown>
  error: string | null; started_at: string; finished_at: string | null
}
```

- [ ] **Step 2: 寫失敗測試**

`src/lib/domain/status.test.ts`：
```ts
import { describe, it, expect } from 'vitest'
import { nextStatuses, canTransition, STATUS_LABEL } from './status'

describe('status transitions', () => {
  it('draft 可送審', () => expect(nextStatuses('draft')).toContain('review'))
  it('review 可核准或退回', () => {
    expect(nextStatuses('review')).toEqual(expect.arrayContaining(['approved', 'draft']))
  })
  it('approved 可取消核准回 review', () => expect(nextStatuses('approved')).toContain('review'))
  it('禁止 draft 直接 approved', () => expect(canTransition('draft', 'approved')).toBe(false))
  it('允許 review→approved', () => expect(canTransition('review', 'approved')).toBe(true))
  it('有中文標籤', () => expect(STATUS_LABEL.review).toBe('待審核'))
})
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npm run test -- status`　Expected：FAIL（找不到模組/函式）

- [ ] **Step 4: 實作**

`src/lib/domain/status.ts`：
```ts
import type { ContentStatus } from '@/lib/types'

export const STATUS_LABEL: Record<ContentStatus, string> = {
  idea: '構思', draft: '草稿', review: '待審核', approved: '已核准',
}
const GRAPH: Record<ContentStatus, ContentStatus[]> = {
  idea: ['draft'], draft: ['review'], review: ['approved', 'draft'], approved: ['review'],
}
export const nextStatuses = (s: ContentStatus): ContentStatus[] => GRAPH[s] ?? []
export const canTransition = (from: ContentStatus, to: ContentStatus): boolean =>
  nextStatuses(from).includes(to)
```

- [ ] **Step 5: 跑測試確認通過 + commit**

Run: `npm run test -- status`　Expected：PASS
```bash
git add src/lib/types.ts src/lib/domain/status.ts src/lib/domain/status.test.ts
git commit -m "feat: content status transition rules"
```

---

### Task 0.3：純邏輯——指紋與費用（TDD）

**Files:** Create `src/lib/domain/fingerprint.ts`、`src/lib/domain/cost.ts`；Test 同名 `.test.ts`

- [ ] **Step 1: 寫失敗測試**

`src/lib/domain/fingerprint.test.ts`：
```ts
import { describe, it, expect } from 'vitest'
import { contentFingerprint, assetFingerprint } from './fingerprint'

describe('fingerprint', () => {
  it('同 insight×平台 指紋穩定', () => {
    expect(contentFingerprint('ins_1', 'instagram'))
      .toBe(contentFingerprint('ins_1', 'instagram'))
  })
  it('不同平台指紋不同', () => {
    expect(contentFingerprint('ins_1', 'instagram'))
      .not.toBe(contentFingerprint('ins_1', 'facebook'))
  })
  it('asset 指紋綁內容 id', () => {
    expect(assetFingerprint('c_1', 1)).toBe('c_1:image:1')
  })
})
```
`src/lib/domain/cost.test.ts`：
```ts
import { describe, it, expect } from 'vitest'
import { generationCost, formatCost } from './cost'

describe('cost', () => {
  it('每平台 $8', () => expect(generationCost(['instagram', 'facebook'])).toBe(16))
  it('空陣列 0', () => expect(generationCost([])).toBe(0))
  it('格式化', () => expect(formatCost(16)).toBe('$16'))
})
```

- [ ] **Step 2: 跑測試確認失敗** — Run: `npm run test -- fingerprint cost` → FAIL

- [ ] **Step 3: 實作**

`src/lib/domain/fingerprint.ts`：
```ts
import type { Platform } from '@/lib/types'
export const contentFingerprint = (insightId: string, platform: Platform) =>
  `${insightId}:${platform}`
export const assetFingerprint = (contentId: string, n: number) =>
  `${contentId}:image:${n}`
```
`src/lib/domain/cost.ts`：
```ts
import type { Platform } from '@/lib/types'
export const PRICE_PER_POST = 8   // TODO Phase 6：改由平台 API 取得
export const generationCost = (platforms: Platform[]) => platforms.length * PRICE_PER_POST
export const formatCost = (n: number) => `$${n}`
```

- [ ] **Step 4: 跑測試確認通過 + commit**

Run: `npm run test`　Expected：PASS
```bash
git add src/lib/domain/fingerprint.* src/lib/domain/cost.*
git commit -m "feat: fingerprint + cost pure helpers"
```

---

# Phase 1 — Supabase Schema + RLS + Seed

### Task 1.1：建立 Supabase 專案與 schema

**Files:** Create `supabase/migrations/0001_init.sql`

- [ ] **Step 1: 建專案**（手動）：在 supabase.com 建免費專案，複製 `Project URL`、`anon key`、`service_role key` 到 `.env.local`。

- [ ] **Step 2: 寫 schema migration**

`supabase/migrations/0001_init.sql`：
```sql
create extension if not exists pgcrypto;

create type platform        as enum ('xiaohongshu','instagram','facebook');
create type insight_source  as enum ('social','competitor','trend','internal');
create type content_status  as enum ('idea','draft','review','approved');
create type asset_status    as enum ('none','queued','generating','ready','failed');
create type asset_type      as enum ('image','video');
create type flow_run_status as enum ('pending','running','succeeded','failed');

create table insights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source insight_source not null,
  summary text,
  llm_insight text,
  topics text[] default '{}',
  source_url text,
  fingerprint text unique not null,
  captured_at timestamptz,
  created_at timestamptz default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform platform not null,
  publish_date date,
  caption text,
  content_status content_status not null default 'draft',
  asset_status asset_status not null default 'none',
  insight_id uuid references insights(id) on delete set null,
  fingerprint text unique not null,
  owner text,
  generated_by text,
  human_edited boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on content_items (publish_date);
create index on content_items (content_status);

create table assets (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  type asset_type not null default 'image',
  url text not null,
  prompt text,
  meta jsonb default '{}',
  fingerprint text unique not null,
  generated_by text,
  created_at timestamptz default now()
);
create index on assets (content_item_id);

create table flow_runs (
  id uuid primary key default gen_random_uuid(),
  flow_key text not null,
  triggered_by text not null,
  cost numeric,
  status flow_run_status not null default 'pending',
  request_meta jsonb default '{}',
  result_meta jsonb default '{}',
  error text,
  started_at timestamptz default now(),
  finished_at timestamptz
);

-- updated_at 自動維護
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger trg_touch before update on content_items
  for each row execute function touch_updated_at();
```

- [ ] **Step 3: 套用**（用 Supabase SQL Editor 貼上執行，或裝 supabase CLI `supabase db push`）。在 Table editor 確認四張表存在。

- [ ] **Step 4: commit**
```bash
git add supabase/migrations/0001_init.sql
git commit -m "feat(db): initial schema (insights/content_items/assets/flow_runs)"
```

### Task 1.2：RLS 政策（登入即可讀寫，網域於 app 層把關）

**Files:** Create `supabase/migrations/0002_rls.sql`

- [ ] **Step 1: 寫政策**
```sql
alter table insights      enable row level security;
alter table content_items enable row level security;
alter table assets        enable row level security;
alter table flow_runs     enable row level security;

-- 已登入使用者（authenticated）可讀寫全部；服務金鑰（n8n flow）繞過 RLS
create policy "auth read content"  on content_items for select to authenticated using (true);
create policy "auth write content" on content_items for all    to authenticated using (true) with check (true);
create policy "auth read insights" on insights      for select to authenticated using (true);
create policy "auth read assets"   on assets        for select to authenticated using (true);
create policy "auth read runs"     on flow_runs     for select to authenticated using (true);
create policy "auth write runs"    on flow_runs     for all    to authenticated using (true) with check (true);
```
> 註：細到「只有特定人能 approved」非本期需求（已拿掉審核角色）。網域限制在 app 登入層做。n8n flow 用 service_role key 寫入，繞過 RLS。

- [ ] **Step 2: 套用 + 在 SQL editor 用 anon 角色測一次 select（應被擋，因未登入）。**
- [ ] **Step 3: commit** — `git commit -am "feat(db): RLS policies"`

### Task 1.3：Seed 範例資料

**Files:** Create `supabase/seed.sql`

- [ ] **Step 1: 寫 seed**（2 筆 insight + 6 筆 content，涵蓋三平台與各狀態，日期落在 2026-06-25 ～ 07-02）
```sql
insert into insights (id, title, source, summary, llm_insight, fingerprint, captured_at) values
 ('11111111-1111-1111-1111-111111111111','端午節前一週，XHS「節慶限定」聲量 +180%','trend','...','端午檔期推限定口味回歸 + 家庭情感，XHS 優先','demo_ins_1','2026-06-22'),
 ('22222222-2222-2222-2222-222222222222','競品推教學短影音，留言詢問度高','competitor','...','我方可搶攻「使用教學」內容空缺','demo_ins_2','2026-06-21');

insert into content_items (title, platform, publish_date, caption, content_status, insight_id, fingerprint) values
 ('端午企劃·限時口味回歸','xiaohongshu','2026-06-26','端午節限定口味回來啦！…','draft','11111111-1111-1111-1111-111111111111','demo_ins_1:xiaohongshu'),
 ('端午企劃·限時口味回歸','instagram','2026-06-26','記憶中的那口味道…','draft','11111111-1111-1111-1111-111111111111','demo_ins_1:instagram'),
 ('產品使用教學 EP1','instagram','2026-06-28','三步學會正確使用！…','review','22222222-2222-2222-2222-222222222222','demo_ins_2:instagram'),
 ('客戶見證貼','facebook','2026-06-25','「用了三個月，回不去了。」','approved',null,'manual_testimonial'),
 ('幕後花絮·團隊日常','instagram','2026-06-30',null,'idea',null,'manual_behind'),
 ('競品熱題回應·教學系列','xiaohongshu','2026-07-02','使用訣竅整理給你！…','draft','22222222-2222-2222-2222-222222222222','demo_ins_2:xiaohongshu');
```
- [ ] **Step 2: 套用，Table editor 確認 6 筆。**
- [ ] **Step 3: commit** — `git commit -am "chore(db): seed sample data"`

---

# Phase 2 — 登入（Google + 限網域）與 App 外殼

### Task 2.1：Supabase client（browser / server）

**Files:** Create `src/lib/supabase/client.ts`、`src/lib/supabase/server.ts`

- [ ] **Step 1: browser client**
```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
```
- [ ] **Step 2: server client**
```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        getAll: () => store.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) => store.set(name, value, options)),
    }},
  )
}
```
- [ ] **Step 3: commit** — `git commit -am "feat(auth): supabase ssr clients"`

### Task 2.2：Google 登入 + callback + 網域限制

**Files:** Create `src/app/login/page.tsx`、`src/app/auth/callback/route.ts`、`src/middleware.ts`

- [ ] **Step 1: 在 Supabase 啟用 Google provider**（手動：Auth → Providers → Google，填 OAuth client）。
- [ ] **Step 2: 登入頁**
```tsx
// src/app/login/page.tsx  (client component)
'use client'
import { createClient } from '@/lib/supabase/client'
export default function Login() {
  const signIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback`, queryParams: { hd: 'fimmick.com' } },
    })
  }
  return (
    <main className="min-h-screen grid place-items-center bg-[#f6f7f9]">
      <div className="bg-white border rounded-2xl shadow p-8 w-[360px] text-center">
        <div className="w-9 h-9 mx-auto rounded-lg bg-indigo-600 mb-4" />
        <h1 className="text-lg font-semibold mb-1">內容中心</h1>
        <p className="text-sm text-gray-500 mb-6">請用公司帳號登入</p>
        <button onClick={signIn} className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium">使用 Google 登入</button>
      </div>
    </main>
  )
}
```
- [ ] **Step 3: callback + 網域檢查**
```ts
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    const { data } = await supabase.auth.getUser()
    const domain = process.env.ALLOWED_EMAIL_DOMAIN
    if (domain && !data.user?.email?.endsWith(`@${domain}`)) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/login?error=domain`)
    }
  }
  return NextResponse.redirect(`${origin}/`)
}
```
- [ ] **Step 4: middleware 保護路由**
```ts
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => req.cookies.getAll(),
      setAll: (c) => c.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) } },
  )
  const { data } = await supabase.auth.getUser()
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/auth')
  if (!data.user && !isAuthPage) return NextResponse.redirect(new URL('/login', req.url))
  return res
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```
- [ ] **Step 5: 驗證**：未登入訪 `/` → 轉 `/login`；非 fimmick.com 帳號被登出退回。
- [ ] **Step 6: commit** — `git commit -am "feat(auth): google login + domain restriction + route guard"`

### Task 2.3：App 外殼（側欄 + 頂列 + 設計變數）

**Files:** Create `src/app/globals.css`（補設計 token）、`src/components/Sidebar.tsx`、`src/components/TopBar.tsx`、`src/app/(app)/layout.tsx`

- [ ] **Step 1: 設計 token**（在 globals.css 末端加 CSS 變數：平台色 `--xhs/--ig/--fb`、狀態色、陰影；對齊原型）。
- [ ] **Step 2: Sidebar**（品牌 + 導覽：儀表板/月曆/看板，`usePathname` 標 active；底部「團隊共用」說明）。
- [ ] **Step 3: TopBar**（頁標題 + 右側「生成內容」按鈕 placeholder + 生成中 pill）。
- [ ] **Step 4: 受保護 layout**
```tsx
// src/app/(app)/layout.tsx
import Sidebar from '@/components/Sidebar'
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  )
}
```
- [ ] **Step 5: 驗證 dev 畫面有側欄外殼 + commit** — `git commit -am "feat(ui): app shell (sidebar + topbar + tokens)"`

---

# Phase 3 — 資料層（repo）+ 測試

### Task 3.1：content repo（讀 + 改文案 + 改狀態）

**Files:** Create `src/lib/repo/content.ts`；Test `src/lib/repo/content.test.ts`

> repo 接收注入的 supabase client，方便用 mock client 單測。

- [ ] **Step 1: 寫失敗測試（以 mock client 驗證查詢與「AI不蓋人」旗標）**
```ts
// src/lib/repo/content.test.ts
import { describe, it, expect, vi } from 'vitest'
import { listContent, updateCaption, setStatus } from './content'

const okSingle = (row: any) => ({ select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }) })

it('updateCaption 會把 human_edited 設為 true', async () => {
  const update = vi.fn(() => ({ eq: () => okSingle({ id: 'c1', caption: 'x', human_edited: true }) }))
  const client: any = { from: () => ({ update }) }
  const r = await updateCaption(client, 'c1', 'x')
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ caption: 'x', human_edited: true }))
  expect(r.human_edited).toBe(true)
})

it('setStatus 拒絕非法流轉', async () => {
  const client: any = { from: () => ({}) }
  await expect(setStatus(client, 'c1', 'draft', 'approved')).rejects.toThrow()
})
```
- [ ] **Step 2: 跑測試確認失敗** — `npm run test -- content` → FAIL
- [ ] **Step 3: 實作**
```ts
// src/lib/repo/content.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContentItem, ContentStatus } from '@/lib/types'
import { canTransition } from '@/lib/domain/status'

export async function listContent(c: SupabaseClient): Promise<ContentItem[]> {
  const { data, error } = await c.from('content_items').select('*').order('publish_date', { ascending: true })
  if (error) throw error
  return data as ContentItem[]
}
export async function updateCaption(c: SupabaseClient, id: string, caption: string): Promise<ContentItem> {
  const { data, error } = await c.from('content_items')
    .update({ caption, human_edited: true }).eq('id', id).select().single()
  if (error) throw error
  return data as ContentItem
}
export async function setStatus(c: SupabaseClient, id: string, from: ContentStatus, to: ContentStatus): Promise<ContentItem> {
  if (!canTransition(from, to)) throw new Error(`illegal transition ${from}→${to}`)
  const { data, error } = await c.from('content_items')
    .update({ content_status: to }).eq('id', id).select().single()
  if (error) throw error
  return data as ContentItem
}
```
- [ ] **Step 4: 跑測試確認通過 + commit** — `npm run test -- content` → PASS；`git commit -am "feat(repo): content read/update/status with AI-no-overwrite flag"`

### Task 3.2：assets / insights / flowRuns repo

**Files:** Create `src/lib/repo/assets.ts`、`insights.ts`、`flowRuns.ts`；Test `flowRuns.test.ts`

- [ ] **Step 1: 寫 flowRuns 失敗測試**（`createRun` 寫入 pending、`completeRun` 更新狀態與 finished_at）。
```ts
import { describe, it, expect, vi } from 'vitest'
import { createRun } from './flowRuns'
it('createRun 寫 pending + cost', async () => {
  const insert = vi.fn(() => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'r1', status: 'pending' }, error: null }) }) }))
  const client: any = { from: () => ({ insert }) }
  const r = await createRun(client, { flow_key: 'gen', triggered_by: 'a@x', cost: 16, request_meta: {} })
  expect(insert).toHaveBeenCalledWith(expect.objectContaining({ flow_key: 'gen', status: 'pending', cost: 16 }))
  expect(r.id).toBe('r1')
})
```
- [ ] **Step 2: 跑失敗** → FAIL
- [ ] **Step 3: 實作三檔**
```ts
// src/lib/repo/flowRuns.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FlowRun } from '@/lib/types'
export async function createRun(c: SupabaseClient, p: { flow_key: string; triggered_by: string; cost: number; request_meta: Record<string, unknown> }): Promise<FlowRun> {
  const { data, error } = await c.from('flow_runs').insert({ ...p, status: 'pending' }).select().single()
  if (error) throw error; return data as FlowRun
}
export async function completeRun(c: SupabaseClient, id: string, status: 'succeeded'|'failed', result_meta: Record<string, unknown>, error?: string): Promise<void> {
  const { error: e } = await c.from('flow_runs').update({ status, result_meta, error: error ?? null, finished_at: new Date().toISOString() }).eq('id', id)
  if (e) throw e
}
```
```ts
// src/lib/repo/assets.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Asset } from '@/lib/types'
export async function listAssetsFor(c: SupabaseClient, contentId: string): Promise<Asset[]> {
  const { data, error } = await c.from('assets').select('*').eq('content_item_id', contentId).order('created_at')
  if (error) throw error; return data as Asset[]
}
```
```ts
// src/lib/repo/insights.ts
import type { SupabaseClient } from '@supabase/supabase-js'
export async function getInsight(c: SupabaseClient, id: string) {
  const { data, error } = await c.from('insights').select('*').eq('id', id).single()
  if (error) throw error; return data
}
```
- [ ] **Step 4: 跑通過 + commit** — `git commit -am "feat(repo): assets/insights/flowRuns"`

---

# Phase 4 — 讀取視圖：月曆 / 看板 / 卡片

### Task 4.1：共用徽章元件

**Files:** Create `src/components/PlatformBadge.tsx`、`StatusBadge.tsx`；Test `StatusBadge.test.tsx`

- [ ] **Step 1: 失敗測試**
```tsx
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'
it('顯示中文狀態', () => { render(<StatusBadge status="review" />); expect(screen.getByText('待審核')).toBeInTheDocument() })
```
- [ ] **Step 2: FAIL → 實作**
```tsx
// src/components/StatusBadge.tsx
import { STATUS_LABEL } from '@/lib/domain/status'
import type { ContentStatus } from '@/lib/types'
const CLS: Record<ContentStatus,string> = { idea:'bg-gray-100 text-gray-600', draft:'bg-amber-100 text-amber-800', review:'bg-blue-100 text-blue-800', approved:'bg-green-100 text-green-700' }
export default function StatusBadge({ status }: { status: ContentStatus }) {
  return <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${CLS[status]}`}>{STATUS_LABEL[status]}</span>
}
```
（PlatformBadge 同模式：xiaohongshu→小紅書/紅、instagram→IG/粉、facebook→FB/藍。）
- [ ] **Step 3: PASS + commit** — `git commit -am "feat(ui): platform/status badges"`

### Task 4.2：CalendarGrid（含換月，解決 Notion 痛點）

**Files:** Create `src/components/CalendarGrid.tsx`；Test `CalendarGrid.test.tsx`

- [ ] **Step 1: 失敗測試**（給定 6/2026、一筆 6/26 的事件 → 該日格顯示標題；點「›」呼叫 onMonthChange）
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarGrid from './CalendarGrid'
const items = [{ id:'1', title:'端午企劃', platform:'instagram', publish_date:'2026-06-26', content_status:'draft' } as any]
it('在對應日期顯示事件', () => {
  render(<CalendarGrid month={new Date(2026,5,1)} items={items} onMonthChange={()=>{}} onOpen={()=>{}} />)
  expect(screen.getByText('端午企劃')).toBeInTheDocument()
})
it('點下一月觸發 onMonthChange', () => {
  const fn = vi.fn()
  render(<CalendarGrid month={new Date(2026,5,1)} items={[]} onMonthChange={fn} onOpen={()=>{}} />)
  fireEvent.click(screen.getByLabelText('下一月')); expect(fn).toHaveBeenCalled()
})
```
- [ ] **Step 2: FAIL → 實作**（用 date-fns `startOfMonth/startOfWeek/addDays/addMonths/format`；事件以平台色顯示；prev/next/今天 按鈕呼 `onMonthChange`；事件點擊呼 `onOpen(id)`。將原型的 `calTable` 邏輯改寫為 React，週一起始。）
- [ ] **Step 3: PASS + commit** — `git commit -am "feat(ui): calendar grid with month navigation"`

### Task 4.3：Board / ContentCard / Queue

**Files:** Create `src/components/Board.tsx`、`ContentCard.tsx`、`Queue.tsx`

- [ ] **Step 1: ContentCard**（帶圖縮圖：若有 asset 用其 url，否則用漸層 placeholder；標題 + 平台 + 日期）。
- [ ] **Step 2: Board**（三欄 draft/review/approved，map content；點卡 `onOpen`）。
- [ ] **Step 3: Queue**（list `status!=='approved'`，儀表板用）。
- [ ] **Step 4: 基本 render 測試各一 + commit** — `git commit -am "feat(ui): board/card/queue"`

### Task 4.4：頁面接上資料（Server Components 讀 Supabase）

**Files:** Create `src/app/(app)/page.tsx`、`calendar/page.tsx`、`board/page.tsx`

- [ ] **Step 1: 儀表板**（server component：`createClient()` → `listContent` → 傳給一個 client 容器 `DashboardView`，內含 CalendarGrid + Queue；月份狀態在 client）。
- [ ] **Step 2: calendar/board 頁同樣注入資料。**
- [ ] **Step 3: 驗證**：`npm run dev` 看到 seed 的 6 筆出現在月曆/看板/佇列，換月可用。
- [ ] **Step 4: commit** — `git commit -am "feat(app): wire calendar/board/dashboard to supabase"`

---

# Phase 5 — 卡片詳情：改文案 + 狀態流轉 + 圖片顯示

### Task 5.1：ContentDrawer（讀 + 編輯文案 + 狀態按鈕）

**Files:** Create `src/components/ContentDrawer.tsx`；Server action `src/app/(app)/actions.ts`

- [ ] **Step 1: server actions**
```ts
// src/app/(app)/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateCaption, setStatus } from '@/lib/repo/content'
import type { ContentStatus } from '@/lib/types'
export async function saveCaption(id: string, caption: string) {
  const c = await createClient(); await updateCaption(c, id, caption); revalidatePath('/')
}
export async function changeStatus(id: string, from: ContentStatus, to: ContentStatus) {
  const c = await createClient(); await setStatus(c, id, from, to); revalidatePath('/')
}
```
- [ ] **Step 2: Drawer UI**（右側抽屜：平台/日期/狀態、圖片區（asset 或 placeholder）+「重新生成圖」按鈕(Phase 7 接)、文案 textarea(onBlur 呼 `saveCaption`)、底部依 `nextStatuses` 動態出按鈕呼 `changeStatus`、關聯洞察區塊）。
- [ ] **Step 3: 在各視圖接 onOpen → 開 Drawer。**
- [ ] **Step 4: 驗證**：改文案存得住、`human_edited` 變 true（DB 可見）；送審/核准/退回流轉正確；非法流轉不出現按鈕。
- [ ] **Step 5: commit** — `git commit -am "feat(ui): content drawer (edit caption + status flow)"`

---

# Phase 6 — 生成流程：費用確認 + 觸發 platform flow

### Task 6.1：platform adapter（介面 + mock + http 骨架）

**Files:** Create `src/lib/platform/index.ts`、`mock.ts`、`http.ts`；Test `mock.test.ts`

- [ ] **Step 1: 介面 + 失敗測試**
```ts
// src/lib/platform/index.ts
import type { Platform } from '@/lib/types'
export interface TriggerInput { flowKey: string; platforms: Platform[]; topic: string; date: string }
export interface TriggerResult { ok: boolean; runRef?: string; error?: string }
export interface PlatformClient { triggerFlow(input: TriggerInput): Promise<TriggerResult> }
```
```ts
// src/lib/platform/mock.test.ts
import { it, expect } from 'vitest'
import { mockPlatform } from './mock'
it('mock 觸發回 ok + runRef', async () => {
  const r = await mockPlatform.triggerFlow({ flowKey:'gen', platforms:['instagram'], topic:'x', date:'2026-06-29' })
  expect(r.ok).toBe(true); expect(r.runRef).toBeTruthy()
})
```
- [ ] **Step 2: FAIL → 實作 mock + http 骨架**
```ts
// src/lib/platform/mock.ts
import type { PlatformClient } from './index'
export const mockPlatform: PlatformClient = {
  async triggerFlow() { return { ok: true, runRef: `mock_${Math.floor(Math.random()*1e6)}` } },
}
```
```ts
// src/lib/platform/http.ts  —— 真實實作：待平台 API 細節
import type { PlatformClient } from './index'
export const httpPlatform: PlatformClient = {
  async triggerFlow(input) {
    const res = await fetch(`${process.env.PLATFORM_API_BASE}/flows/${input.flowKey}/trigger`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.PLATFORM_API_KEY}` },
      body: JSON.stringify({ platforms: input.platforms, topic: input.topic, date: input.date }),
    })
    if (!res.ok) return { ok: false, error: `platform ${res.status}` }
    const j = await res.json().catch(() => ({}))
    return { ok: true, runRef: j.runId ?? j.id }
  },
}
export const platform = process.env.PLATFORM_API_BASE ? httpPlatform : (await import('./mock')).mockPlatform
```
- [ ] **Step 3: PASS + commit** — `git commit -am "feat(platform): adapter interface + mock + http skeleton"`

### Task 6.2：觸發 API route（寫 flow_runs → 呼叫 platform）

**Files:** Create `src/app/api/flows/trigger/route.ts`

- [ ] **Step 1: 實作**
```ts
// src/app/api/flows/trigger/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRun, completeRun } from '@/lib/repo/flowRuns'
import { generationCost } from '@/lib/domain/cost'
import { platform } from '@/lib/platform/http'
import type { Platform } from '@/lib/types'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { flowKey, platforms, topic, date } = await req.json() as
    { flowKey: string; platforms: Platform[]; topic: string; date: string }
  const cost = generationCost(platforms)

  const run = await createRun(supabase, { flow_key: flowKey, triggered_by: u.user.email!, cost, request_meta: { platforms, topic, date } })
  const result = await platform.triggerFlow({ flowKey, platforms, topic, date })
  await completeRun(supabase, run.id, result.ok ? 'succeeded' : 'failed', { runRef: result.runRef ?? null }, result.error)

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 })
  return NextResponse.json({ runId: run.id, runRef: result.runRef })
}
```
> 註：mock 模式下，flow 不會真的寫內容；Phase 6.4 用一個 dev-only fallback 讓 mock 也產生草稿，方便端到端體驗。真實串接後移除。
- [ ] **Step 2: commit** — `git commit -am "feat(api): manual flow trigger with flow_runs audit"`

### Task 6.3：GenerateModal（選平台 + 費用確認 + 生成中）

**Files:** Create `src/components/GenerateModal.tsx`

- [ ] **Step 1: UI**（平台 chips（多選）、主題輸入、日期、費用列 `formatCost(generationCost(selected))`；確認 → fetch `/api/flows/trigger`；生成中分步動畫；完成 toast + `router.refresh()`）。
- [ ] **Step 2: 接到 TopBar「生成內容」按鈕開啟。**
- [ ] **Step 3: 驗證**：選平台 → 費用即時更新 → 確認 → flow_runs 多一筆（DB 可見）→ 完成提示。
- [ ] **Step 4: commit** — `git commit -am "feat(ui): generate modal (cost confirm + trigger)"`

### Task 6.4：（暫行）mock 完成後產生草稿 + 完成通知

**Files:** Modify `src/app/api/flows/trigger/route.ts`（dev-only 區塊）

- [ ] **Step 1:** 當 `PLATFORM_API_BASE` 未設（mock 模式），於 route 內直接 insert 草稿（`content_status='draft'`, `fingerprint = topic:platform:date`, upsert on conflict 不重複），讓體驗端到端可跑。
- [ ] **Step 2: 驗證**：生成後新草稿出現在月曆。
- [ ] **Step 3: commit** — `git commit -am "feat(dev): mock generation writes draft items"`

---

# Phase 7 — 圖片資產：顯示 + 重新生成

### Task 7.1：Drawer 顯示 assets + asset_status

**Files:** Modify `src/components/ContentDrawer.tsx`；Server load assets via `listAssetsFor`

- [ ] **Step 1:** Drawer 開啟時讀該 content 的 assets，圖片區顯示最新一張；`asset_status==='generating'` 顯示 loading。
- [ ] **Step 2: commit** — `git commit -am "feat(ui): show generated image assets in drawer"`

### Task 7.2：重新生成圖（觸發生圖 flow）

**Files:** Modify `ContentDrawer.tsx`；reuse `/api/flows/trigger`（flowKey='image', 帶 contentId）

- [ ] **Step 1:** 「重新生成圖」→ 確認費用 → POST trigger（flowKey='image', request_meta={contentId}）→ 設 `asset_status='generating'` → 完成後 realtime/refresh 顯示新圖。
- [ ] **Step 2:** mock 模式：route 寫一筆 asset（gradient placeholder URL 或 Supabase Storage 上傳測試圖）、`asset_status='ready'`。
- [ ] **Step 3: 驗證 + commit** — `git commit -am "feat(ui): regenerate image trigger"`

### Task 7.3：Realtime 即時更新（flow 寫完 UI 自動跳）

**Files:** Create `src/components/RealtimeRefresh.tsx`

- [ ] **Step 1:** 訂閱 `content_items` 與 `assets` 的 postgres_changes，變更時 `router.refresh()`。掛在受保護 layout。
- [ ] **Step 2: 驗證**：在 Supabase 後台改一筆 → UI 自動更新。
- [ ] **Step 3: commit** — `git commit -am "feat(ui): realtime refresh on data changes"`

---

# Phase 8 — 部署上線

### Task 8.1：Vercel 部署

- [ ] **Step 1:** 推 GitHub repo；Vercel 匯入；設環境變數（同 `.env.local.example`，正式 Supabase 金鑰）。
- [ ] **Step 2:** Supabase Auth 的 redirect URL 加上 Vercel 網域與 `/auth/callback`。
- [ ] **Step 3:** 部署後用 fimmick.com 帳號登入驗證全流程。
- [ ] **Step 4:**（可選）綁自訂網域。
- [ ] **Step 5: commit/tag** — `git tag v0.1.0-mvp`

### Task 8.2：接真實平台 API（待情報齊全）

- [ ] **Step 1:** 填 `PLATFORM_API_BASE`/`PLATFORM_API_KEY`，依實際合約調整 `http.ts` 的 `triggerFlow`（同步/非同步、回傳欄位）。
- [ ] **Step 2:** 移除 Phase 6.4 / 7.2 的 mock 寫入；改由真實 flow 寫 Supabase（給 flow service_role key 與寫入契約：見 spec 第 6 節狀態 handoff）。
- [ ] **Step 3:** 端到端驗證：UI 觸發 → 平台跑 flow → flow 寫 Supabase → realtime 顯示。
- [ ] **Step 4: commit** — `git commit -am "feat: integrate real platform flow API"`

---

## 寫入契約（給住在平台的 n8n flow，對齊 spec 第 6 節）

- **Flow A（洞察→草稿）**：upsert `insights`（on conflict `fingerprint`）；對每平台 upsert `content_items`（`fingerprint=insightId:platform`, `content_status='draft'`, `generated_by='flow_a'`）。**若該筆 `human_edited=true` 則不覆蓋 `caption`。**
- **Flow B（生圖）**：只處理 `content_status='approved'` 且 `asset_status in ('none','queued')`；生成後 insert `assets`（on conflict `fingerprint`）並設 `content_items.asset_status='ready'`。
- 全部以 service_role key 寫入（繞過 RLS）。

---

## Self-Review（對照 spec）

- **Spec §3 架構**：Phase 0/2/8 建 Next+Supabase+部署；platform adapter（6.1）對映「透過平台 API 觸發」。✅
- **§5 資料模型**：四張表 = 1.1；型別 = 0.2。✅
- **§6 狀態 handoff**：content/asset 雙狀態 = schema；寫入契約段落明列 Flow A/B 行為。✅
- **§7 手動觸發 + 計費**：6.2 寫 `flow_runs`、6.3 費用確認框、無自動排程。✅
- **§8 UI**：月曆(4.2,含換月)、看板(4.3)、卡片(4.3)、詳情(5.1)、生成(6.3)。✅
- **§9 可靠性**：fingerprint UNIQUE（1.1）、AI不蓋人（3.1 + 寫入契約）、`flow_runs` 稽核。✅
- **無審核角色（最新決議）**：RLS 不分角色（1.2）、Drawer 動作不分角色（5.1）、狀態保留。✅
- **Placeholder 掃描**：除明確標示「待平台 API」的 8.2/http.ts（外部依賴，無法預先決定），無其他 TODO。
- **型別一致**：`ContentItem`/`ContentStatus`/`Platform` 等在 types.ts 定義，repo/components 引用一致；`generationCost`/`canTransition`/`createRun` 命名跨任務一致。✅

待補（依賴使用者）：平台 API 合約（8.2）、單次價格來源（cost.ts 目前硬編 $8）、圖片儲存位置。

---

## 附錄：未來加入登入（本期以 token 門禁替代）

要把正式登入加回來時：
1. 安裝 `@supabase/ssr`；新增 browser client（anon key）與 SSR cookie server client。
2. 加 `src/app/login/page.tsx`（Google OAuth, `hd: fimmick.com`）、`src/app/auth/callback/route.ts`（exchange code + 檢查 email 結尾 `@fimmick.com`）。
3. `src/middleware.ts` 改為：未登入 → 轉 `/login`（取代 token 門禁）。
4. Supabase 啟用 Google provider、設定 redirect URL；`.env.local` 補 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
5. 一般讀寫改用「使用者 session」server client（非 service_role）讓 RLS 生效；僅後端管理動作用 service_role。
6. Phase 6.2 route 改回以登入者 email 當 `triggered_by`；啟用 Phase 7.3 realtime。
