# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated, hype-free catalog of Model Context Protocol (MCP) servers that give **Claude** hands and eyes — across Claude Desktop, Claude Code, and the Claude API.

**[Browse the searchable directory →](https://kuber.studio/awesome-claude-mcp-servers/)** — search, filter by category, language, and hosting, and grab a config snippet in one click.

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard for connecting AI apps to external tools, data, and services. Claude is the **client (host)**; each server below exposes tools, resources, or prompts that Claude can call. Because MCP is a standard, most of these servers also work in Cursor, Codex, and other clients — the only thing that changes is the config format. If you're on OpenAI Codex, see the sibling list: **[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**.

This list favors **signal over volume**: servers that people actually run, that are maintained, and that do one thing well. Every entry is tagged so you can scan by language, where it runs, and who stands behind it.

## Contents

- [How to read this list](#how-to-read-this-list)
- [Getting started with Claude](#getting-started-with-claude)
- [Starter kits](#starter-kits)
- [Safety and good hygiene](#safety-and-good-hygiene)
- [Aggregators and gateways](#aggregators-and-gateways)
- [Developer tools and version control](#developer-tools-and-version-control)
- [Browser automation](#browser-automation)
- [Web search and scraping](#web-search-and-scraping)
- [Databases and data warehouses](#databases-and-data-warehouses)
- [Knowledge and memory](#knowledge-and-memory)
- [Files and document handling](#files-and-document-handling)
- [Cloud, infrastructure and devops](#cloud-infrastructure-and-devops)
- [Monitoring and observability](#monitoring-and-observability)
- [Security](#security)
- [Communication](#communication)
- [Productivity and project management](#productivity-and-project-management)
- [Finance and payments](#finance-and-payments)
- [Design and creative](#design-and-creative)
- [AI, data and analytics](#ai-data-and-analytics)
- [Maps and location](#maps-and-location)
- [Media and entertainment](#media-and-entertainment)
- [Science and research](#science-and-research)
- [Everything else](#everything-else)
- [Related lists](#related-lists)
- [Contributing](#contributing)

## How to read this list

Every entry looks like this:

```
- [Name](link) - What it does, in one plain sentence. `Lang` `runs` `source`
```

The trailing tags are the fast-scan metadata:

**Language** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**Runs** — `local` runs on your machine as a subprocess over stdio · `remote` a hosted HTTP endpoint you point Claude at · `local/remote` ships both

**Source** — `reference` an official reference server from the MCP project · `official` maintained by the product's own vendor · `archived` an archived reference server, still usable but no longer maintained. Entries with no source tag are community-maintained.

No stars, no install counts — those go stale the day you write them. Popularity lives in the [Starter kits](#starter-kits) instead.

## Getting started with Claude

MCP servers connect over two transports: **stdio** (a local subprocess) and **streamable HTTP** (a remote endpoint, optionally behind OAuth). Here's how to wire them into each Claude surface.

### Claude Code (CLI)

Add a **local (stdio)** server. Everything after `--` is handed to the server untouched:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

Add a **remote (HTTP)** server, with an optional auth header:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

Pass environment variables to a local server (keep an option between `--env` and the name):

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

Choose **where** a server is remembered with `--scope`:

| Scope | Available in | Shared with your team | Stored in |
|-------|--------------|----------------------|-----------|
| `local` (default) | the current project, just you | no | `~/.claude.json` |
| `project` | the current project, everyone | yes, commit it | `.mcp.json` in the repo |
| `user` | all your projects | no | `~/.claude.json` |

A committed **`.mcp.json`** (project scope) looks like this and travels with the repo:

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

Manage what you've added: `claude mcp list`, `claude mcp get <name>`, `claude mcp remove <name>`. Inside a session, `/mcp` shows live status, tool counts, and OAuth state. For remote servers that need login, run `/mcp` and complete the browser flow (or `claude mcp login <name>` from the shell).

### Claude Desktop

Edit the config directly — **Settings → Developer → Edit Config** — then fully quit and relaunch Claude.

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

Use **absolute paths** in `args`, never relative ones. Logs live at `~/Library/Logs/Claude/` (macOS) or `%APPDATA%\Claude\logs` (Windows). Remote/OAuth servers are best added through Claude Desktop's built-in **Connectors** UI rather than hand-edited here.

### Claude API

Claude models call MCP tools through the [MCP connector](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector) (remote servers) or the [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), which speaks the same server configs as Claude Code.

## Starter kits

You do not want thirty servers. Tool definitions are spent from the same context window as your actual work, and past roughly 40 active tools the model starts reaching for the wrong one. Install a small set that matches what you're doing.

**The coding stack** — what most Claude Code users converge on:

- [Context7](https://github.com/upstash/context7) - up-to-date, version-pinned library docs so Claude stops guessing APIs.
- [GitHub](https://github.com/github/github-mcp-server) - issues, PRs, code search, and Actions, so Claude participates in the repo.
- [Playwright](https://github.com/microsoft/playwright-mcp) - drive and verify a browser for UI work and end-to-end checks.
- [Serena](https://github.com/oraios/serena) - symbol-level code navigation and edits for large codebases.
- [Sentry](https://github.com/getsentry/sentry-mcp) - pull real production errors and stack traces while you fix them.

> Claude Code already has strong built-in file, shell, and Git tools. A Filesystem or Git MCP server is mostly redundant there — add them for **Claude Desktop**, where those built-ins don't exist.

**The knowledge stack** — for research, writing, and personal automation in Claude Desktop:

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - turn any URL into clean markdown.
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - real-time web grounding.
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - let Claude read and write local files.
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - persist facts across sessions.
- [Notion](https://github.com/makenotion/notion-mcp-server) or [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - connect your knowledge base.

## Safety and good hygiene

MCP hands a model real capabilities. Treat every server like a dependency you're installing with credentials attached.

- **Install servers you trust.** A malicious server can hide instructions inside its tool descriptions (tool poisoning) and can change them after you approve it. Prefer `reference` and `official` servers, or read the source.
- **Scope credentials down.** Give database and API servers **read-only** access to anything production, and use fine-grained, least-privilege tokens. A GitHub PAT for an agent should not be able to force-push.
- **Prompt injection is real.** A server that reads external content — a GitHub issue, a web page, an email — can carry instructions that try to hijack Claude. Keep write-capable and content-reading servers separate where you can.
- **Mind the token budget.** Each server's tool definitions cost context before any work happens; some large servers cost tens of thousands of tokens. Fewer, sharper servers beat a kitchen sink.
- **Pin versions.** Pin `npx`/`uvx` package versions for anything sensitive, and bind local HTTP servers to `127.0.0.1`.

## Aggregators and gateways

Run and manage many servers behind one endpoint — routing, auth, tool filtering, and namespacing.

- [MetaMCP](https://github.com/metatool-ai/metamcp) - Aggregate MCP servers into namespaced endpoints with middleware, auth, and a GUI. `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - Run and manage MCP servers as isolated, signed Docker containers. `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - Bridge stdio and SSE/streamable-HTTP so any server reaches any client. `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - Federate REST, MCP, and A2A tools behind a single gateway. `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - Data-plane proxy for agents and MCP with security and governance controls. `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - Hosted or self-hosted platform that serves and manages MCP integrations at scale. `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - Lightweight gateway that turns existing MCP servers into managed endpoints. `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - Desktop app that routes, manages, and aggregates local MCP servers. `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - Self-hosted MCP registry and proxy for enterprise agent fleets. `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - Gateway that aggregates MCP servers and LLM providers behind one API. `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - Aggregate multiple MCP servers into a single unified endpoint. `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - Meta-MCP hub for autonomous discovery, install, and orchestration of servers. `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - Proxy that composes many MCP servers into one load-balanced endpoint. `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - Unify servers with tool and resource discovery plus a playground. `TS` `local`

## Developer tools and version control

- [GitHub](https://github.com/github/github-mcp-server) - Manage repositories, issues, pull requests, code search, and Actions. `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - Read, search, and manipulate local Git repositories. `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - Symbol-level code retrieval and editing powered by language servers. `Py` `local`
- [Context7](https://github.com/upstash/context7) - Inject up-to-date, version-specific library documentation into prompts. `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - Terminal control and diff-based file edits across your machine. `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - Built-in GitLab endpoint for projects, issues, merge requests, and pipelines. `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - Run LLM-generated code in secure cloud sandboxes. `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - Connect agents to APIs, collections, and environments in Postman. `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - Let agents diagnose and fix failing CI builds. `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - Manage Buildkite pipelines, builds, and jobs. `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - Access Azure DevOps boards, repos, and pipelines. `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - CLI and MCP wrapping GitKraken, Jira, GitHub, and GitLab. `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - Give agents semantic code tools: definitions, references, and diagnostics. `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Repository, issue, and pull-request management for Gitee. `TS` `local` `official`

## Browser automation

- [Playwright](https://github.com/microsoft/playwright-mcp) - Drive a browser through the accessibility tree instead of screenshots. `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - Control and inspect a live Chrome for automation, debugging, and perf tracing. `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - Let agents drive a real browser to extract data and complete tasks. `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - Control a cloud browser via Browserbase infrastructure and Stagehand. `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - AI browser-automation framework with act, extract, and observe primitives. `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - Automate your local Chrome through a companion browser extension. `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - Community Playwright automation plus web-scraping tools. `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - Automate browser workflows using LLMs and computer vision. `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - Cloud browser platform for agent scraping and automation. `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - Browser automation through the Selenium WebDriver. `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - Browser automation and scraping via Puppeteer. `TS` `local` `archived`

## Web search and scraping

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - Fetch a URL and convert its content to markdown. `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - Scrape, crawl, and extract structured web data for LLMs. `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - Neural web search, crawling, and company research for agents. `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - Real-time search, extract, map, and crawl tuned for agents. `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - Web, local, image, video, and news search via the Brave API. `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - Real-time web research via Perplexity Sonar models. `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - Kagi search and summarizer API access. `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - Web search and page fetch through DuckDuckGo, no API key. `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - Query a self-hosted SearXNG metasearch instance. `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - Run thousands of Apify Store scrapers and actors for web data. `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - Web unlocker, SERP, and scraping toolkit. `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - Open-source, LLM-friendly crawler with a built-in MCP endpoint. `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - Scraping API with dynamic rendering and geo-targeting. `Py` `local/remote` `official`

## Databases and data warehouses

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - Schema-aware Postgres access with health checks and safe SQL. `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - Query and manage SQLite databases. `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - MySQL access with configurable permissions and schema inspection. `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - Connect agents to MongoDB databases and Atlas clusters. `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - Natural-language interface to manage and search Redis data. `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - Manage Supabase Postgres, auth, storage, and edge functions. `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - Manage Neon serverless Postgres projects, branches, and queries. `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - Explore databases and run read-only SQL against ClickHouse. `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - Query BigQuery with schema inspection and SQL execution. `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - Query Snowflake with read/write access and insight tracking. `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - DuckDB access with schema inspection and read-only mode. `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - Query data with MotherDuck and local DuckDB. `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - Manage Prisma databases and run migrations. `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - Explore schema and run Cypher against Neo4j graph databases. `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - Read and write Airtable base records with schema inspection. `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - Read and write NocoDB database records. `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - Natural-language search over Elasticsearch data. `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - Query the Tinybird serverless ClickHouse analytics platform. `Py` `local` `official`

## Knowledge and memory

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Persistent knowledge-graph memory across sessions. `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - Local-first Markdown knowledge base with persistent semantic memory. `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - Persistent long-term agent memory backed by mem0. `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - Neo4j-backed knowledge-graph memory with temporal awareness. `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - Search and recall past sessions and memory across Claude, Codex, and other AI tools. `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - Store and retrieve semantic memories in the Qdrant vector engine. `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - Vector, full-text, and metadata search over Chroma collections. `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - Vector, text, and hybrid search on the Milvus database. `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - Search docs, manage indexes, and query data in Pinecone. `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - Read, search, and edit notes in an Obsidian vault. `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - Read from the local Apple Notes database on macOS. `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - Interact with a Logseq knowledge graph. `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - Ingest Slack, Gmail, and web content into a searchable knowledge base. `TS` `local/remote` `official`

## Files and document handling

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Secure local file operations with configurable access controls. `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - Go implementation of local filesystem access. `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - Fast local file search across Windows, macOS, and Linux. `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - File access and search for Google Drive. `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - Access Microsoft 365 files, mail, and calendar via Graph API. `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - Search and read files in Box. `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - Convert documents between Markdown, HTML, PDF, and docx. `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - Build document parsing and ingestion workflows. `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - Upload, transform, analyze, and organize media assets. `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - Share code and file context with LLMs via MCP or clipboard. `Py` `local`

## Cloud, infrastructure and devops

- [AWS](https://github.com/awslabs/mcp) - Suite of servers for AWS services, CDK, cost, docs, and Bedrock. `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - Access Azure services with Entra ID authentication. `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - Remote servers across Cloudflare dev, observability, and security. `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - Deploy applications to Google Cloud Run. `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - Interact with the Terraform Registry and HCP Terraform APIs. `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - Execute Pulumi infrastructure-as-code operations via the Automation and Cloud APIs. `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - Manage pods, deployments, and services in Kubernetes. `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Kubernetes cluster operations: pods, logs, and events. `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - Manage containers and Compose stacks. `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - Manage Heroku apps, Postgres, and add-ons. `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - Create, build, deploy, and manage Netlify sites. `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - Manage HashiCorp Nomad jobs and clusters. `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - Interact with the Hetzner Cloud API. `TS` `local`

## Monitoring and observability

- [Sentry](https://github.com/getsentry/sentry-mcp) - Retrieve issues, stack traces, and Seer AI analysis. `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - Access dashboards, datasources, alerts, and incidents. `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - Query observability data using Axiom Processing Language. `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - Access OpenTelemetry traces and metrics via Pydantic Logfire. `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - Query VictoriaMetrics metrics and observability data. `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - Query SigNoz metrics, traces, and dashboards. `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - Access crash-reporting and real-user-monitoring data. `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - Query Grafana Loki log data. `Go` `local`

## Security

- [Semgrep](https://github.com/semgrep/mcp) - Scan code for security vulnerabilities with Semgrep. `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - Query the Open Source Vulnerabilities database. `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - Scan repositories and projects via the Snyk CLI. `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - Integrate Burp Suite for web security testing. `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - Manage secrets and policies in HashiCorp Vault. `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - Manage Auth0 tenants with natural language. `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Reverse-engineer binaries through Ghidra decompilation. `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - Automate reverse engineering with IDA Pro. `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - Query Shodan network intelligence with structured output. `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - Analyze files and URLs via the VirusTotal API. `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - Access the 1Password CLI to manage secrets and vaults. `Rust` `local`

## Communication

- [Slack](https://github.com/korotovsky/slack-mcp-server) - Access Slack workspaces over stdio, SSE, and HTTP with smart history. `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - Search, read, and send personal WhatsApp messages and media. `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - Send, search, and manage Gmail with automatic OAuth. `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - Manage Telegram dialogs, messages, and drafts over MTProto. `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - Send messages and manage phone numbers via Twilio APIs. `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - Connect an agent to a LINE Official Account. `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - Compose and send email through the Resend API. `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - Interact with the Mailgun email API for sending and analytics. `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - Query and search Bluesky feeds and posts over the AT Protocol. `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - Search Intercom conversations and contacts. `TS` `remote` `official`

## Productivity and project management

- [Notion](https://github.com/makenotion/notion-mcp-server) - Read and write Notion pages, databases, blocks, and comments. `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - Manage Linear issues, projects, and cycles. `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - Access Jira, Confluence, and Bitbucket via OAuth. `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - Self-hostable Jira and Confluence integration. `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - Create tasks and search across the Asana Work Graph. `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - Access monday.com boards, items, and workflows. `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - Manage ClickUp tasks, docs, time tracking, and comments. `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - Manage Todoist tasks with natural language. `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - Work with Trello boards, lists, and cards. `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - Manage Google Calendar events with conflict detection. `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - Interact with Apple Reminders on macOS. `TS` `local`
- [Zapier](https://zapier.com/mcp) - Connect agents to thousands of apps for actions and triggers. `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - Manage Taskade tasks, projects, and workspaces. `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - Design, structure, and manage Webflow sites via the Data API. `TS` `local/remote` `official`

## Finance and payments

- [Stripe](https://github.com/stripe/agent-toolkit) - Manage payments, billing, and customers via the Stripe API. `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - Handle invoices, payments, disputes, and subscriptions. `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - Manage invoices, contacts, and accounting data. `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - Connect agents to the Chargebee subscription-billing platform. `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - Crypto price and market data across coins and exchanges. `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - Stock-market and fundamentals data built for agents. `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - Trade stocks and crypto through Alpaca APIs. `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - Real-time cryptocurrency market data, no API key. `TS` `local`

## Design and creative

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - Provide design context and canvas access from Figma files. `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - Feed Figma layout and styling data to coding agents. `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - Control Blender for 3D modeling and scene creation. `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - Generate charts with the AntV visualization library. `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - Generate charts with Apache ECharts. `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - Generate Mermaid diagrams dynamically. `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - Browse and install shadcn/ui components. `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - Create presentations and PowerPoint decks with AI. `Py` `local`

## AI, data and analytics

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - Structured, revisable multi-step reasoning. `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - Access Hugging Face models, datasets, and Spaces. `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - Use Hugging Face Spaces for image, audio, and text models. `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - Query GA4 analytics data. `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - Query and unify data across platforms as one MCP server. `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - Retrieval, deep research, and Markdown extraction over Vectorize. `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - Query MLOps and LLMOps pipelines in ZenML. `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - Multimodal forecasting and prediction across arbitrary inputs. `Py` `local`

## Maps and location

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - Location services, directions, and place details. `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - Geocoding, navigation, and geospatial intelligence via Mapbox. `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - Connect QGIS to agents for geospatial operations. `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - IP geolocation, network info, and proxy detection. `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - Weather forecasts via the AccuWeather API. `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - Run ping, traceroute, and DNS probes from global locations. `TS` `local` `official`

## Media and entertainment

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - Text-to-speech, voice cloning, and audio processing. `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - Download YouTube subtitles and transcripts for analysis. `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - Control playback and manage tracks, albums, and playlists. `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - Edit video, run semantic search, and transcribe. `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - Launch, run, and debug the Godot game engine. `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - Control and interact with the Unity editor. `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - Real-time gaming stats across popular titles. `TS` `local/remote` `official`

## Science and research

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - Search and analyze arXiv research papers. `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - Biomedical research across PubMed and ClinicalTrials.gov. `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - Search research papers, conferences, and associated codebases. `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - Search foods, nutrition facts, and barcodes. `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - Bioinformatics and genomics toolkit wrapping the gget library. `Py` `local`

## Everything else

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - Time and timezone conversion. `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - Reference server exercising every MCP feature, for testing clients. `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - Control smart-home devices through Home Assistant. `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - MQTT automation hub for interacting with IoT devices. `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - Query US legislative data from Congress.gov. `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - Draft, review, and send contracts and templates. `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - Look up product pricing by barcode, ASIN, or URL. `TS` `local` `official`

## Related lists

- [Model Context Protocol](https://github.com/modelcontextprotocol) - The official protocol, SDKs, and reference servers.
- [MCP Registry](https://registry.modelcontextprotocol.io) - The official, namespaced server registry (preview).
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - The same catalog, framed for OpenAI Codex.

## Contributing

Found a server that belongs here, or spotted a dead link? Contributions are welcome — please read the [contribution guidelines](CONTRIBUTING.md) first. One project per pull request, keep it objective, and place it in the right category.

---

This list is dedicated to the public domain under [CC0-1.0](LICENSE). Not affiliated with Anthropic. "Claude" is a trademark of Anthropic; used here only to describe compatibility.
