# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**번역:** [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · 한국어 · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _이 문서는 영어 [README](README.md)의 커뮤니티 번역본입니다. 영어 원문이 정본이며 더 최신일 수 있습니다._

> **Claude**에게 손과 눈을 달아주는 Model Context Protocol(MCP) 서버를 과장 없이 선별한 카탈로그 — Claude Desktop, Claude Code, Claude API 전반을 아우릅니다.

**[검색 가능한 디렉터리 둘러보기 →](https://kuber.studio/awesome-claude-mcp-servers/)** — 검색하고, 카테고리·언어·호스팅으로 필터링하며, 설정 스니펫을 한 번의 클릭으로 가져오세요.

[Model Context Protocol](https://modelcontextprotocol.io)은 AI 앱을 외부 도구, 데이터, 서비스에 연결하기 위한 개방형 표준입니다. Claude는 **클라이언트(호스트)**이며, 아래의 각 서버는 Claude가 호출할 수 있는 도구, 리소스, 프롬프트를 제공합니다. MCP는 표준이기 때문에 이 서버들 대부분은 Cursor, Codex를 비롯한 다른 클라이언트에서도 작동합니다 — 달라지는 것은 설정 형식뿐입니다. OpenAI Codex를 사용한다면 자매 목록인 **[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**을 참고하세요.

이 목록은 **양보다 신호**를 중시합니다: 사람들이 실제로 사용하고, 유지 관리되며, 한 가지를 제대로 해내는 서버들입니다. 모든 항목에는 태그가 붙어 있어 언어, 실행 위치, 관리 주체를 한눈에 훑어볼 수 있습니다.

## 목차

- [이 목록을 읽는 방법](#이-목록을-읽는-방법)
- [Claude 시작하기](#claude-시작하기)
- [스타터 키트](#스타터-키트)
- [안전과 올바른 관리 습관](#안전과-올바른-관리-습관)
- [애그리게이터와 게이트웨이](#애그리게이터와-게이트웨이)
- [개발자 도구와 버전 관리](#개발자-도구와-버전-관리)
- [브라우저 자동화](#브라우저-자동화)
- [웹 검색과 스크래핑](#웹-검색과-스크래핑)
- [데이터베이스와 데이터 웨어하우스](#데이터베이스와-데이터-웨어하우스)
- [지식과 메모리](#지식과-메모리)
- [파일과 문서 처리](#파일과-문서-처리)
- [클라우드, 인프라와 데브옵스](#클라우드-인프라와-데브옵스)
- [모니터링과 관찰 가능성](#모니터링과-관찰-가능성)
- [보안](#보안)
- [커뮤니케이션](#커뮤니케이션)
- [생산성과 프로젝트 관리](#생산성과-프로젝트-관리)
- [금융과 결제](#금융과-결제)
- [디자인과 크리에이티브](#디자인과-크리에이티브)
- [AI, 데이터와 분석](#ai-데이터와-분석)
- [지도와 위치](#지도와-위치)
- [미디어와 엔터테인먼트](#미디어와-엔터테인먼트)
- [과학과 연구](#과학과-연구)
- [그 외 모든 것](#그-외-모든-것)
- [관련 목록](#관련-목록)
- [기여하기](#기여하기)

## 이 목록을 읽는 방법

모든 항목은 다음과 같은 형태입니다:

```
- [Name](link) - What it does, in one plain sentence. `Lang` `runs` `source`
```

끝에 붙는 태그는 빠르게 훑어볼 수 있는 메타데이터입니다:

**언어** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**실행** — `local` stdio를 통해 서브프로세스로 사용자의 컴퓨터에서 실행 · `remote` Claude가 연결하는 호스팅된 HTTP 엔드포인트 · `local/remote` 둘 다 제공

**출처** — `reference` MCP 프로젝트의 공식 레퍼런스 서버 · `official` 제품 제공사가 직접 유지 관리 · `archived` 보관된 레퍼런스 서버로, 여전히 사용 가능하지만 더 이상 유지 관리되지 않음. 출처 태그가 없는 항목은 커뮤니티가 유지 관리합니다.

별점도, 설치 수도 없습니다 — 그런 수치는 적는 순간 낡아버립니다. 인기 있는 서버는 대신 [스타터 키트](#스타터-키트)에서 확인하세요.

## Claude 시작하기

MCP 서버는 두 가지 전송 방식으로 연결됩니다: **stdio**(로컬 서브프로세스)와 **streamable HTTP**(선택적으로 OAuth 뒤에 있는 원격 엔드포인트). 각 Claude 환경에 연결하는 방법은 다음과 같습니다.

### Claude Code (CLI)

**로컬(stdio)** 서버를 추가합니다. `--` 뒤의 모든 내용은 서버에 그대로 전달됩니다:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

선택적 인증 헤더와 함께 **원격(HTTP)** 서버를 추가합니다:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

로컬 서버에 환경 변수를 전달합니다(`--env`와 이름 사이에 옵션을 두세요):

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

`--scope`로 서버가 저장되는 **위치**를 선택합니다:

| 범위 | 사용 가능 범위 | 팀과 공유 | 저장 위치 |
|-------|--------------|----------------------|-----------|
| `local` (기본값) | 현재 프로젝트, 나만 | 아니요 | `~/.claude.json` |
| `project` | 현재 프로젝트, 모두 | 예, 커밋하세요 | 저장소의 `.mcp.json` |
| `user` | 내 모든 프로젝트 | 아니요 | `~/.claude.json` |

커밋된 **`.mcp.json`**(project 범위)은 다음과 같으며 저장소와 함께 이동합니다:

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

추가한 서버를 관리합니다: `claude mcp list`, `claude mcp get <name>`, `claude mcp remove <name>`. 세션 안에서 `/mcp`는 실시간 상태, 도구 개수, OAuth 상태를 보여줍니다. 로그인이 필요한 원격 서버는 `/mcp`를 실행해 브라우저 인증 과정을 완료하거나 셸에서 `claude mcp login <name>`을 실행하세요.

### Claude Desktop

설정을 직접 편집합니다 — **Settings → Developer → Edit Config** — 그런 다음 Claude를 완전히 종료하고 다시 실행하세요.

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

`args`에는 상대 경로가 아닌 **절대 경로**를 사용하세요. 로그는 `~/Library/Logs/Claude/`(macOS) 또는 `%APPDATA%\Claude\logs`(Windows)에 저장됩니다. 원격/OAuth 서버는 여기서 직접 편집하기보다 Claude Desktop에 내장된 **Connectors** UI로 추가하는 것이 가장 좋습니다.

### Claude API

Claude 모델은 [MCP connector](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector)(원격 서버) 또는 Claude Code와 동일한 서버 설정을 사용하는 [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)를 통해 MCP 도구를 호출합니다.

## 스타터 키트

서버 30개는 필요하지 않습니다. 도구 정의는 실제 작업과 같은 컨텍스트 창을 소비하며, 활성 도구가 대략 40개를 넘어가면 모델이 엉뚱한 도구를 고르기 시작합니다. 지금 하는 작업에 맞는 작은 세트만 설치하세요.

**코딩 스택** — 대부분의 Claude Code 사용자가 정착하는 조합:

- [Context7](https://github.com/upstash/context7) - 최신 버전 고정 라이브러리 문서로 Claude가 API를 추측하지 않게 합니다.
- [GitHub](https://github.com/github/github-mcp-server) - 이슈, PR, 코드 검색, Actions로 Claude가 저장소 작업에 참여합니다.
- [Playwright](https://github.com/microsoft/playwright-mcp) - UI 작업과 종단 간 점검을 위해 브라우저를 조작하고 검증합니다.
- [Serena](https://github.com/oraios/serena) - 대규모 코드베이스를 위한 심볼 수준의 코드 탐색과 편집.
- [Sentry](https://github.com/getsentry/sentry-mcp) - 수정 작업 중 실제 프로덕션 오류와 스택 트레이스를 가져옵니다.

> Claude Code에는 이미 강력한 내장 파일·셸·Git 도구가 있습니다. Filesystem이나 Git MCP 서버는 여기서 대부분 중복이므로, 이런 내장 도구가 없는 **Claude Desktop**에서 추가하세요.

**지식 스택** — Claude Desktop에서의 리서치, 글쓰기, 개인 자동화를 위한 조합:

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - 어떤 URL이든 깔끔한 마크다운으로 변환합니다.
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - 실시간 웹 기반 정보 제공.
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Claude가 로컬 파일을 읽고 쓸 수 있게 합니다.
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 세션 간에 정보를 유지합니다.
- [Notion](https://github.com/makenotion/notion-mcp-server) 또는 [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 지식 베이스를 연결합니다.

## 안전과 올바른 관리 습관

MCP는 모델에 실제 권한을 부여합니다. 모든 서버를 자격 증명이 딸린 채로 설치하는 의존성처럼 다루세요.

- **신뢰하는 서버만 설치하세요.** 악성 서버는 도구 설명 안에 지시를 숨길 수 있으며(도구 오염, tool poisoning), 승인 후에 이를 바꿀 수도 있습니다. `reference`와 `official` 서버를 우선하거나 소스 코드를 직접 확인하세요.
- **자격 증명의 권한을 최소화하세요.** 데이터베이스와 API 서버에는 프로덕션에 대해 **읽기 전용** 접근만 부여하고, 세분화된 최소 권한 토큰을 사용하세요. 에이전트용 GitHub PAT가 강제 푸시(force-push)를 할 수 있어서는 안 됩니다.
- **프롬프트 인젝션은 실재하는 위협입니다.** 외부 콘텐츠 — GitHub 이슈, 웹 페이지, 이메일 — 를 읽는 서버는 Claude를 탈취하려는 지시를 담고 있을 수 있습니다. 가능하다면 쓰기 권한이 있는 서버와 콘텐츠를 읽는 서버를 분리하세요.
- **토큰 예산을 신경 쓰세요.** 각 서버의 도구 정의는 작업이 시작되기도 전에 컨텍스트를 소비하며, 일부 대형 서버는 수만 토큰을 차지합니다. 이것저것 다 넣기보다 적고 날카로운 서버가 낫습니다.
- **버전을 고정하세요.** 민감한 것에는 `npx`/`uvx` 패키지 버전을 고정하고, 로컬 HTTP 서버는 `127.0.0.1`에 바인딩하세요.

## 애그리게이터와 게이트웨이

여러 서버를 하나의 엔드포인트 뒤에서 실행하고 관리합니다 — 라우팅, 인증, 도구 필터링, 네임스페이싱.

- [MetaMCP](https://github.com/metatool-ai/metamcp) - 미들웨어, 인증, GUI를 갖춰 MCP 서버를 네임스페이스 엔드포인트로 통합합니다. `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - MCP 서버를 격리되고 서명된 Docker 컨테이너로 실행하고 관리합니다. `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - stdio와 SSE/streamable-HTTP를 연결해 어떤 서버든 어떤 클라이언트에 닿게 합니다. `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - REST, MCP, A2A 도구를 하나의 게이트웨이 뒤에서 페더레이션합니다. `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - 보안 및 거버넌스 제어를 갖춘 에이전트·MCP용 데이터 플레인 프록시. `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - MCP 통합을 대규모로 제공하고 관리하는 호스팅형 또는 자체 호스팅형 플랫폼. `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - 기존 MCP 서버를 관리형 엔드포인트로 바꾸는 경량 게이트웨이. `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - 로컬 MCP 서버를 라우팅, 관리, 통합하는 데스크톱 앱. `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - 엔터프라이즈 에이전트 플릿을 위한 자체 호스팅형 MCP 레지스트리 겸 프록시. `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - MCP 서버와 LLM 제공자를 하나의 API 뒤로 통합하는 게이트웨이. `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - 여러 MCP 서버를 하나의 통합 엔드포인트로 묶습니다. `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - 서버의 자동 발견, 설치, 오케스트레이션을 위한 메타-MCP 허브. `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - 여러 MCP 서버를 하나의 부하 분산 엔드포인트로 구성하는 프록시. `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - 도구·리소스 발견 기능과 플레이그라운드로 서버를 통합합니다. `TS` `local`

## 개발자 도구와 버전 관리

- [GitHub](https://github.com/github/github-mcp-server) - 저장소, 이슈, 풀 리퀘스트, 코드 검색, Actions를 관리합니다. `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - 로컬 Git 저장소를 읽고, 검색하고, 조작합니다. `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - 언어 서버 기반의 심볼 수준 코드 검색과 편집. `Py` `local`
- [Context7](https://github.com/upstash/context7) - 최신 버전별 라이브러리 문서를 프롬프트에 주입합니다. `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - 터미널 제어와 diff 기반 파일 편집을 컴퓨터 전반에서 수행합니다. `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - 프로젝트, 이슈, 머지 리퀘스트, 파이프라인을 위한 GitLab 내장 엔드포인트. `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - LLM이 생성한 코드를 안전한 클라우드 샌드박스에서 실행합니다. `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - 에이전트를 Postman의 API, 컬렉션, 환경에 연결합니다. `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - 에이전트가 실패한 CI 빌드를 진단하고 고치도록 합니다. `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - Buildkite 파이프라인, 빌드, 작업을 관리합니다. `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - Azure DevOps 보드, 저장소, 파이프라인에 접근합니다. `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - GitKraken, Jira, GitHub, GitLab을 감싸는 CLI 겸 MCP. `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - 에이전트에 정의, 참조, 진단 등 의미 기반 코드 도구를 제공합니다. `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Gitee의 저장소, 이슈, 풀 리퀘스트 관리. `TS` `local` `official`

## 브라우저 자동화

- [Playwright](https://github.com/microsoft/playwright-mcp) - 스크린샷 대신 접근성 트리를 통해 브라우저를 조작합니다. `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - 실행 중인 Chrome을 제어·검사하여 자동화, 디버깅, 성능 추적을 수행합니다. `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - 에이전트가 실제 브라우저를 조작해 데이터를 추출하고 작업을 완료하게 합니다. `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - Browserbase 인프라와 Stagehand로 클라우드 브라우저를 제어합니다. `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - act, extract, observe 기본 동작을 갖춘 AI 브라우저 자동화 프레임워크. `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - 동반 브라우저 확장 프로그램을 통해 로컬 Chrome을 자동화합니다. `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - 커뮤니티 Playwright 자동화와 웹 스크래핑 도구. `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - LLM과 컴퓨터 비전으로 브라우저 워크플로를 자동화합니다. `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - 에이전트 스크래핑과 자동화를 위한 클라우드 브라우저 플랫폼. `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - Selenium WebDriver를 통한 브라우저 자동화. `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - Puppeteer를 통한 브라우저 자동화와 스크래핑. `TS` `local` `archived`

## 웹 검색과 스크래핑

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - URL을 가져와 그 내용을 마크다운으로 변환합니다. `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - LLM을 위해 웹 데이터를 스크래핑, 크롤링하고 구조화하여 추출합니다. `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - 에이전트를 위한 신경망 웹 검색, 크롤링, 기업 조사. `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - 에이전트에 맞춰 조정된 실시간 검색, 추출, 매핑, 크롤링. `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - Brave API를 통한 웹, 로컬, 이미지, 동영상, 뉴스 검색. `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - Perplexity Sonar 모델을 통한 실시간 웹 리서치. `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - Kagi 검색 및 요약기 API 접근. `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - API 키 없이 DuckDuckGo로 웹 검색과 페이지 가져오기. `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - 자체 호스팅한 SearXNG 메타검색 인스턴스를 조회합니다. `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - 웹 데이터를 위해 수천 개의 Apify Store 스크래퍼와 액터를 실행합니다. `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - 웹 언락커, SERP, 스크래핑 툴킷. `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - MCP 엔드포인트가 내장된 오픈소스 LLM 친화 크롤러. `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - 동적 렌더링과 지역 타겟팅을 갖춘 스크래핑 API. `Py` `local/remote` `official`

## 데이터베이스와 데이터 웨어하우스

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - 스키마를 인식하는 Postgres 접근과 상태 점검, 안전한 SQL. `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - SQLite 데이터베이스를 조회하고 관리합니다. `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - 설정 가능한 권한과 스키마 검사를 갖춘 MySQL 접근. `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - 에이전트를 MongoDB 데이터베이스와 Atlas 클러스터에 연결합니다. `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - Redis 데이터를 관리하고 검색하는 자연어 인터페이스. `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - Supabase의 Postgres, 인증, 스토리지, 엣지 함수를 관리합니다. `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - Neon 서버리스 Postgres 프로젝트, 브랜치, 쿼리를 관리합니다. `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - ClickHouse에서 데이터베이스를 탐색하고 읽기 전용 SQL을 실행합니다. `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - 스키마 검사와 SQL 실행으로 BigQuery를 조회합니다. `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - 읽기/쓰기 접근과 인사이트 추적으로 Snowflake를 조회합니다. `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - 스키마 검사와 읽기 전용 모드를 갖춘 DuckDB 접근. `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - MotherDuck과 로컬 DuckDB로 데이터를 조회합니다. `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - Prisma 데이터베이스를 관리하고 마이그레이션을 실행합니다. `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - Neo4j 그래프 데이터베이스에서 스키마를 탐색하고 Cypher를 실행합니다. `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - 스키마 검사와 함께 Airtable 베이스 레코드를 읽고 씁니다. `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - NocoDB 데이터베이스 레코드를 읽고 씁니다. `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - Elasticsearch 데이터에 대한 자연어 검색. `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - Tinybird 서버리스 ClickHouse 분석 플랫폼을 조회합니다. `Py` `local` `official`

## 지식과 메모리

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - 세션 간에 유지되는 지식 그래프 메모리. `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - 지속적인 의미 기반 메모리를 갖춘 로컬 우선 마크다운 지식 베이스. `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - mem0 기반의 지속적인 장기 에이전트 메모리. `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - 시간 인식 기능을 갖춘 Neo4j 기반 지식 그래프 메모리. `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - Claude, Codex를 비롯한 여러 AI 도구에서 과거 세션과 메모리를 검색하고 불러옵니다. `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - Qdrant 벡터 엔진에 의미 기반 메모리를 저장하고 검색합니다. `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - Chroma 컬렉션에 대한 벡터, 전문, 메타데이터 검색. `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - Milvus 데이터베이스에서의 벡터, 텍스트, 하이브리드 검색. `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - Pinecone에서 문서를 검색하고 인덱스를 관리하며 데이터를 조회합니다. `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - Obsidian 보관함의 노트를 읽고, 검색하고, 편집합니다. `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - macOS의 로컬 Apple Notes 데이터베이스에서 읽습니다. `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - Logseq 지식 그래프와 상호작용합니다. `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - Slack, Gmail, 웹 콘텐츠를 검색 가능한 지식 베이스로 수집합니다. `TS` `local/remote` `official`

## 파일과 문서 처리

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - 설정 가능한 접근 제어를 갖춘 안전한 로컬 파일 작업. `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - 로컬 파일 시스템 접근의 Go 구현체. `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - Windows, macOS, Linux 전반의 빠른 로컬 파일 검색. `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - Google Drive의 파일 접근과 검색. `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - Graph API를 통해 Microsoft 365 파일, 메일, 캘린더에 접근합니다. `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - Box의 파일을 검색하고 읽습니다. `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - 문서를 Markdown, HTML, PDF, docx 사이에서 변환합니다. `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - 문서 파싱 및 수집 워크플로를 구축합니다. `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - 미디어 자산을 업로드, 변환, 분석, 정리합니다. `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - MCP 또는 클립보드를 통해 코드와 파일 컨텍스트를 LLM과 공유합니다. `Py` `local`

## 클라우드, 인프라와 데브옵스

- [AWS](https://github.com/awslabs/mcp) - AWS 서비스, CDK, 비용, 문서, Bedrock을 위한 서버 모음. `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - Entra ID 인증으로 Azure 서비스에 접근합니다. `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - Cloudflare의 개발, 관찰 가능성, 보안 전반을 아우르는 원격 서버. `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - 애플리케이션을 Google Cloud Run에 배포합니다. `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - Terraform Registry 및 HCP Terraform API와 상호작용합니다. `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - Automation 및 Cloud API를 통해 Pulumi의 코드형 인프라(IaC) 작업을 실행합니다. `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - Kubernetes의 파드, 디플로이먼트, 서비스를 관리합니다. `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Kubernetes 클러스터 운영: 파드, 로그, 이벤트. `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - 컨테이너와 Compose 스택을 관리합니다. `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - Heroku 앱, Postgres, 애드온을 관리합니다. `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - Netlify 사이트를 생성, 빌드, 배포, 관리합니다. `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - HashiCorp Nomad 작업과 클러스터를 관리합니다. `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - Hetzner Cloud API와 상호작용합니다. `TS` `local`

## 모니터링과 관찰 가능성

- [Sentry](https://github.com/getsentry/sentry-mcp) - 이슈, 스택 트레이스, Seer AI 분석을 가져옵니다. `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - 대시보드, 데이터 소스, 알림, 인시던트에 접근합니다. `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - Axiom Processing Language로 관찰 가능성 데이터를 조회합니다. `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - Pydantic Logfire를 통해 OpenTelemetry 트레이스와 메트릭에 접근합니다. `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - VictoriaMetrics 메트릭과 관찰 가능성 데이터를 조회합니다. `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - SigNoz 메트릭, 트레이스, 대시보드를 조회합니다. `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - 크래시 리포팅과 실사용자 모니터링 데이터에 접근합니다. `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - Grafana Loki 로그 데이터를 조회합니다. `Go` `local`

## 보안

- [Semgrep](https://github.com/semgrep/mcp) - Semgrep으로 코드의 보안 취약점을 스캔합니다. `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - 오픈소스 취약점(OSV) 데이터베이스를 조회합니다. `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - Snyk CLI를 통해 저장소와 프로젝트를 스캔합니다. `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - 웹 보안 테스트를 위해 Burp Suite를 통합합니다. `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - HashiCorp Vault의 시크릿과 정책을 관리합니다. `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - 자연어로 Auth0 테넌트를 관리합니다. `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Ghidra 디컴파일을 통해 바이너리를 리버스 엔지니어링합니다. `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - IDA Pro로 리버스 엔지니어링을 자동화합니다. `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - 구조화된 출력으로 Shodan 네트워크 인텔리전스를 조회합니다. `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - VirusTotal API를 통해 파일과 URL을 분석합니다. `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - 1Password CLI에 접근해 시크릿과 볼트를 관리합니다. `Rust` `local`

## 커뮤니케이션

- [Slack](https://github.com/korotovsky/slack-mcp-server) - 스마트 히스토리와 함께 stdio, SSE, HTTP로 Slack 워크스페이스에 접근합니다. `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - 개인 WhatsApp 메시지와 미디어를 검색, 열람, 전송합니다. `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - 자동 OAuth로 Gmail을 보내고, 검색하고, 관리합니다. `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - MTProto를 통해 Telegram 대화, 메시지, 임시 보관 메시지를 관리합니다. `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - Twilio API를 통해 메시지를 보내고 전화번호를 관리합니다. `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - 에이전트를 LINE 공식 계정에 연결합니다. `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - Resend API를 통해 이메일을 작성하고 전송합니다. `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - 발송과 분석을 위해 Mailgun 이메일 API와 상호작용합니다. `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - AT 프로토콜을 통해 Bluesky 피드와 게시물을 조회하고 검색합니다. `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - Intercom 대화와 연락처를 검색합니다. `TS` `remote` `official`

## 생산성과 프로젝트 관리

- [Notion](https://github.com/makenotion/notion-mcp-server) - Notion 페이지, 데이터베이스, 블록, 댓글을 읽고 씁니다. `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - Linear 이슈, 프로젝트, 사이클을 관리합니다. `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - OAuth를 통해 Jira, Confluence, Bitbucket에 접근합니다. `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - 자체 호스팅 가능한 Jira 및 Confluence 통합. `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - Asana Work Graph 전반에서 작업을 생성하고 검색합니다. `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - monday.com 보드, 항목, 워크플로에 접근합니다. `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - ClickUp 작업, 문서, 시간 추적, 댓글을 관리합니다. `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - 자연어로 Todoist 작업을 관리합니다. `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - Trello 보드, 리스트, 카드를 다룹니다. `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - 충돌 감지 기능과 함께 Google Calendar 일정을 관리합니다. `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - macOS의 Apple 미리 알림과 상호작용합니다. `TS` `local`
- [Zapier](https://zapier.com/mcp) - 액션과 트리거를 위해 에이전트를 수천 개의 앱에 연결합니다. `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - Taskade 작업, 프로젝트, 워크스페이스를 관리합니다. `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - Data API를 통해 Webflow 사이트를 디자인, 구성, 관리합니다. `TS` `local/remote` `official`

## 금융과 결제

- [Stripe](https://github.com/stripe/agent-toolkit) - Stripe API를 통해 결제, 청구, 고객을 관리합니다. `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - 인보이스, 결제, 분쟁, 구독을 처리합니다. `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - 인보이스, 연락처, 회계 데이터를 관리합니다. `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - 에이전트를 Chargebee 구독 청구 플랫폼에 연결합니다. `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - 여러 코인과 거래소에 걸친 암호화폐 가격 및 시장 데이터. `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - 에이전트를 위해 만들어진 주식 시장 및 재무 기초 데이터. `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - Alpaca API를 통해 주식과 암호화폐를 거래합니다. `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - API 키 없이 이용하는 실시간 암호화폐 시장 데이터. `TS` `local`

## 디자인과 크리에이티브

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - Figma 파일에서 디자인 컨텍스트와 캔버스 접근을 제공합니다. `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - Figma 레이아웃 및 스타일 데이터를 코딩 에이전트에 전달합니다. `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - 3D 모델링과 장면 제작을 위해 Blender를 제어합니다. `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - AntV 시각화 라이브러리로 차트를 생성합니다. `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - Apache ECharts로 차트를 생성합니다. `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - Mermaid 다이어그램을 동적으로 생성합니다. `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - shadcn/ui 컴포넌트를 둘러보고 설치합니다. `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - AI로 프레젠테이션과 PowerPoint 덱을 만듭니다. `Py` `local`

## AI, 데이터와 분석

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - 구조화되고 수정 가능한 다단계 추론. `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - Hugging Face 모델, 데이터셋, Spaces에 접근합니다. `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - 이미지, 오디오, 텍스트 모델을 위해 Hugging Face Spaces를 사용합니다. `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - GA4 분석 데이터를 조회합니다. `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - 하나의 MCP 서버로 여러 플랫폼의 데이터를 조회하고 통합합니다. `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - Vectorize를 통한 검색, 심층 조사, 마크다운 추출. `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - ZenML의 MLOps 및 LLMOps 파이프라인을 조회합니다. `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - 임의의 입력에 대한 멀티모달 예측과 전망. `Py` `local`

## 지도와 위치

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - 위치 서비스, 길찾기, 장소 상세 정보. `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - Mapbox를 통한 지오코딩, 내비게이션, 지리 공간 인텔리전스. `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - 지리 공간 작업을 위해 QGIS를 에이전트에 연결합니다. `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - IP 지리 위치, 네트워크 정보, 프록시 탐지. `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - AccuWeather API를 통한 날씨 예보. `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - 전 세계 위치에서 ping, traceroute, DNS 탐사를 실행합니다. `TS` `local` `official`

## 미디어와 엔터테인먼트

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - 텍스트 음성 변환, 음성 복제, 오디오 처리. `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - 분석을 위해 YouTube 자막과 대본을 다운로드합니다. `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - 재생을 제어하고 트랙, 앨범, 플레이리스트를 관리합니다. `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - 동영상을 편집하고, 의미 기반 검색을 수행하며, 전사합니다. `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - Godot 게임 엔진을 실행하고 구동하며 디버깅합니다. `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - Unity 에디터를 제어하고 상호작용합니다. `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - 인기 게임 전반의 실시간 게임 통계. `TS` `local/remote` `official`

## 과학과 연구

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - arXiv 연구 논문을 검색하고 분석합니다. `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - PubMed와 ClinicalTrials.gov를 아우르는 생의학 연구. `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - 연구 논문, 학회, 관련 코드베이스를 검색합니다. `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - 식품, 영양 정보, 바코드를 검색합니다. `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - gget 라이브러리를 감싼 생물정보학·유전체학 툴킷. `Py` `local`

## 그 외 모든 것

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - 시간 및 시간대 변환. `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - 모든 MCP 기능을 사용하는 레퍼런스 서버로, 클라이언트 테스트용. `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - Home Assistant를 통해 스마트홈 기기를 제어합니다. `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - IoT 기기와 상호작용하기 위한 MQTT 자동화 허브. `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - Congress.gov에서 미국 입법 데이터를 조회합니다. `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - 계약서와 템플릿을 작성, 검토, 발송합니다. `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - 바코드, ASIN, URL로 상품 가격을 조회합니다. `TS` `local` `official`

## 관련 목록

- [Model Context Protocol](https://github.com/modelcontextprotocol) - 공식 프로토콜, SDK, 레퍼런스 서버.
- [MCP Registry](https://registry.modelcontextprotocol.io) - 공식 네임스페이스 서버 레지스트리(프리뷰).
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - 동일한 카탈로그를 OpenAI Codex에 맞춰 정리한 버전.

## 기여하기

여기 실려야 할 서버를 발견했거나 깨진 링크를 찾으셨나요? 기여를 환영합니다 — 먼저 [기여 가이드라인](CONTRIBUTING.md)을 읽어주세요. 풀 리퀘스트당 하나의 프로젝트만, 객관적으로, 알맞은 카테고리에 넣어주세요.

---

이 목록은 [CC0-1.0](LICENSE)에 따라 퍼블릭 도메인으로 헌정됩니다. Anthropic과는 무관합니다. "Claude"는 Anthropic의 상표이며, 여기서는 호환성을 설명하기 위해서만 사용되었습니다.
