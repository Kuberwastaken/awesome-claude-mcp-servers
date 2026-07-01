# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**译文:** [English](README.md) · 简体中文 · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _这是英文 [README](README.md) 的社区翻译；英文版本为权威版本，可能更为新。_

> 精心整理、拒绝浮夸的 Model Context Protocol (MCP) 服务器目录，为 **Claude** 赋予双手与双眼——横跨 Claude Desktop、Claude Code 和 Claude API。

**[浏览可搜索的目录 →](https://kuber.studio/awesome-claude-mcp-servers/)** —— 搜索，按类别、语言和托管方式筛选，一键获取配置片段。

[Model Context Protocol](https://modelcontextprotocol.io) 是一项开放标准，用于将 AI 应用连接到外部工具、数据和服务。Claude 是**客户端（宿主）**；下方每个服务器都会向 Claude 暴露可调用的工具、资源或提示词。由于 MCP 是一项标准，其中大多数服务器同样适用于 Cursor、Codex 及其他客户端——唯一需要改动的只是配置格式。如果你使用的是 OpenAI Codex，请参阅姊妹列表：**[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**。

本列表看重**质量而非数量**：收录人们真正在用、有人维护、且把一件事做好的服务器。每个条目都带有标签，方便你按语言、运行位置以及背后的维护方快速浏览。

## 目录

- [如何阅读本列表](#如何阅读本列表)
- [Claude 快速上手](#claude-快速上手)
- [入门套件](#入门套件)
- [安全与良好习惯](#安全与良好习惯)
- [聚合器与网关](#聚合器与网关)
- [开发者工具与版本控制](#开发者工具与版本控制)
- [浏览器自动化](#浏览器自动化)
- [网络搜索与抓取](#网络搜索与抓取)
- [数据库与数据仓库](#数据库与数据仓库)
- [知识与记忆](#知识与记忆)
- [文件与文档处理](#文件与文档处理)
- [云、基础设施与 DevOps](#云基础设施与-devops)
- [监控与可观测性](#监控与可观测性)
- [安全](#安全)
- [通信](#通信)
- [生产力与项目管理](#生产力与项目管理)
- [金融与支付](#金融与支付)
- [设计与创意](#设计与创意)
- [AI、数据与分析](#ai数据与分析)
- [地图与位置](#地图与位置)
- [媒体与娱乐](#媒体与娱乐)
- [科学与研究](#科学与研究)
- [其他](#其他)
- [相关列表](#相关列表)
- [贡献](#贡献)

## 如何阅读本列表

每个条目的格式如下：

```
- [Name](link) - What it does, in one plain sentence. `Lang` `runs` `source`
```

末尾的标签是便于快速浏览的元数据：

**语言** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**运行方式** — `local` 以子进程形式通过 stdio 在你的机器上运行 · `remote` 一个托管的 HTTP 端点，让 Claude 指向它 · `local/remote` 两者皆提供

**来源** — `reference` 来自 MCP 项目的官方参考服务器 · `official` 由产品自身厂商维护 · `archived` 已归档的参考服务器，仍可使用但不再维护。没有来源标签的条目由社区维护。

没有星标，没有安装量——这些数字在写下的当天就会过时。热门程度请改看[入门套件](#入门套件)。

## Claude 快速上手

MCP 服务器通过两种传输方式连接：**stdio**（本地子进程）和**可流式传输的 HTTP**（远程端点，可选置于 OAuth 之后）。下面介绍如何将它们接入 Claude 的各个界面。

### Claude Code（CLI）

添加一个**本地（stdio）**服务器。`--` 之后的所有内容都会原封不动地传给服务器：

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

添加一个**远程（HTTP）**服务器，可附带一个可选的认证请求头：

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

向本地服务器传递环境变量（在 `--env` 和名称之间保留一个选项）：

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

使用 `--scope` 选择服务器记录在**何处**：

| 作用域 | 可用范围 | 是否与团队共享 | 存储位置 |
|-------|--------------|----------------------|-----------|
| `local`（默认） | 当前项目，仅你自己 | 否 | `~/.claude.json` |
| `project` | 当前项目，所有人 | 是，提交它 | 仓库中的 `.mcp.json` |
| `user` | 你的所有项目 | 否 | `~/.claude.json` |

一个已提交的 **`.mcp.json`**（project 作用域）如下所示，并会随仓库一同分发：

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

管理已添加的服务器：`claude mcp list`、`claude mcp get <name>`、`claude mcp remove <name>`。在会话中，`/mcp` 会显示实时状态、工具数量和 OAuth 状态。对于需要登录的远程服务器，运行 `/mcp` 并完成浏览器授权流程（或在终端中执行 `claude mcp login <name>`）。

### Claude Desktop

直接编辑配置——**Settings → Developer → Edit Config**——然后完全退出并重新启动 Claude。

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

在 `args` 中使用**绝对路径**，切勿使用相对路径。日志位于 `~/Library/Logs/Claude/`（macOS）或 `%APPDATA%\Claude\logs`（Windows）。远程/OAuth 服务器最好通过 Claude Desktop 内置的 **Connectors** 界面添加，而不是在这里手动编辑。

### Claude API

Claude 模型通过 [MCP connector](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector)（远程服务器）或 [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) 调用 MCP 工具，后者使用与 Claude Code 相同的服务器配置。

## 入门套件

你并不需要三十个服务器。工具定义会占用与实际工作相同的上下文窗口，一旦活跃工具超过约 40 个，模型就会开始选错工具。只需安装一小组与你当前工作相匹配的服务器。

**编码技术栈** —— 大多数 Claude Code 用户最终都会采用的组合：

- [Context7](https://github.com/upstash/context7) - 最新的、锁定版本的库文档，让 Claude 不再凭空猜测 API。
- [GitHub](https://github.com/github/github-mcp-server) - issue、PR、代码搜索和 Actions，让 Claude 参与到仓库协作中。
- [Playwright](https://github.com/microsoft/playwright-mcp) - 驱动并验证浏览器，用于 UI 工作和端到端检查。
- [Serena](https://github.com/oraios/serena) - 面向大型代码库的符号级代码导航与编辑。
- [Sentry](https://github.com/getsentry/sentry-mcp) - 在修复问题时拉取真实的生产环境错误和堆栈跟踪。

> Claude Code 本身已内置强大的文件、shell 和 Git 工具。在这里，Filesystem 或 Git MCP 服务器大多是多余的——请为 **Claude Desktop** 添加它们，因为那里没有这些内置工具。

**知识技术栈** —— 用于 Claude Desktop 中的研究、写作和个人自动化：

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - 将任意 URL 转换为整洁的 markdown。
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - 实时的网络事实依据。
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - 让 Claude 读写本地文件。
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 跨会话持久化事实信息。
- [Notion](https://github.com/makenotion/notion-mcp-server) 或 [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 连接你的知识库。

## 安全与良好习惯

MCP 赋予模型真实的能力。请把每个服务器都当作一个附带凭据的依赖项来对待。

- **只安装你信任的服务器。** 恶意服务器可以把指令藏在其工具描述里（工具投毒），并在你批准之后再修改它们。优先选择 `reference` 和 `official` 服务器，或者阅读源码。
- **收紧凭据权限。** 对任何生产环境，只给数据库和 API 服务器**只读**访问权限，并使用细粒度、最小权限的令牌。给智能体使用的 GitHub PAT 不应具备强制推送的能力。
- **提示注入是真实存在的。** 会读取外部内容的服务器——GitHub issue、网页、电子邮件——可能夹带试图劫持 Claude 的指令。尽可能将具备写入能力的服务器与读取内容的服务器分开。
- **注意 token 预算。** 每个服务器的工具定义在任何工作开始前就已消耗上下文；一些大型服务器会消耗数万个 token。少而精的服务器胜过大杂烩。
- **锁定版本。** 对任何敏感内容，锁定 `npx`/`uvx` 的包版本，并将本地 HTTP 服务器绑定到 `127.0.0.1`。

## 聚合器与网关

在单一端点后运行和管理多个服务器——路由、认证、工具过滤和命名空间隔离。

- [MetaMCP](https://github.com/metatool-ai/metamcp) - 将 MCP 服务器聚合为带命名空间的端点，并提供中间件、认证和图形界面。 `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - 将 MCP 服务器作为隔离、已签名的 Docker 容器来运行和管理。 `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - 在 stdio 与 SSE/可流式传输的 HTTP 之间架起桥梁，让任意服务器都能触达任意客户端。 `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - 在单一网关后联合 REST、MCP 和 A2A 工具。 `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - 面向智能体和 MCP 的数据平面代理，具备安全与治理控制。 `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - 可托管或自托管的平台，大规模地提供和管理 MCP 集成。 `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - 轻量级网关，将现有 MCP 服务器转变为受管端点。 `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - 桌面应用，用于路由、管理和聚合本地 MCP 服务器。 `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - 面向企业智能体集群的自托管 MCP 注册表与代理。 `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - 在单一 API 后聚合 MCP 服务器和 LLM 提供商的网关。 `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - 将多个 MCP 服务器聚合为单一统一端点。 `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - Meta-MCP 中枢，用于自主发现、安装和编排服务器。 `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - 将多个 MCP 服务器组合为单一负载均衡端点的代理。 `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - 统一管理服务器，提供工具与资源发现以及一个演练场。 `TS` `local`

## 开发者工具与版本控制

- [GitHub](https://github.com/github/github-mcp-server) - 管理仓库、issue、拉取请求、代码搜索和 Actions。 `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - 读取、搜索和操作本地 Git 仓库。 `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - 由语言服务器驱动的符号级代码检索与编辑。 `Py` `local`
- [Context7](https://github.com/upstash/context7) - 将最新的、特定版本的库文档注入提示词。 `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - 对整台机器进行终端控制和基于 diff 的文件编辑。 `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - 内置的 GitLab 端点，用于项目、issue、合并请求和流水线。 `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - 在安全的云沙箱中运行 LLM 生成的代码。 `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - 将智能体连接到 Postman 中的 API、集合和环境。 `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - 让智能体诊断并修复失败的 CI 构建。 `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - 管理 Buildkite 的流水线、构建和作业。 `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - 访问 Azure DevOps 的看板、仓库和流水线。 `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - 封装 GitKraken、Jira、GitHub 和 GitLab 的 CLI 与 MCP。 `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - 为智能体提供语义化代码工具：定义、引用和诊断。 `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - 面向 Gitee 的仓库、issue 和拉取请求管理。 `TS` `local` `official`

## 浏览器自动化

- [Playwright](https://github.com/microsoft/playwright-mcp) - 通过无障碍树（而非截图）驱动浏览器。 `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - 控制并检查实时运行的 Chrome，用于自动化、调试和性能追踪。 `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - 让智能体驱动真实浏览器来提取数据和完成任务。 `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - 通过 Browserbase 基础设施和 Stagehand 控制云端浏览器。 `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - AI 浏览器自动化框架，提供 act、extract 和 observe 原语。 `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - 通过配套的浏览器扩展自动化你本地的 Chrome。 `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - 社区版 Playwright 自动化，外加网页抓取工具。 `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - 使用 LLM 和计算机视觉自动化浏览器工作流。 `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - 面向智能体抓取与自动化的云端浏览器平台。 `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - 通过 Selenium WebDriver 实现浏览器自动化。 `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - 通过 Puppeteer 实现浏览器自动化和抓取。 `TS` `local` `archived`

## 网络搜索与抓取

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - 抓取一个 URL 并将其内容转换为 markdown。 `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - 为 LLM 抓取、爬取并提取结构化的网页数据。 `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - 面向智能体的神经网络网页搜索、爬取和公司调研。 `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - 为智能体调优的实时搜索、提取、站点映射和爬取。 `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - 通过 Brave API 进行网页、本地、图片、视频和新闻搜索。 `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - 通过 Perplexity Sonar 模型进行实时网络调研。 `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - 访问 Kagi 搜索与摘要 API。 `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - 通过 DuckDuckGo 进行网页搜索和页面抓取，无需 API 密钥。 `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - 查询自托管的 SearXNG 元搜索实例。 `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - 运行 Apify Store 中数以千计的抓取器和 actor 以获取网页数据。 `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - 网页解锁器、SERP 和抓取工具集。 `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - 开源、对 LLM 友好的爬虫，内置 MCP 端点。 `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - 支持动态渲染和地理定位的抓取 API。 `Py` `local/remote` `official`

## 数据库与数据仓库

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - 感知模式（schema）的 Postgres 访问，具备健康检查和安全 SQL。 `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - 查询和管理 SQLite 数据库。 `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - MySQL 访问，支持可配置权限和模式检查。 `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - 将智能体连接到 MongoDB 数据库和 Atlas 集群。 `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - 用自然语言界面管理和搜索 Redis 数据。 `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - 管理 Supabase 的 Postgres、认证、存储和边缘函数。 `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - 管理 Neon 无服务器 Postgres 的项目、分支和查询。 `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - 探索数据库并对 ClickHouse 运行只读 SQL。 `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - 查询 BigQuery，支持模式检查和 SQL 执行。 `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - 查询 Snowflake，具备读写访问和洞察追踪。 `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - DuckDB 访问，支持模式检查和只读模式。 `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - 使用 MotherDuck 和本地 DuckDB 查询数据。 `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - 管理 Prisma 数据库并运行迁移。 `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - 探索模式并对 Neo4j 图数据库运行 Cypher。 `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - 读写 Airtable base 记录，支持模式检查。 `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - 读写 NocoDB 数据库记录。 `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - 对 Elasticsearch 数据进行自然语言搜索。 `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - 查询 Tinybird 无服务器 ClickHouse 分析平台。 `Py` `local` `official`

## 知识与记忆

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 跨会话持久化的知识图谱记忆。 `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - 本地优先的 Markdown 知识库，具备持久化语义记忆。 `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - 由 mem0 支持的持久化长期智能体记忆。 `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - 由 Neo4j 支持、具备时间感知的知识图谱记忆。 `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - 在 Claude、Codex 及其他 AI 工具之间搜索并回溯过往会话与记忆。 `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - 在 Qdrant 向量引擎中存储和检索语义记忆。 `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - 对 Chroma 集合进行向量、全文和元数据搜索。 `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - 在 Milvus 数据库上进行向量、文本和混合搜索。 `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - 在 Pinecone 中搜索文档、管理索引并查询数据。 `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 读取、搜索和编辑 Obsidian 仓库中的笔记。 `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - 读取 macOS 上本地的 Apple Notes 数据库。 `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - 与 Logseq 知识图谱交互。 `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - 将 Slack、Gmail 和网页内容摄取到可搜索的知识库中。 `TS` `local/remote` `official`

## 文件与文档处理

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - 安全的本地文件操作，具备可配置的访问控制。 `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - 本地文件系统访问的 Go 实现。 `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - 在 Windows、macOS 和 Linux 上进行快速本地文件搜索。 `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - 对 Google Drive 进行文件访问和搜索。 `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - 通过 Graph API 访问 Microsoft 365 的文件、邮件和日历。 `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - 在 Box 中搜索和读取文件。 `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - 在 Markdown、HTML、PDF 和 docx 之间转换文档。 `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - 构建文档解析与摄取工作流。 `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - 上传、转换、分析和整理媒体素材。 `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - 通过 MCP 或剪贴板与 LLM 共享代码和文件上下文。 `Py` `local`

## 云、基础设施与 DevOps

- [AWS](https://github.com/awslabs/mcp) - 面向 AWS 服务、CDK、成本、文档和 Bedrock 的服务器套件。 `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - 通过 Entra ID 认证访问 Azure 服务。 `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - 覆盖 Cloudflare 开发、可观测性和安全的远程服务器。 `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - 将应用部署到 Google Cloud Run。 `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - 与 Terraform Registry 和 HCP Terraform API 交互。 `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - 通过 Automation 和 Cloud API 执行 Pulumi 基础设施即代码操作。 `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - 管理 Kubernetes 中的 pod、部署和服务。 `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Kubernetes 集群操作：pod、日志和事件。 `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - 管理容器和 Compose 堆栈。 `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - 管理 Heroku 应用、Postgres 和附加组件。 `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - 创建、构建、部署和管理 Netlify 站点。 `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - 管理 HashiCorp Nomad 的作业和集群。 `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - 与 Hetzner Cloud API 交互。 `TS` `local`

## 监控与可观测性

- [Sentry](https://github.com/getsentry/sentry-mcp) - 获取 issue、堆栈跟踪和 Seer AI 分析。 `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - 访问仪表盘、数据源、告警和事件。 `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - 使用 Axiom Processing Language 查询可观测性数据。 `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - 通过 Pydantic Logfire 访问 OpenTelemetry 的追踪和指标。 `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - 查询 VictoriaMetrics 的指标和可观测性数据。 `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - 查询 SigNoz 的指标、追踪和仪表盘。 `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - 访问崩溃报告和真实用户监控数据。 `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - 查询 Grafana Loki 的日志数据。 `Go` `local`

## 安全

- [Semgrep](https://github.com/semgrep/mcp) - 使用 Semgrep 扫描代码中的安全漏洞。 `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - 查询 Open Source Vulnerabilities 数据库。 `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - 通过 Snyk CLI 扫描仓库和项目。 `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - 集成 Burp Suite 进行 Web 安全测试。 `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - 管理 HashiCorp Vault 中的密钥和策略。 `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - 用自然语言管理 Auth0 租户。 `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - 通过 Ghidra 反编译对二进制文件进行逆向工程。 `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - 使用 IDA Pro 自动化逆向工程。 `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - 查询 Shodan 网络情报，输出结构化结果。 `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - 通过 VirusTotal API 分析文件和 URL。 `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - 访问 1Password CLI 以管理密钥和保险库。 `Rust` `local`

## 通信

- [Slack](https://github.com/korotovsky/slack-mcp-server) - 通过 stdio、SSE 和 HTTP 访问 Slack 工作区，并支持智能历史记录。 `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - 搜索、阅读和发送个人 WhatsApp 消息与媒体。 `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - 通过自动 OAuth 发送、搜索和管理 Gmail。 `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - 通过 MTProto 管理 Telegram 的对话、消息和草稿。 `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - 通过 Twilio API 发送消息和管理电话号码。 `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - 将智能体连接到 LINE 官方账号。 `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - 通过 Resend API 撰写和发送电子邮件。 `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - 与 Mailgun 邮件 API 交互，用于发送和分析。 `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - 通过 AT Protocol 查询和搜索 Bluesky 的信息流和帖子。 `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - 搜索 Intercom 的会话和联系人。 `TS` `remote` `official`

## 生产力与项目管理

- [Notion](https://github.com/makenotion/notion-mcp-server) - 读写 Notion 的页面、数据库、块和评论。 `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - 管理 Linear 的 issue、项目和周期。 `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - 通过 OAuth 访问 Jira、Confluence 和 Bitbucket。 `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - 可自托管的 Jira 和 Confluence 集成。 `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - 在 Asana Work Graph 中创建任务并进行搜索。 `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - 访问 monday.com 的看板、条目和工作流。 `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - 管理 ClickUp 的任务、文档、时间跟踪和评论。 `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - 用自然语言管理 Todoist 任务。 `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - 操作 Trello 的看板、列表和卡片。 `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - 管理 Google Calendar 事件，并支持冲突检测。 `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - 与 macOS 上的 Apple Reminders 交互。 `TS` `local`
- [Zapier](https://zapier.com/mcp) - 将智能体连接到数千款应用，实现动作和触发器。 `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - 管理 Taskade 的任务、项目和工作区。 `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - 通过 Data API 设计、组织和管理 Webflow 站点。 `TS` `local/remote` `official`

## 金融与支付

- [Stripe](https://github.com/stripe/agent-toolkit) - 通过 Stripe API 管理支付、账单和客户。 `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - 处理发票、付款、争议和订阅。 `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - 管理发票、联系人和会计数据。 `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - 将智能体连接到 Chargebee 订阅计费平台。 `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - 涵盖各类币种和交易所的加密货币价格与市场数据。 `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - 为智能体打造的股票市场与基本面数据。 `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - 通过 Alpaca API 交易股票和加密货币。 `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - 实时加密货币市场数据，无需 API 密钥。 `TS` `local`

## 设计与创意

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - 从 Figma 文件提供设计上下文和画布访问。 `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - 将 Figma 的布局和样式数据提供给编码智能体。 `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - 控制 Blender 进行 3D 建模和场景创建。 `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - 使用 AntV 可视化库生成图表。 `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - 使用 Apache ECharts 生成图表。 `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - 动态生成 Mermaid 图表。 `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - 浏览并安装 shadcn/ui 组件。 `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - 用 AI 创建演示文稿和 PowerPoint 幻灯片。 `Py` `local`

## AI、数据与分析

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - 结构化、可修订的多步推理。 `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - 访问 Hugging Face 的模型、数据集和 Spaces。 `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - 使用 Hugging Face Spaces 中的图像、音频和文本模型。 `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - 查询 GA4 分析数据。 `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - 作为单一 MCP 服务器，跨平台查询并统一数据。 `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - 基于 Vectorize 的检索、深度研究和 Markdown 提取。 `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - 查询 ZenML 中的 MLOps 和 LLMOps 流水线。 `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - 对任意输入进行多模态预测。 `Py` `local`

## 地图与位置

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - 位置服务、路线规划和地点详情。 `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - 通过 Mapbox 实现地理编码、导航和地理空间智能。 `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - 将 QGIS 连接到智能体以进行地理空间操作。 `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - IP 地理定位、网络信息和代理检测。 `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - 通过 AccuWeather API 提供天气预报。 `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - 从全球各地运行 ping、traceroute 和 DNS 探测。 `TS` `local` `official`

## 媒体与娱乐

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - 文本转语音、声音克隆和音频处理。 `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - 下载 YouTube 字幕和转录文本以供分析。 `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - 控制播放并管理曲目、专辑和播放列表。 `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - 编辑视频、进行语义搜索和转录。 `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - 启动、运行和调试 Godot 游戏引擎。 `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - 控制 Unity 编辑器并与之交互。 `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - 涵盖热门游戏的实时游戏数据。 `TS` `local/remote` `official`

## 科学与研究

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - 搜索和分析 arXiv 研究论文。 `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - 跨 PubMed 和 ClinicalTrials.gov 的生物医学研究。 `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - 搜索研究论文、会议及其关联的代码库。 `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - 搜索食物、营养成分和条形码。 `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - 封装 gget 库的生物信息学与基因组学工具集。 `Py` `local`

## 其他

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - 时间和时区转换。 `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - 演练每一项 MCP 功能的参考服务器，用于测试客户端。 `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - 通过 Home Assistant 控制智能家居设备。 `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - 用于与物联网设备交互的 MQTT 自动化中枢。 `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - 从 Congress.gov 查询美国立法数据。 `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - 起草、审阅和发送合同与模板。 `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - 按条形码、ASIN 或 URL 查询产品价格。 `TS` `local` `official`

## 相关列表

- [Model Context Protocol](https://github.com/modelcontextprotocol) - 官方协议、SDK 和参考服务器。
- [MCP Registry](https://registry.modelcontextprotocol.io) - 官方的、带命名空间的服务器注册表（预览版）。
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - 同一份目录，面向 OpenAI Codex 呈现。

## 贡献

发现了应当收录的服务器，或注意到某个失效链接？欢迎贡献——请先阅读[贡献指南](CONTRIBUTING.md)。每个拉取请求只提交一个项目，保持客观，并将其放入正确的类别。

---

本列表依据 [CC0-1.0](LICENSE) 贡献至公有领域。与 Anthropic 无隶属关系。“Claude” 是 Anthropic 的商标；此处仅用于描述兼容性。
