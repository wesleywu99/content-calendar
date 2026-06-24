# Content Calendar — 設計規格（Design Spec）

- **日期**：2026-06-24
- **狀態**：草案，待 review
- **作者**：Wesley + Claude

---

## 1. 目的（Purpose）

建立一個 **內容日曆（Content Calendar）** 產品，集中規劃並產出 小紅書 / Instagram / Facebook 三平台的貼文。系統透過 n8n flow 自動把外部洞察轉成貼文**文案與圖片草稿**，行銷團隊在一個自訂 UI 上**檢視、編輯、審核**；下游可再由其他 flow 接力做更完整的內容創作（生圖、未來生影片等）。

核心價值：**「自動產草稿 + 人工把關 + 多 flow 接力」**，內容資料集中在一個可靠、可共享的資料中樞。

---

## 2. 範圍（Scope）

### 本規格涵蓋
- 自訂 UI（Next.js）：月曆 / 看板 / 卡片 / 卡片詳情，編輯與審核。
- 資料中樞（Supabase）：內容、洞察、資產（圖片）三大資料表與其生命週期。
- 觸發與計費介接：UI 手動觸發 → 你們 AI 平台 API → 跑 priced n8n flow。
- 多 flow 共享設計：Flow A（洞察→文案草稿）、Flow B（生成圖片貼文），以及未來可擴充的下游 flow。
- 權限與可靠性設計（RLS、冪等、AI 不蓋人）。

### 不在本規格內（Non-goals）
- **自動發佈到各平台**：本系統只負責規劃與產製，發佈由人工到各平台執行。
- **n8n flow 的內部實作**：flow 建在你們的 AI 平台內；本規格只定義**資料契約**與**觸發介面**。
- **爬蟲服務**（XHS / 競品監聽）：屬獨立服務（類似既有 iFans scraper），由 Flow A 在平台端呼叫，不在此規格細節內。
- **自動排程**：明確排除。所有 flow **一律手動觸發**（每次觸發 = 一次計費）。

---

## 3. 整體架構（Architecture）

```
┌──────────────────────────────────────────────┐
│  Next.js App (Vercel)  — 自訂 UI                │
│  ├── 月曆 / 看板 / 卡片 / 卡片詳情               │
│  ├── 編輯文案、改狀態、審核                      │
│  └──【觸發更新】→ 確認框（顯示花費）→ 呼叫平台 API │
└───────────────┬──────────────────┬────────────┘
        讀/寫    │                  │ 觸發 flow（手動、計費）
                ▼                  ▼
┌───────────────────────┐  ┌──────────────────────────┐
│  Supabase（內容中樞）   │  │  你們的 AI 平台（已有）      │
│  Postgres + Auth + RLS │  │  flow 清單 + 定價 + 計費    │
│  insights / content /  │◄─┤  Flow A：洞察 → 文案草稿     │
│  assets / flow_runs    │◄─┤  Flow B：核准內容 → 生成圖片 │
│                        │◄─┤  Flow C…（未來，可擴充）    │
└───────────────────────┘  └──────────────────────────┘
        ▲
        └── 其他人的下游 flow 也讀寫同一中樞（Postgres 直連 / REST）
```

### 技術棧（鎖定）
| 層 | 技術 | 理由 |
|----|------|------|
| 前端 / UI | **Next.js + Vercel** | UI/UX 自由度最高、可用真正日曆元件、模組化、可長成產品 |
| 資料中樞 | **Supabase（Postgres）** | 讀寫可靠、多生產者/消費者、冪等（UNIQUE）、RLS 權限、realtime、免費起步 |
| 自動化引擎 | **n8n（在你們 AI 平台內）** | 計費綁定平台、無法獨立；以 priced flow 形式存在 |
| 觸發 | **平台 API（手動觸發）** | 每次觸發計費，需人工確認 |
| 登入 | **Google OAuth，限 @fimmick.com** | 內部工具，網域限定 |

---

## 4. 關鍵決策與理由（Decisions & Rationale）

1. **n8n 必須用、且一律手動觸發**：n8n 計費綁在既有 AI 平台、無法獨立；每次跑 = 一次費用，故**絕不自動排程**，每次都需使用者在 UI 確認花費後才觸發。
2. **Supabase 作為「內容中樞 / 單一真實來源（SSOT）」**：因為這是**讀寫**系統（人會改、會審）且需**多 flow 接力**，需要真資料庫的並發安全、冪等與權限。Sheet/Notion 在多寫入者下會 race / 撞配額，故不採用。
3. **一則內容 = 一平台一篇**：各平台文案/圖片可不同，月曆乾淨、易於各自審核。
4. **文案為純文字**（文字 + emoji + hashtag + 換行）：社群貼文本就無「排版」，AI 產出即最終格式。
5. **內容狀態 與 資產狀態 分離**：人工審核流程（content_status）與生圖流程（asset_status）各自獨立，讓多 flow 接力時不互踩。
6. **生圖只對「已核准」內容進行**：避免在未核准草稿上浪費生圖費用。

