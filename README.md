# 內容中心（Content Calendar）

團隊共用的內容日曆：在小紅書／IG／FB 的月曆 / 看板上檢視、編輯文案、推進狀態（`draft → review → approved`），並手動觸發 AI 平台 flow 生成文案與圖片。資料存於 Supabase，作為多 flow 共享的中央資料層。

## 技術棧

Next.js 16（App Router, TypeScript, React 19）· Tailwind CSS v4 · Supabase（service_role, Postgres）· date-fns · Vitest + Testing Library。

> 本期（MVP）**不做正式登入**，改用 URL token 輕量門禁（見「修訂 A」）。對外正式上線前須補正式登入。

## 環境設定

1. 建立 Supabase 專案，在 SQL Editor 依序執行：
   - `supabase/migrations/0001_init.sql`（schema：4 張表 + enums）
   - `supabase/migrations/0002_rls.sql`（RLS 政策，給未來登入用）
   - `supabase/seed.sql`（範例資料）
2. 複製 `.env.local.example` 為 `.env.local`，填入：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<專案 URL>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>
   APP_ACCESS_TOKEN=openbeauty
   ```
3. 安裝相依：
   ```bash
   npm install
   ```

## 開發 / 測試 / 建置

```bash
npm run dev        # 開發伺服器
npm run test       # 單元 / 元件測試（Vitest）
npm run test:watch
npm run build      # 正式建置
```

## 存取（token 門禁）

首次連線需在網址带上 token：

```
http://localhost:3000/?token=openbeauty
```

通過後伺服器寫入一個 httpOnly cookie（`app_access`），之後免再帶 token。未帶 token 或 token 錯誤 → 回 **401**。

> ⚠️ token 門禁只是「擋無關的人」，**不是真正的安全**：連結外洩即失效，token 也可能留在瀏覽器／伺服器 log。正式對外前請補正式登入。

## 平台觸發（mock / 真實）

- **mock 模式**（`PLATFORM_API_BASE` 留空，預設）：點「生成內容」時，`/api/flows/trigger` 會寫一筆 `flow_runs` 稽核，並直接以 service_role 寫入草稿到 Supabase（`content_items`），讓沒有真實平台的環境也能端到端 demo；「重新生成圖」會寫一筆 `assets` 並把 `asset_status` 設為 `ready`。
- **真實模式**：填 `PLATFORM_API_BASE`／`PLATFORM_API_KEY`，route 改走 `src/lib/platform/http.ts` 呼叫真實 flow（細節依實際 API 合約調整；mock fallback 保留，不會移除）。

每次觸發（無論 mock / 真實）都會寫一筆 `flow_runs`（`pending → succeeded/failed`）作稽核；`triggered_by` 暫填 `'system'`（修訂 A：無登入）。

## 專案結構

```
src/
├─ app/
│  ├─ (app)/            # 受門禁保護：儀表板 / 月曆 / 看板 + actions（server actions）
│  └─ api/flows/trigger/route.ts
├─ components/          # Sidebar, TopBar, CalendarGrid, Board, ContentCard, Queue,
│                       # ContentDrawer, GenerateModal, badges…
├─ lib/
│  ├─ domain/           # 純邏輯：status / fingerprint / cost（可單測）
│  ├─ repo/             # content / assets / insights / flowRuns（注入 SupabaseClient）
│  ├─ platform/         # adapter 介面 + mock + http
│  ├─ supabase/server.ts# service_role client
│  └─ types.ts
└─ proxy.ts             # Next 16 的 middleware（token 門禁）
```

## 設計原則

純邏輯（status / fingerprint / cost / platform）獨立於 React 與 Supabase，可單測；repo 層包住所有 DB 存取；platform adapter 以介面隔離外部系統。AI 生成不覆蓋人工編輯：`updateCaption` 會把 `human_edited` 設為 `true`。
