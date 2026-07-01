# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**翻譯:** [English](README.md) · [简体中文](README.zh-CN.md) · 繁體中文 · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _這是英文 [README](README.md) 的社群翻譯；英文版本為權威版本，可能較為新。_

> 一份精選、不浮誇的 Model Context Protocol (MCP) 伺服器目錄，為 **Claude** 賦予雙手與雙眼——涵蓋 Claude Desktop、Claude Code 與 Claude API。

**[瀏覽可搜尋的目錄 →](https://kuber.studio/awesome-claude-mcp-servers/)** — 搜尋、依類別、語言與託管方式篩選，並一鍵取得設定片段。

[Model Context Protocol](https://modelcontextprotocol.io) 是一項開放標準，用於將 AI 應用程式連接到外部工具、資料與服務。Claude 是**用戶端（主機）**；下列每個伺服器都會提供 Claude 可呼叫的工具、資源或提示。由於 MCP 是一項標準，這些伺服器大多也能在 Cursor、Codex 及其他用戶端中運作——唯一改變的只有設定格式。如果你使用 OpenAI Codex，請參閱姊妹清單：**[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**。

本清單重視**品質勝於數量**：收錄人們真正在使用、有人維護且專注把一件事做好的伺服器。每個項目都加上標籤，讓你能依語言、執行位置與背後維護者快速瀏覽。

## 目錄

- [如何閱讀本清單](#如何閱讀本清單)
- [開始使用 Claude](#開始使用-claude)
- [入門套件](#入門套件)
- [安全與良好習慣](#安全與良好習慣)
- [聚合器與閘道](#聚合器與閘道)
- [開發者工具與版本控制](#開發者工具與版本控制)
- [瀏覽器自動化](#瀏覽器自動化)
- [網頁搜尋與抓取](#網頁搜尋與抓取)
- [資料庫與資料倉儲](#資料庫與資料倉儲)
- [知識與記憶](#知識與記憶)
- [檔案與文件處理](#檔案與文件處理)
- [雲端、基礎設施與 DevOps](#雲端基礎設施與-devops)
- [監控與可觀測性](#監控與可觀測性)
- [安全性](#安全性)
- [通訊](#通訊)
- [生產力與專案管理](#生產力與專案管理)
- [金融與支付](#金融與支付)
- [設計與創意](#設計與創意)
- [AI、資料與分析](#ai資料與分析)
- [地圖與定位](#地圖與定位)
- [媒體與娛樂](#媒體與娛樂)
- [科學與研究](#科學與研究)
- [其他一切](#其他一切)
- [相關清單](#相關清單)
- [貢獻](#貢獻)

## 如何閱讀本清單

每個項目看起來像這樣：

```
- [Name](link) - What it does, in one plain sentence. `Lang` `runs` `source`
```

結尾的標籤是供快速瀏覽的中繼資料：

**語言** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**執行方式** — `local` 以子行程透過 stdio 在你的機器上執行 · `remote` 由你將 Claude 指向的託管 HTTP 端點 · `local/remote` 兩者皆提供

**來源** — `reference` 來自 MCP 專案的官方參考伺服器 · `official` 由產品自家廠商維護 · `archived` 已封存的參考伺服器，仍可使用但不再維護。沒有來源標籤的項目由社群維護。

沒有星數，也沒有安裝次數——這些數字在寫下的當天就會過時。人氣資訊改放在[入門套件](#入門套件)。

## 開始使用 Claude

MCP 伺服器透過兩種傳輸方式連接：**stdio**（本地子行程）與**串流式 HTTP**（遠端端點，可選擇置於 OAuth 之後）。以下說明如何將它們接入各個 Claude 介面。

### Claude Code (CLI)

新增一個**本地 (stdio)** 伺服器。`--` 之後的所有內容都會原封不動地交給伺服器：

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

新增一個**遠端 (HTTP)** 伺服器，並可選擇加上驗證標頭：

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

將環境變數傳遞給本地伺服器（在 `--env` 與名稱之間保留一個選項）：

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

使用 `--scope` 選擇伺服器要記錄在**哪裡**：

| 範圍 | 可用於 | 與團隊共用 | 儲存位置 |
|-------|--------------|----------------------|-----------|
| `local`（預設） | 目前專案，僅限你自己 | 否 | `~/.claude.json` |
| `project` | 目前專案，所有人 | 是，將其提交 | 儲存庫中的 `.mcp.json` |
| `user` | 你所有的專案 | 否 | `~/.claude.json` |

已提交的 **`.mcp.json`**（專案範圍）看起來如下，並會隨儲存庫一起移動：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

管理你已新增的項目：`claude mcp list`、`claude mcp get <name>`、`claude mcp remove <name>`。在工作階段中，`/mcp` 會顯示即時狀態、工具數量與 OAuth 狀態。對於需要登入的遠端伺服器，執行 `/mcp` 並完成瀏覽器流程（或在 shell 中執行 `claude mcp login <name>`）。

### Claude Desktop

直接編輯設定——**Settings → Developer → Edit Config**——然後完全結束並重新啟動 Claude。

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/Desktop",
        "/Users/you/Downloads"
      ]
    }
  }
}
```

在 `args` 中請使用**絕對路徑**，切勿使用相對路徑。日誌位於 `~/Library/Logs/Claude/`（macOS）或 `%APPDATA%\Claude\logs`（Windows）。遠端／OAuth 伺服器最好透過 Claude Desktop 內建的 **Connectors** 介面新增，而非在此手動編輯。

### Claude API

Claude 模型透過 [MCP connector](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector)（遠端伺服器）或 [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) 呼叫 MCP 工具，後者使用與 Claude Code 相同的伺服器設定。

## 入門套件

你並不需要三十個伺服器。工具定義會消耗與你實際工作相同的脈絡視窗，一旦啟用的工具超過約 40 個，模型就會開始選錯工具。只需安裝一小組符合你當前工作的伺服器即可。

**編碼組合** — 大多數 Claude Code 使用者最終都會採用的一套：

- [Context7](https://github.com/upstash/context7) - 最新且版本鎖定的函式庫文件，讓 Claude 不再靠猜測使用 API。
- [GitHub](https://github.com/github/github-mcp-server) - 議題、PR、程式碼搜尋與 Actions，讓 Claude 參與儲存庫工作。
- [Playwright](https://github.com/microsoft/playwright-mcp) - 驅動並驗證瀏覽器，處理 UI 工作與端對端檢查。
- [Serena](https://github.com/oraios/serena) - 針對大型程式碼庫的符號層級程式碼導覽與編輯。
- [Sentry](https://github.com/getsentry/sentry-mcp) - 在修復問題時拉取真實的生產環境錯誤與堆疊追蹤。

> Claude Code 已內建強大的檔案、shell 與 Git 工具。在此環境下，Filesystem 或 Git MCP 伺服器大多是多餘的——請為**沒有這些內建工具的 Claude Desktop** 新增它們。

**知識組合** — 用於 Claude Desktop 中的研究、寫作與個人自動化：

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - 將任何 URL 轉換為乾淨的 markdown。
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - 即時的網頁事實依據。
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - 讓 Claude 讀寫本地檔案。
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 跨工作階段保存事實資訊。
- [Notion](https://github.com/makenotion/notion-mcp-server) 或 [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 連接你的知識庫。

## 安全與良好習慣

MCP 賦予模型真實的能力。請把每個伺服器都當成一個附帶憑證的相依套件來看待。

- **只安裝你信任的伺服器。** 惡意伺服器可能在其工具描述中隱藏指令（工具下毒），並在你核准後加以變更。請優先選擇 `reference` 與 `official` 伺服器，或閱讀其原始碼。
- **限縮憑證權限。** 對任何生產環境，只給予資料庫與 API 伺服器**唯讀**存取權，並使用細粒度、最小權限的權杖。給代理程式使用的 GitHub PAT 不應具備強制推送（force-push）的權限。
- **提示注入是真實存在的威脅。** 會讀取外部內容的伺服器——GitHub 議題、網頁或電子郵件——可能夾帶試圖挾持 Claude 的指令。請盡可能將具寫入能力的伺服器與讀取內容的伺服器分開。
- **留意權杖預算。** 每個伺服器的工具定義在任何工作開始前就會消耗脈絡；某些大型伺服器會耗費數萬個權杖。少而精的伺服器勝過大雜燴。
- **鎖定版本。** 對任何敏感項目，請鎖定 `npx`／`uvx` 套件版本，並將本地 HTTP 伺服器綁定到 `127.0.0.1`。

## 聚合器與閘道

在單一端點後方執行並管理多個伺服器——路由、驗證、工具篩選與命名空間。

- [MetaMCP](https://github.com/metatool-ai/metamcp) - 將 MCP 伺服器聚合為具命名空間的端點，並提供中介軟體、驗證與 GUI。 `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - 以隔離、已簽章的 Docker 容器形式執行並管理 MCP 伺服器。 `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - 橋接 stdio 與 SSE／串流式 HTTP，讓任何伺服器都能連上任何用戶端。 `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - 在單一閘道後方聯合 REST、MCP 與 A2A 工具。 `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - 適用於代理程式與 MCP 的資料平面代理，具備安全與治理控制。 `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - 可託管或自架的平台，大規模提供並管理 MCP 整合。 `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - 輕量閘道，將現有的 MCP 伺服器轉為受管端點。 `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - 桌面應用程式，可路由、管理並聚合本地 MCP 伺服器。 `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - 自架的 MCP 登錄與代理，適用於企業代理程式群集。 `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - 閘道，將 MCP 伺服器與 LLM 供應商聚合於單一 API 之後。 `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - 將多個 MCP 伺服器聚合為單一統一端點。 `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - Meta-MCP 中樞，可自主探索、安裝與協調伺服器。 `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - 代理，將多個 MCP 伺服器組合為單一負載平衡端點。 `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - 統合多個伺服器，提供工具與資源探索及一個實驗場。 `TS` `local`

## 開發者工具與版本控制

- [GitHub](https://github.com/github/github-mcp-server) - 管理儲存庫、議題、拉取請求、程式碼搜尋與 Actions。 `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - 讀取、搜尋並操作本地 Git 儲存庫。 `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - 由語言伺服器驅動的符號層級程式碼檢索與編輯。 `Py` `local`
- [Context7](https://github.com/upstash/context7) - 將最新、特定版本的函式庫文件注入提示中。 `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - 終端機控制與跨機器的差異式檔案編輯。 `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - GitLab 內建端點，可存取專案、議題、合併請求與流水線。 `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - 在安全的雲端沙箱中執行 LLM 產生的程式碼。 `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - 將代理程式連接到 Postman 中的 API、集合與環境。 `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - 讓代理程式診斷並修復失敗的 CI 建置。 `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - 管理 Buildkite 的流水線、建置與工作。 `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - 存取 Azure DevOps 的看板、儲存庫與流水線。 `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - 封裝 GitKraken、Jira、GitHub 與 GitLab 的 CLI 與 MCP。 `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - 為代理程式提供語意化程式碼工具：定義、參照與診斷。 `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Gitee 的儲存庫、議題與拉取請求管理。 `TS` `local` `official`

## 瀏覽器自動化

- [Playwright](https://github.com/microsoft/playwright-mcp) - 透過無障礙樹（而非螢幕截圖）驅動瀏覽器。 `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - 控制並檢查執行中的 Chrome，用於自動化、除錯與效能追蹤。 `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - 讓代理程式驅動真實瀏覽器以擷取資料並完成任務。 `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - 透過 Browserbase 基礎設施與 Stagehand 控制雲端瀏覽器。 `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - AI 瀏覽器自動化框架，具備 act、extract 與 observe 等基本操作。 `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - 透過搭配的瀏覽器擴充功能自動化你本地的 Chrome。 `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - 社群版 Playwright 自動化，並附帶網頁抓取工具。 `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - 運用 LLM 與電腦視覺自動化瀏覽器工作流程。 `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - 雲端瀏覽器平台，供代理程式抓取與自動化使用。 `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - 透過 Selenium WebDriver 進行瀏覽器自動化。 `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - 透過 Puppeteer 進行瀏覽器自動化與抓取。 `TS` `local` `archived`

## 網頁搜尋與抓取

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - 擷取 URL 並將其內容轉換為 markdown。 `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - 為 LLM 抓取、爬取並擷取結構化的網頁資料。 `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - 為代理程式提供神經網路網頁搜尋、爬取與公司研究。 `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - 為代理程式調校的即時搜尋、擷取、映射與爬取。 `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - 透過 Brave API 進行網頁、在地、圖片、影片與新聞搜尋。 `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - 透過 Perplexity Sonar 模型進行即時網頁研究。 `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - 存取 Kagi 搜尋與摘要 API。 `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - 透過 DuckDuckGo 進行網頁搜尋與頁面擷取，無需 API 金鑰。 `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - 查詢自架的 SearXNG 元搜尋實例。 `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - 執行 Apify Store 中數千個抓取器與 actor 以取得網頁資料。 `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - 網頁解鎖器、SERP 與抓取工具組。 `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - 開源、對 LLM 友善的爬蟲，內建 MCP 端點。 `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - 具備動態渲染與地理定位的抓取 API。 `Py` `local/remote` `official`

## 資料庫與資料倉儲

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - 具結構描述感知的 Postgres 存取，附健康檢查與安全 SQL。 `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - 查詢並管理 SQLite 資料庫。 `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - MySQL 存取，具可設定的權限與結構描述檢查。 `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - 將代理程式連接到 MongoDB 資料庫與 Atlas 叢集。 `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - 以自然語言介面管理並搜尋 Redis 資料。 `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - 管理 Supabase 的 Postgres、驗證、儲存與邊緣函式。 `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - 管理 Neon 無伺服器 Postgres 的專案、分支與查詢。 `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - 探索資料庫並對 ClickHouse 執行唯讀 SQL。 `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - 查詢 BigQuery，具結構描述檢查與 SQL 執行。 `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - 查詢 Snowflake，具讀寫存取與洞察追蹤。 `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - DuckDB 存取，具結構描述檢查與唯讀模式。 `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - 透過 MotherDuck 與本地 DuckDB 查詢資料。 `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - 管理 Prisma 資料庫並執行遷移。 `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - 探索結構描述並對 Neo4j 圖形資料庫執行 Cypher。 `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - 讀寫 Airtable base 紀錄，並具結構描述檢查。 `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - 讀寫 NocoDB 資料庫紀錄。 `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - 以自然語言搜尋 Elasticsearch 資料。 `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - 查詢 Tinybird 無伺服器 ClickHouse 分析平台。 `Py` `local` `official`

## 知識與記憶

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 跨工作階段的持久化知識圖譜記憶。 `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - 本地優先的 Markdown 知識庫，具持久化語意記憶。 `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - 由 mem0 支援的持久化長期代理程式記憶。 `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - 以 Neo4j 為後端、具時間感知的知識圖譜記憶。 `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - 跨 Claude、Codex 及其他 AI 工具搜尋並回想過往工作階段與記憶。 `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - 在 Qdrant 向量引擎中儲存並檢索語意記憶。 `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - 對 Chroma 集合進行向量、全文與中繼資料搜尋。 `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - 在 Milvus 資料庫上進行向量、文字與混合搜尋。 `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - 在 Pinecone 中搜尋文件、管理索引並查詢資料。 `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 讀取、搜尋並編輯 Obsidian 保管庫中的筆記。 `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - 讀取 macOS 上本地的 Apple Notes 資料庫。 `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - 與 Logseq 知識圖譜互動。 `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - 將 Slack、Gmail 與網頁內容匯入可搜尋的知識庫。 `TS` `local/remote` `official`

## 檔案與文件處理

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - 安全的本地檔案操作，具可設定的存取控制。 `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - 本地檔案系統存取的 Go 實作。 `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - 跨 Windows、macOS 與 Linux 的快速本地檔案搜尋。 `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - Google Drive 的檔案存取與搜尋。 `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - 透過 Graph API 存取 Microsoft 365 的檔案、郵件與行事曆。 `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - 搜尋並讀取 Box 中的檔案。 `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - 在 Markdown、HTML、PDF 與 docx 之間轉換文件。 `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - 建構文件解析與匯入工作流程。 `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - 上傳、轉換、分析並整理媒體素材。 `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - 透過 MCP 或剪貼簿與 LLM 分享程式碼與檔案脈絡。 `Py` `local`

## 雲端、基礎設施與 DevOps

- [AWS](https://github.com/awslabs/mcp) - 一套涵蓋 AWS 服務、CDK、成本、文件與 Bedrock 的伺服器。 `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - 以 Entra ID 驗證存取 Azure 服務。 `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - 橫跨 Cloudflare 開發、可觀測性與安全的遠端伺服器。 `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - 將應用程式部署到 Google Cloud Run。 `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - 與 Terraform Registry 及 HCP Terraform API 互動。 `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - 透過 Automation 與 Cloud API 執行 Pulumi 基礎設施即程式碼操作。 `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - 管理 Kubernetes 中的 pod、部署與服務。 `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Kubernetes 叢集操作：pod、日誌與事件。 `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - 管理容器與 Compose 堆疊。 `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - 管理 Heroku 應用程式、Postgres 與附加元件。 `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - 建立、建置、部署並管理 Netlify 網站。 `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - 管理 HashiCorp Nomad 的工作與叢集。 `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - 與 Hetzner Cloud API 互動。 `TS` `local`

## 監控與可觀測性

- [Sentry](https://github.com/getsentry/sentry-mcp) - 擷取議題、堆疊追蹤與 Seer AI 分析。 `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - 存取儀表板、資料來源、警示與事件。 `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - 使用 Axiom Processing Language 查詢可觀測性資料。 `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - 透過 Pydantic Logfire 存取 OpenTelemetry 追蹤與指標。 `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - 查詢 VictoriaMetrics 的指標與可觀測性資料。 `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - 查詢 SigNoz 的指標、追蹤與儀表板。 `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - 存取當機回報與真實使用者監控資料。 `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - 查詢 Grafana Loki 的日誌資料。 `Go` `local`

## 安全性

- [Semgrep](https://github.com/semgrep/mcp) - 使用 Semgrep 掃描程式碼中的安全漏洞。 `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - 查詢開源漏洞（OSV）資料庫。 `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - 透過 Snyk CLI 掃描儲存庫與專案。 `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - 整合 Burp Suite 進行網頁安全測試。 `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - 管理 HashiCorp Vault 中的機密與政策。 `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - 以自然語言管理 Auth0 租戶。 `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - 透過 Ghidra 反編譯逆向工程二進位檔。 `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - 使用 IDA Pro 自動化逆向工程。 `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - 查詢 Shodan 網路情報並取得結構化輸出。 `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - 透過 VirusTotal API 分析檔案與 URL。 `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - 存取 1Password CLI 以管理機密與保管庫。 `Rust` `local`

## 通訊

- [Slack](https://github.com/korotovsky/slack-mcp-server) - 透過 stdio、SSE 與 HTTP 存取 Slack 工作區，並具智慧歷史紀錄。 `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - 搜尋、讀取並傳送個人 WhatsApp 訊息與媒體。 `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - 傳送、搜尋並管理 Gmail，具自動 OAuth。 `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - 透過 MTProto 管理 Telegram 的對話、訊息與草稿。 `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - 透過 Twilio API 傳送訊息並管理電話號碼。 `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - 將代理程式連接到 LINE 官方帳號。 `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - 透過 Resend API 撰寫並傳送電子郵件。 `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - 與 Mailgun 電子郵件 API 互動，用於傳送與分析。 `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - 透過 AT Protocol 查詢並搜尋 Bluesky 的動態與貼文。 `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - 搜尋 Intercom 的對話與聯絡人。 `TS` `remote` `official`

## 生產力與專案管理

- [Notion](https://github.com/makenotion/notion-mcp-server) - 讀寫 Notion 的頁面、資料庫、區塊與留言。 `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - 管理 Linear 的議題、專案與週期。 `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - 透過 OAuth 存取 Jira、Confluence 與 Bitbucket。 `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - 可自架的 Jira 與 Confluence 整合。 `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - 建立任務並跨 Asana Work Graph 搜尋。 `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - 存取 monday.com 的看板、項目與工作流程。 `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - 管理 ClickUp 的任務、文件、時間追蹤與留言。 `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - 以自然語言管理 Todoist 任務。 `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - 操作 Trello 的看板、清單與卡片。 `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - 管理 Google Calendar 事件，具衝突偵測。 `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - 與 macOS 上的 Apple Reminders 互動。 `TS` `local`
- [Zapier](https://zapier.com/mcp) - 將代理程式連接到數千個應用程式以執行動作與觸發器。 `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - 管理 Taskade 的任務、專案與工作區。 `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - 透過 Data API 設計、建構並管理 Webflow 網站。 `TS` `local/remote` `official`

## 金融與支付

- [Stripe](https://github.com/stripe/agent-toolkit) - 透過 Stripe API 管理付款、帳單與客戶。 `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - 處理發票、付款、爭議與訂閱。 `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - 管理發票、聯絡人與會計資料。 `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - 將代理程式連接到 Chargebee 訂閱計費平台。 `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - 跨幣種與交易所的加密貨幣價格與市場資料。 `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - 為代理程式打造的股市與基本面資料。 `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - 透過 Alpaca API 交易股票與加密貨幣。 `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - 即時加密貨幣市場資料，無需 API 金鑰。 `TS` `local`

## 設計與創意

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - 從 Figma 檔案提供設計脈絡與畫布存取。 `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - 將 Figma 的版面配置與樣式資料提供給編碼代理程式。 `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - 控制 Blender 進行 3D 建模與場景建立。 `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - 使用 AntV 視覺化函式庫產生圖表。 `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - 使用 Apache ECharts 產生圖表。 `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - 動態產生 Mermaid 圖表。 `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - 瀏覽並安裝 shadcn/ui 元件。 `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - 以 AI 建立簡報與 PowerPoint 投影片。 `Py` `local`

## AI、資料與分析

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - 結構化、可修訂的多步驟推理。 `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - 存取 Hugging Face 的模型、資料集與 Spaces。 `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - 使用 Hugging Face Spaces 的圖片、音訊與文字模型。 `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - 查詢 GA4 分析資料。 `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - 以單一 MCP 伺服器跨平台查詢並統合資料。 `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - 在 Vectorize 上進行檢索、深度研究與 Markdown 擷取。 `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - 查詢 ZenML 中的 MLOps 與 LLMOps 流水線。 `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - 跨任意輸入的多模態預測與預估。 `Py` `local`

## 地圖與定位

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - 定位服務、路線與地點詳細資訊。 `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - 透過 Mapbox 提供地理編碼、導航與地理空間情報。 `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - 將 QGIS 連接到代理程式以進行地理空間操作。 `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - IP 地理定位、網路資訊與代理伺服器偵測。 `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - 透過 AccuWeather API 提供天氣預報。 `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - 從全球各地執行 ping、traceroute 與 DNS 探測。 `TS` `local` `official`

## 媒體與娛樂

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - 文字轉語音、語音複製與音訊處理。 `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - 下載 YouTube 字幕與逐字稿以供分析。 `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - 控制播放並管理曲目、專輯與播放清單。 `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - 編輯影片、進行語意搜尋並轉錄。 `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - 啟動、執行並除錯 Godot 遊戲引擎。 `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - 控制 Unity 編輯器並與之互動。 `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - 跨熱門遊戲的即時遊戲統計。 `TS` `local/remote` `official`

## 科學與研究

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - 搜尋並分析 arXiv 研究論文。 `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - 橫跨 PubMed 與 ClinicalTrials.gov 的生物醫學研究。 `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - 搜尋研究論文、會議與相關的程式碼庫。 `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - 搜尋食物、營養成分與條碼。 `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - 封裝 gget 函式庫的生物資訊與基因體學工具組。 `Py` `local`

## 其他一切

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - 時間與時區轉換。 `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - 演練所有 MCP 功能的參考伺服器，用於測試用戶端。 `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - 透過 Home Assistant 控制智慧家庭裝置。 `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - 用於與 IoT 裝置互動的 MQTT 自動化中樞。 `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - 從 Congress.gov 查詢美國立法資料。 `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - 起草、審閱並傳送合約與範本。 `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - 依條碼、ASIN 或 URL 查詢商品定價。 `TS` `local` `official`

## 相關清單

- [Model Context Protocol](https://github.com/modelcontextprotocol) - 官方協定、SDK 與參考伺服器。
- [MCP Registry](https://registry.modelcontextprotocol.io) - 官方、具命名空間的伺服器登錄（預覽版）。
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - 同一份目錄，為 OpenAI Codex 量身呈現。

## 貢獻

發現了應收錄於此的伺服器，或找到了失效連結嗎？歡迎貢獻——請先閱讀[貢獻指南](CONTRIBUTING.md)。每個拉取請求只提交一個專案，保持客觀，並將其放入正確的類別。

---

本清單依據 [CC0-1.0](LICENSE) 貢獻至公有領域。與 Anthropic 無隸屬關係。「Claude」為 Anthropic 的商標；此處僅用於描述相容性。