---

## 5. 資料模型（Supabase / Postgres Schema）

> 以下為概念性 DDL，欄位與型別可於 review 後微調。

### 5.1 列舉型別（Enums）

```sql
create type platform        as enum ('xiaohongshu', 'instagram', 'facebook');
create type insight_source  as enum ('social', 'competitor', 'trend', 'internal');
create type content_status  as enum ('idea', 'draft', 'review', 'approved');   -- 構思/草稿/待審核/已核准
create type asset_status    as enum ('none', 'queued', 'generating', 'ready', 'failed');
create type asset_type      as enum ('image', 'video');
create type flow_run_status as enum ('pending', 'running', 'succeeded', 'failed');
```

### 5.2 `insights` — 洞察庫（Flow A 寫入，人唯讀）

```sql
create table insights (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  source       insight_source not null,
  summary      text,                       -- 原文摘要
  llm_insight  text,                       -- LLM 萃取的洞察
  topics       text[] default '{}',        -- 主題/角度
  source_url   text,
  fingerprint  text unique not null,       -- 去重關鍵（同來源不重複）
  captured_at  timestamptz,
  created_at   timestamptz default now()
);
```

### 5.3 `content_items` — 內容主表（核心）

```sql
create table content_items (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  platform        platform not null,
  publish_date    date,                          -- 驅動月曆
  caption         text,                          -- 文案（人可編輯）
  content_status  content_status not null default 'draft',
  asset_status    asset_status   not null default 'none',
  insight_id      uuid references insights(id) on delete set null,
  fingerprint     text unique not null,          -- 去重（insight × platform）
  owner           text,                          -- 負責人（email / user id）
  generated_by    text,                          -- 產生此筆的 flow key（如 'flow_a'）
  human_edited    boolean not null default false,-- 人改過 → flow 不再覆蓋 caption
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
```

### 5.4 `assets` — 生成的圖片/媒體（Flow B 寫入）

```sql
create table assets (
  id               uuid primary key default gen_random_uuid(),
  content_item_id  uuid not null references content_items(id) on delete cascade,
  type             asset_type not null default 'image',
  url              text not null,                 -- Supabase Storage 或外部 CDN
  prompt           text,                          -- 生成用的 prompt
  meta             jsonb default '{}',            -- 尺寸、模型、seed 等
  fingerprint      text unique not null,          -- 冪等：同內容不重複生
  generated_by     text,                          -- flow key（如 'flow_b'）
  created_at       timestamptz default now()
);
```

### 5.5 `flow_runs` — 觸發/計費紀錄（每次手動觸發一筆）

```sql
create table flow_runs (
  id            uuid primary key default gen_random_uuid(),
  flow_key      text not null,                    -- 對應平台上的 flow
  triggered_by  text not null,                    -- 觸發者 email
  cost          numeric,                          -- 該次費用（顯示用 / 稽核）
  status        flow_run_status not null default 'pending',
  request_meta  jsonb default '{}',               -- 傳給平台的參數
  result_meta   jsonb default '{}',               -- 平台回傳/結果摘要
  error         text,
  started_at    timestamptz default now(),
  finished_at   timestamptz
);
```

---

## 6. 狀態生命週期（Pipeline / Handoff）

多個 flow 透過狀態欄位接力，互不踩踏：

```
[content_status]   idea ──► draft ──► review ──► approved
                            ▲(Flow A 寫草稿)        │
                            │                      │（人核准後）
[asset_status]              │                      ▼
                          none ──────────────► queued ──► generating ──► ready
                                                (Flow B 撈 approved 的去生圖)        │
                                                                     失敗 → failed ◄┘
```

- **Flow A（洞察 → 文案草稿）**：寫 `insights`，並建 `content_items`（`content_status='draft'`, `asset_status='none'`, `generated_by='flow_a'`）。
- **人工**：在 UI 編輯文案（會把 `human_edited=true`）、把狀態推到 `review` → `approved`。
- **Flow B（生成圖片貼文）**：只撈 `content_status='approved'` 且 `asset_status in ('none','queued')` 的內容 → 生圖 → 寫 `assets` 並把 `asset_status='ready'`。
- **未來 flow**：依相同模式新增狀態/欄位即可，**不需改動既有結構**。

---

## 7. 觸發與計費流程（Manual Trigger）

```
1. 使用者在 UI 點【觸發更新】（選擇要跑的 flow，如「抓洞察生草稿」或「生成圖片」）
2. 跳確認框：「此 flow 將花費 $X，確定執行？」
3. 確認 → Next.js API route：
     a. 在 flow_runs 寫一筆 status='pending'
     b. 呼叫你們平台 API 觸發對應 flow（帶必要參數 + 認證）
4. 平台執行 n8n flow → 寫結果進 Supabase
5. flow_runs 更新 status='succeeded'/'failed' + result_meta
6. UI 透過 Supabase realtime 或重新查詢，顯示新內容
```

- **一律手動**：無排程。每次觸發都是明確、可計費、有紀錄的動作。
- **成本透明**：確認框顯示單次費用；`flow_runs` 留稽核軌跡。

---

## 8. UI 設計（Next.js）

### 視圖
- **月曆**：用真正的日曆元件（如 FullCalendar / react-big-calendar），具月/週切換、月份跳轉、Today —— 解決 Notion 月曆導覽不友善的問題。事件依平台上色。
- **看板**：依 `content_status` 分欄，拖拉審核。
- **卡片（Gallery）**：帶圖（assets）的卡片網格。
- **卡片詳情**：文案編輯、關聯洞察、狀態切換、生成的圖片預覽。

### 互動
- 編輯文案 → 寫回 `content_items.caption` 並設 `human_edited=true`。
- 狀態切換（draft→review→approved）。
- 【觸發更新】按鈕（含費用確認），對應第 7 節流程。

### 認證與權限
- Google OAuth，限 `@fimmick.com`。
- 角色（透過 Supabase RLS）：
  - **editor**：讀、編輯文案、送審（→ review）。
  - **approver**：editor 全部 + 核准（→ approved）。
  - **viewer**：唯讀。

---

## 9. 可靠性與安全（Reliability & Security）

1. **冪等（Idempotency）**：`insights.fingerprint`、`content_items.fingerprint`、`assets.fingerprint` 皆 UNIQUE；flow 寫入用 upsert on conflict，重跑不產生重複。
2. **AI 不蓋人**：flow 更新 `caption` 前檢查 `human_edited`；為 true 則不覆蓋文案（仍可更新非文案的系統欄位）。
3. **多 flow 並發**：Postgres 交易與 row-level 處理，避免 race。
4. **存取分權**：可給外部/他人 flow 一組獨立 DB 角色或 service key，並用 GRANT/RLS 限定其只能讀內容、只能寫 `assets`。
5. **稽核**：所有觸發進 `flow_runs`，可追每次花費與結果。

---

## 10. 開放問題（需確認，主要關於平台介接）

1. **平台觸發 API**：endpoint、認證方式（API key / token）、如何指定要跑哪個 flow。
2. **同步 vs 非同步**：觸發後是同步等結果，還是要輪詢 / 由 flow 寫完 Supabase 後 UI 自取？
3. **flow 寫入位置**：確認 flow 可直接寫我們定義的 Supabase 表（建議）。
4. **單次費用**：各 flow 價格如何取得（API 提供？硬編？）以顯示在確認框。
5. **圖片儲存**：用 Supabase Storage、外部 CDN、還是平台提供的 URL。
6. **角色名單**：誰是 approver、誰是 editor。

---

## 11. 分階段交付（Phased Delivery，細節留待 implementation plan）

- **Phase 0**：Supabase 專案 + schema + 種子資料。
- **Phase 1（會走路的骨架）**：Next.js 讀 Supabase → 月曆/看板/卡片/詳情 + 編輯文案 + Google 登入。
- **Phase 2**：【觸發更新】按鈕 → 平台 API + `flow_runs` 紀錄 + 費用確認。（需平台 API 情報）
- **Phase 3**：權限（RLS 角色）+ 完整審核流程。
- **Phase 4**：資產/圖片顯示 + Flow B 介接（生成圖片貼文）。
- **Phase 5**：上線、自訂網域、收尾。

---

## 12. 附錄：與既有 Notion 原型的關係

先前在 Notion 建的「內容中心」作為**概念驗證與資料模型驗證**，其資料模型（洞察 / 內容 / 狀態 / 關聯）已對映到本規格的 Supabase schema，設計不浪費。Notion 版可作為過渡期的內部檢視，正式產品以本規格為準。
