# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**翻訳:** [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · 日本語 · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _これは英語版 [README](README.md) のコミュニティ翻訳です。正本は英語版であり、内容がより新しい場合があります。_

> **Claude** に「手」と「目」を与える Model Context Protocol (MCP) サーバーの、誇大広告を排した厳選カタログ — Claude Desktop、Claude Code、そして Claude API を横断して。

**[検索可能なディレクトリを見る →](https://kuber.studio/awesome-claude-mcp-servers/)** — カテゴリ、言語、ホスティング形態で検索・絞り込みし、設定スニペットをワンクリックで取得できます。

[Model Context Protocol](https://modelcontextprotocol.io) は、AI アプリを外部のツール、データ、サービスに接続するためのオープン標準です。Claude は **クライアント（ホスト）** であり、以下の各サーバーは Claude が呼び出せるツール、リソース、プロンプトを公開します。MCP は標準であるため、これらのサーバーの大半は Cursor や Codex など他のクライアントでも動作します — 変わるのは設定ファイルの形式だけです。OpenAI Codex を使っている場合は、姉妹版のリストをご覧ください: **[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**。

このリストは **量より質（シグナル）** を重視します。実際に使われていて、メンテナンスされていて、一つのことをうまくこなすサーバーだけを集めています。各エントリにはタグが付いており、言語、実行場所、開発の担い手をひと目で把握できます。

## 目次

- [このリストの読み方](#このリストの読み方)
- [Claude を使い始める](#claude-を使い始める)
- [スターターキット](#スターターキット)
- [安全性と適切な運用習慣](#安全性と適切な運用習慣)
- [アグリゲーターとゲートウェイ](#アグリゲーターとゲートウェイ)
- [開発者ツールとバージョン管理](#開発者ツールとバージョン管理)
- [ブラウザ自動化](#ブラウザ自動化)
- [Web 検索とスクレイピング](#web-検索とスクレイピング)
- [データベースとデータウェアハウス](#データベースとデータウェアハウス)
- [ナレッジとメモリ](#ナレッジとメモリ)
- [ファイルとドキュメント処理](#ファイルとドキュメント処理)
- [クラウド・インフラ・DevOps](#クラウドインフラdevops)
- [モニタリングと可観測性](#モニタリングと可観測性)
- [セキュリティ](#セキュリティ)
- [コミュニケーション](#コミュニケーション)
- [生産性とプロジェクト管理](#生産性とプロジェクト管理)
- [金融と決済](#金融と決済)
- [デザインとクリエイティブ](#デザインとクリエイティブ)
- [AI・データ・分析](#aiデータ分析)
- [地図と位置情報](#地図と位置情報)
- [メディアとエンターテインメント](#メディアとエンターテインメント)
- [科学と研究](#科学と研究)
- [その他すべて](#その他すべて)
- [関連リスト](#関連リスト)
- [コントリビュート](#コントリビュート)

## このリストの読み方

各エントリは次のような形式です:

```
- [Name](link) - What it does, in one plain sentence. `Lang` `runs` `source`
```

末尾のタグは、素早く把握するためのメタデータです:

**言語** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**実行** — `local` は stdio 経由のサブプロセスとして自分のマシン上で動作 · `remote` は Claude を接続先として指定するホスト型 HTTP エンドポイント · `local/remote` は両方に対応

**提供元** — `reference` は MCP プロジェクトによる公式リファレンスサーバー · `official` は製品ベンダー自身がメンテナンス · `archived` はアーカイブ済みのリファレンスサーバーで、まだ使えるがメンテナンスは終了。提供元タグのないエントリはコミュニティによってメンテナンスされています。

スター数もインストール数も載せていません — そうした数字は書いた瞬間に古くなります。人気の指標は代わりに [スターターキット](#スターターキット) にまとめてあります。

## Claude を使い始める

MCP サーバーは 2 つのトランスポートで接続します: **stdio**（ローカルのサブプロセス）と **streamable HTTP**（リモートのエンドポイント、必要に応じて OAuth の背後に置く）です。以下では、各 Claude 環境への組み込み方を説明します。

### Claude Code (CLI)

**ローカル (stdio)** サーバーを追加します。`--` より後ろはすべてそのままサーバーに渡されます:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

**リモート (HTTP)** サーバーを追加します。認証ヘッダーは任意で指定できます:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

ローカルサーバーに環境変数を渡します（`--env` と名前の間にオプションを挟みます）:

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

`--scope` で、サーバーを **どこに** 記憶させるかを選びます:

| スコープ | 利用範囲 | チームと共有 | 保存先 |
|-------|--------------|----------------------|-----------|
| `local`（デフォルト） | 現在のプロジェクト、自分のみ | いいえ | `~/.claude.json` |
| `project` | 現在のプロジェクト、全員 | はい、コミットして共有 | リポジトリ内の `.mcp.json` |
| `user` | 自分のすべてのプロジェクト | いいえ | `~/.claude.json` |

コミットした **`.mcp.json`**（project スコープ）は次のような形式で、リポジトリと一緒に持ち運べます:

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

追加済みのサーバーを管理します: `claude mcp list`、`claude mcp get <name>`、`claude mcp remove <name>`。セッション中は `/mcp` でリアルタイムのステータス、ツール数、OAuth の状態を確認できます。ログインが必要なリモートサーバーの場合は、`/mcp` を実行してブラウザでの認証フローを完了します（またはシェルから `claude mcp login <name>`）。

### Claude Desktop

設定ファイルを直接編集します — **Settings → Developer → Edit Config** — 編集後は Claude を完全に終了してから再起動してください。

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

`args` には相対パスではなく **絶対パス** を使ってください。ログは `~/Library/Logs/Claude/`（macOS）または `%APPDATA%\Claude\logs`（Windows）にあります。リモート／OAuth サーバーは、ここで手動編集するよりも、Claude Desktop に組み込まれた **Connectors** の UI から追加するのが最適です。

### Claude API

Claude モデルは、[MCP コネクタ](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector)（リモートサーバー）または [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) を通じて MCP ツールを呼び出します。Agent SDK は Claude Code と同じサーバー設定を扱います。

## スターターキット

30 個ものサーバーは必要ありません。ツール定義は実際の作業と同じコンテキストウィンドウを消費し、アクティブなツールが約 40 個を超えると、モデルは誤ったツールを選び始めます。今やっていることに合った少数のセットだけをインストールしましょう。

**コーディングスタック** — 多くの Claude Code ユーザーが最終的に落ち着く構成:

- [Context7](https://github.com/upstash/context7) - 最新でバージョン固定されたライブラリのドキュメントを提供し、Claude が API を推測しなくて済むようにします。
- [GitHub](https://github.com/github/github-mcp-server) - Issue、PR、コード検索、Actions を扱い、Claude をリポジトリの一員にします。
- [Playwright](https://github.com/microsoft/playwright-mcp) - UI 作業やエンドツーエンドの検証のためにブラウザを操作・検証します。
- [Serena](https://github.com/oraios/serena) - 大規模コードベース向けの、シンボル単位のコードナビゲーションと編集。
- [Sentry](https://github.com/getsentry/sentry-mcp) - 修正作業をしながら、本番環境の実際のエラーとスタックトレースを取得します。

> Claude Code には、すでに強力なファイル・シェル・Git の組み込みツールが備わっています。そこでは Filesystem や Git の MCP サーバーはほぼ不要です — これらは組み込みツールが存在しない **Claude Desktop** 用に追加しましょう。

**ナレッジスタック** — Claude Desktop でのリサーチ、執筆、個人の自動化向け:

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - あらゆる URL をきれいな Markdown に変換します。
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - リアルタイムの Web グラウンディング。
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Claude にローカルファイルの読み書きをさせます。
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - セッションをまたいで情報を永続化します。
- [Notion](https://github.com/makenotion/notion-mcp-server) または [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - 自分のナレッジベースに接続します。

## 安全性と適切な運用習慣

MCP はモデルに実際の権限を与えます。すべてのサーバーを、認証情報付きでインストールする依存パッケージと同じように扱ってください。

- **信頼できるサーバーだけをインストールする。** 悪意あるサーバーは、ツールの説明文の中に指示を隠す（ツールポイズニング）ことができ、承認後にそれを書き換えることもできます。`reference` や `official` のサーバーを優先するか、ソースコードを読みましょう。
- **認証情報の権限を絞る。** データベースや API のサーバーには、本番環境に対して **読み取り専用** のアクセスを与え、粒度の細かい最小権限のトークンを使いましょう。エージェント用の GitHub PAT に force-push を許可すべきではありません。
- **プロンプトインジェクションは現実の脅威です。** 外部コンテンツ（GitHub の Issue、Web ページ、メールなど）を読み取るサーバーは、Claude を乗っ取ろうとする指示を運び込む可能性があります。書き込み可能なサーバーとコンテンツを読み取るサーバーは、可能な限り分離してください。
- **トークン予算に気を配る。** 各サーバーのツール定義は、作業を始める前からコンテキストを消費します。大きなサーバーの中には数万トークンを消費するものもあります。あれもこれもと詰め込むより、少数の切れ味の鋭いサーバーの方が優れています。
- **バージョンを固定する。** 重要なものについては `npx`/`uvx` のパッケージバージョンを固定し、ローカルの HTTP サーバーは `127.0.0.1` にバインドしましょう。

## アグリゲーターとゲートウェイ

多数のサーバーを 1 つのエンドポイントの背後で実行・管理します — ルーティング、認証、ツールのフィルタリング、名前空間の分離。

- [MetaMCP](https://github.com/metatool-ai/metamcp) - 複数の MCP サーバーを、ミドルウェア・認証・GUI を備えた名前空間付きエンドポイントに集約します。 `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - MCP サーバーを、隔離された署名付きの Docker コンテナとして実行・管理します。 `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - stdio と SSE／streamable-HTTP を橋渡しし、あらゆるサーバーをあらゆるクライアントに接続します。 `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - REST、MCP、A2A のツールを 1 つのゲートウェイの背後で連携させます。 `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - エージェントと MCP のためのデータプレーンプロキシで、セキュリティとガバナンスの制御を備えます。 `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - MCP 連携を大規模に提供・管理する、ホスト型またはセルフホスト型のプラットフォーム。 `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - 既存の MCP サーバーを管理されたエンドポイントに変える軽量ゲートウェイ。 `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - ローカルの MCP サーバーをルーティング・管理・集約するデスクトップアプリ。 `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - エンタープライズのエージェント群向けの、セルフホスト型 MCP レジストリ兼プロキシ。 `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - MCP サーバーと LLM プロバイダーを 1 つの API の背後に集約するゲートウェイ。 `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - 複数の MCP サーバーを 1 つの統一エンドポイントに集約します。 `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - サーバーの自律的な発見・インストール・オーケストレーションを行うメタ MCP ハブ。 `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - 多数の MCP サーバーを 1 つのロードバランス済みエンドポイントにまとめるプロキシ。 `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - ツールとリソースの検出機能、さらにプレイグラウンドを備え、サーバーを統合します。 `TS` `local`

## 開発者ツールとバージョン管理

- [GitHub](https://github.com/github/github-mcp-server) - リポジトリ、Issue、プルリクエスト、コード検索、Actions を管理します。 `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - ローカルの Git リポジトリを読み取り・検索・操作します。 `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - 言語サーバーを活用した、シンボル単位のコード取得と編集。 `Py` `local`
- [Context7](https://github.com/upstash/context7) - 最新かつバージョン固有のライブラリドキュメントをプロンプトに注入します。 `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - ターミナル操作と、差分ベースのファイル編集をマシン全体で行います。 `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - プロジェクト、Issue、マージリクエスト、パイプラインに対応した GitLab 組み込みエンドポイント。 `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - LLM が生成したコードを、安全なクラウドサンドボックスで実行します。 `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - エージェントを Postman の API、コレクション、環境に接続します。 `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - エージェントに、失敗した CI ビルドの診断と修正を任せます。 `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - Buildkite のパイプライン、ビルド、ジョブを管理します。 `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - Azure DevOps のボード、リポジトリ、パイプラインにアクセスします。 `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - GitKraken、Jira、GitHub、GitLab をラップする CLI 兼 MCP。 `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - エージェントに、定義・参照・診断といったセマンティックなコードツールを提供します。 `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Gitee のリポジトリ、Issue、プルリクエストを管理します。 `TS` `local` `official`

## ブラウザ自動化

- [Playwright](https://github.com/microsoft/playwright-mcp) - スクリーンショットではなくアクセシビリティツリーを介してブラウザを操作します。 `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - 稼働中の Chrome を制御・検査し、自動化、デバッグ、パフォーマンス計測を行います。 `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - エージェントに実際のブラウザを操作させ、データ抽出やタスク遂行を行います。 `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - Browserbase のインフラと Stagehand を介してクラウドブラウザを制御します。 `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - act・extract・observe のプリミティブを備えた AI ブラウザ自動化フレームワーク。 `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - コンパニオンのブラウザ拡張機能を通じて、ローカルの Chrome を自動化します。 `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - コミュニティ製の Playwright 自動化に、Web スクレイピングツールを加えたもの。 `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - LLM とコンピュータービジョンを使ってブラウザのワークフローを自動化します。 `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - エージェントによるスクレイピングと自動化のためのクラウドブラウザプラットフォーム。 `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - Selenium WebDriver を介したブラウザ自動化。 `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - Puppeteer によるブラウザ自動化とスクレイピング。 `TS` `local` `archived`

## Web 検索とスクレイピング

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - URL を取得し、その内容を Markdown に変換します。 `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - LLM 向けに Web データをスクレイピング・クロールし、構造化して抽出します。 `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - エージェント向けの、ニューラル Web 検索、クロール、企業リサーチ。 `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - エージェント向けに調整された、リアルタイムの検索・抽出・マッピング・クロール。 `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - Brave API を介した、Web・ローカル・画像・動画・ニュースの検索。 `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - Perplexity の Sonar モデルによるリアルタイム Web リサーチ。 `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - Kagi の検索・要約 API へのアクセス。 `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - DuckDuckGo による Web 検索とページ取得。API キー不要。 `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - セルフホストの SearXNG メタ検索インスタンスに問い合わせます。 `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - Apify Store の何千ものスクレイパーとアクターを実行し、Web データを取得します。 `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - Web アンロッカー、SERP、スクレイピングのツールキット。 `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - MCP エンドポイントを内蔵した、オープンソースで LLM フレンドリーなクローラー。 `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - 動的レンダリングと地域ターゲティングに対応したスクレイピング API。 `Py` `local/remote` `official`

## データベースとデータウェアハウス

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - スキーマを認識する Postgres アクセスに、ヘルスチェックと安全な SQL を備えます。 `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - SQLite データベースへのクエリと管理。 `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - 権限を設定可能で、スキーマ検査に対応した MySQL アクセス。 `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - エージェントを MongoDB データベースと Atlas クラスターに接続します。 `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - Redis のデータを管理・検索するための自然言語インターフェース。 `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - Supabase の Postgres、認証、ストレージ、エッジ関数を管理します。 `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - Neon のサーバーレス Postgres のプロジェクト、ブランチ、クエリを管理します。 `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - ClickHouse のデータベースを探索し、読み取り専用の SQL を実行します。 `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - スキーマ検査と SQL 実行により BigQuery にクエリします。 `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - 読み書きアクセスとインサイト追跡により Snowflake にクエリします。 `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - スキーマ検査と読み取り専用モードに対応した DuckDB アクセス。 `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - MotherDuck とローカルの DuckDB でデータにクエリします。 `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - Prisma のデータベースを管理し、マイグレーションを実行します。 `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - Neo4j グラフデータベースのスキーマを探索し、Cypher を実行します。 `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - スキーマ検査を伴って Airtable ベースのレコードを読み書きします。 `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - NocoDB データベースのレコードを読み書きします。 `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - Elasticsearch のデータに対する自然言語検索。 `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - Tinybird のサーバーレス ClickHouse 分析プラットフォームにクエリします。 `Py` `local` `official`

## ナレッジとメモリ

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - セッションをまたいで永続化する、ナレッジグラフ型のメモリ。 `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - 永続的なセマンティックメモリを備えた、ローカルファーストの Markdown ナレッジベース。 `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - mem0 を基盤とする、永続的で長期的なエージェントメモリ。 `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - Neo4j を基盤とし、時間軸を認識するナレッジグラフ型メモリ。 `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - Claude、Codex など複数の AI ツールをまたいで、過去のセッションとメモリを検索・呼び出します。 `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - Qdrant ベクトルエンジンにセマンティックメモリを保存・取得します。 `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - Chroma コレクションに対する、ベクトル・全文・メタデータ検索。 `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - Milvus データベース上での、ベクトル・テキスト・ハイブリッド検索。 `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - Pinecone でドキュメントを検索し、インデックスを管理し、データにクエリします。 `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - Obsidian のボールト内のノートを読み取り・検索・編集します。 `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - macOS 上のローカルの Apple Notes データベースから読み取ります。 `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - Logseq のナレッジグラフを操作します。 `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - Slack、Gmail、Web コンテンツを取り込み、検索可能なナレッジベースにします。 `TS` `local/remote` `official`

## ファイルとドキュメント処理

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - アクセス制御を設定できる、安全なローカルファイル操作。 `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - ローカルファイルシステムアクセスの Go 実装。 `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - Windows、macOS、Linux にまたがる高速なローカルファイル検索。 `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - Google Drive のファイルアクセスと検索。 `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - Graph API を介して Microsoft 365 のファイル、メール、カレンダーにアクセスします。 `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - Box 内のファイルを検索・読み取りします。 `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - ドキュメントを Markdown、HTML、PDF、docx の間で相互変換します。 `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - ドキュメントの解析と取り込みのワークフローを構築します。 `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - メディアアセットのアップロード、変換、分析、整理を行います。 `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - MCP またはクリップボードを介して、コードやファイルのコンテキストを LLM と共有します。 `Py` `local`

## クラウド・インフラ・DevOps

- [AWS](https://github.com/awslabs/mcp) - AWS サービス、CDK、コスト、ドキュメント、Bedrock に対応したサーバー群。 `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - Entra ID 認証で Azure サービスにアクセスします。 `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - Cloudflare の開発、可観測性、セキュリティにまたがるリモートサーバー群。 `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - アプリケーションを Google Cloud Run にデプロイします。 `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - Terraform Registry と HCP Terraform の API を操作します。 `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - Automation API と Cloud API を介して Pulumi の Infrastructure as Code 操作を実行します。 `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - Kubernetes の Pod、Deployment、Service を管理します。 `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Kubernetes クラスターの操作: Pod、ログ、イベント。 `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - コンテナと Compose スタックを管理します。 `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - Heroku のアプリ、Postgres、アドオンを管理します。 `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - Netlify サイトの作成、ビルド、デプロイ、管理を行います。 `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - HashiCorp Nomad のジョブとクラスターを管理します。 `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - Hetzner Cloud の API を操作します。 `TS` `local`

## モニタリングと可観測性

- [Sentry](https://github.com/getsentry/sentry-mcp) - Issue、スタックトレース、Seer AI の分析を取得します。 `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - ダッシュボード、データソース、アラート、インシデントにアクセスします。 `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - Axiom Processing Language を使って可観測性データにクエリします。 `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - Pydantic Logfire を介して OpenTelemetry のトレースとメトリクスにアクセスします。 `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - VictoriaMetrics のメトリクスと可観測性データにクエリします。 `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - SigNoz のメトリクス、トレース、ダッシュボードにクエリします。 `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - クラッシュレポートとリアルユーザーモニタリングのデータにアクセスします。 `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - Grafana Loki のログデータにクエリします。 `Go` `local`

## セキュリティ

- [Semgrep](https://github.com/semgrep/mcp) - Semgrep でコードをスキャンし、セキュリティ脆弱性を検出します。 `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - Open Source Vulnerabilities データベースにクエリします。 `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - Snyk CLI を介してリポジトリとプロジェクトをスキャンします。 `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - Web セキュリティテストのために Burp Suite を統合します。 `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - HashiCorp Vault のシークレットとポリシーを管理します。 `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - 自然言語で Auth0 のテナントを管理します。 `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Ghidra のデコンパイルを通じてバイナリをリバースエンジニアリングします。 `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - IDA Pro でリバースエンジニアリングを自動化します。 `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - Shodan のネットワークインテリジェンスに、構造化された出力でクエリします。 `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - VirusTotal API を介してファイルと URL を分析します。 `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - 1Password CLI にアクセスし、シークレットとボールトを管理します。 `Rust` `local`

## コミュニケーション

- [Slack](https://github.com/korotovsky/slack-mcp-server) - stdio、SSE、HTTP で Slack ワークスペースにアクセスし、スマートな履歴取得に対応します。 `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - 個人の WhatsApp のメッセージとメディアを検索・閲覧・送信します。 `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - 自動 OAuth により Gmail を送信・検索・管理します。 `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - MTProto を介して Telegram の会話、メッセージ、下書きを管理します。 `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - Twilio API を介してメッセージを送信し、電話番号を管理します。 `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - エージェントを LINE 公式アカウントに接続します。 `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - Resend API を通じてメールを作成・送信します。 `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - Mailgun のメール API を操作し、送信と分析を行います。 `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - AT Protocol を介して Bluesky のフィードと投稿を照会・検索します。 `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - Intercom の会話と連絡先を検索します。 `TS` `remote` `official`

## 生産性とプロジェクト管理

- [Notion](https://github.com/makenotion/notion-mcp-server) - Notion のページ、データベース、ブロック、コメントを読み書きします。 `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - Linear の Issue、プロジェクト、サイクルを管理します。 `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - OAuth を介して Jira、Confluence、Bitbucket にアクセスします。 `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - セルフホスト可能な Jira・Confluence 連携。 `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - タスクを作成し、Asana Work Graph 全体を検索します。 `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - monday.com のボード、アイテム、ワークフローにアクセスします。 `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - ClickUp のタスク、ドキュメント、時間管理、コメントを管理します。 `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - 自然言語で Todoist のタスクを管理します。 `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - Trello のボード、リスト、カードを扱います。 `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - 重複検出を伴って Google カレンダーの予定を管理します。 `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - macOS の Apple リマインダーを操作します。 `TS` `local`
- [Zapier](https://zapier.com/mcp) - エージェントを何千ものアプリに接続し、アクションとトリガーを実行します。 `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - Taskade のタスク、プロジェクト、ワークスペースを管理します。 `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - Data API を介して Webflow サイトのデザイン、構造化、管理を行います。 `TS` `local/remote` `official`

## 金融と決済

- [Stripe](https://github.com/stripe/agent-toolkit) - Stripe API を介して支払い、請求、顧客を管理します。 `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - 請求書、支払い、係争、サブスクリプションを処理します。 `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - 請求書、連絡先、会計データを管理します。 `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - エージェントを Chargebee のサブスクリプション課金プラットフォームに接続します。 `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - コインや取引所を横断した暗号資産の価格・市場データ。 `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - エージェント向けに構築された、株式市場とファンダメンタルズのデータ。 `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - Alpaca API を通じて株式と暗号資産を取引します。 `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - リアルタイムの暗号資産市場データ。API キー不要。 `TS` `local`

## デザインとクリエイティブ

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - Figma ファイルからデザインのコンテキストとキャンバスへのアクセスを提供します。 `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - Figma のレイアウトとスタイリングのデータをコーディングエージェントに渡します。 `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - Blender を制御し、3D モデリングとシーン作成を行います。 `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - AntV 可視化ライブラリでチャートを生成します。 `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - Apache ECharts でチャートを生成します。 `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - Mermaid の図を動的に生成します。 `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - shadcn/ui のコンポーネントを閲覧・インストールします。 `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - AI でプレゼンテーションや PowerPoint のスライドを作成します。 `Py` `local`

## AI・データ・分析

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - 構造化され、修正可能な多段階の推論。 `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - Hugging Face のモデル、データセット、Spaces にアクセスします。 `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - Hugging Face Spaces を使って画像・音声・テキストのモデルを利用します。 `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - GA4 の分析データにクエリします。 `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - 1 つの MCP サーバーとして、プラットフォームを横断したデータの照会と統合を行います。 `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - Vectorize を用いた検索（リトリーバル）、詳細リサーチ、Markdown 抽出。 `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - ZenML の MLOps・LLMOps パイプラインにクエリします。 `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - 任意の入力にわたるマルチモーダルな予測と予想。 `Py` `local`

## 地図と位置情報

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - 位置情報サービス、経路案内、地点の詳細。 `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - Mapbox を介したジオコーディング、ナビゲーション、地理空間インテリジェンス。 `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - 地理空間操作のために QGIS をエージェントに接続します。 `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - IP の位置情報、ネットワーク情報、プロキシ検出。 `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - AccuWeather API を介した天気予報。 `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - 世界各地から ping、traceroute、DNS プローブを実行します。 `TS` `local` `official`

## メディアとエンターテインメント

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - テキスト読み上げ、音声クローン、オーディオ処理。 `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - 分析のために YouTube の字幕と文字起こしをダウンロードします。 `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - 再生を制御し、トラック、アルバム、プレイリストを管理します。 `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - 動画の編集、セマンティック検索、文字起こしを行います。 `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - Godot ゲームエンジンの起動、実行、デバッグを行います。 `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - Unity エディターを制御・操作します。 `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - 人気タイトルを横断したリアルタイムのゲーム統計。 `TS` `local/remote` `official`

## 科学と研究

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - arXiv の研究論文を検索・分析します。 `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - PubMed と ClinicalTrials.gov を横断した生物医学リサーチ。 `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - 研究論文、学会、関連するコードベースを検索します。 `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - 食品、栄養成分、バーコードを検索します。 `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - gget ライブラリをラップした、バイオインフォマティクスとゲノミクスのツールキット。 `Py` `local`

## その他すべて

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - 時刻とタイムゾーンの変換。 `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - MCP のあらゆる機能を網羅した、クライアントのテスト用リファレンスサーバー。 `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - Home Assistant を通じてスマートホームデバイスを制御します。 `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - IoT デバイスと連携するための MQTT 自動化ハブ。 `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - Congress.gov から米国の立法データにクエリします。 `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - 契約書やテンプレートの作成、レビュー、送信を行います。 `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - バーコード、ASIN、URL から商品価格を調べます。 `TS` `local` `official`

## 関連リスト

- [Model Context Protocol](https://github.com/modelcontextprotocol) - 公式のプロトコル、SDK、リファレンスサーバー。
- [MCP Registry](https://registry.modelcontextprotocol.io) - 公式の、名前空間付きサーバーレジストリ（プレビュー）。
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - 同じカタログを OpenAI Codex 向けにまとめたもの。

## コントリビュート

ここに載せるべきサーバーを見つけた、あるいはリンク切れに気づきましたか? コントリビューションを歓迎します — まずは [コントリビューションガイドライン](CONTRIBUTING.md) をお読みください。1 つのプルリクエストにつき 1 プロジェクト、内容は客観的に保ち、適切なカテゴリに配置してください。

---

このリストは [CC0-1.0](LICENSE) のもとでパブリックドメインに提供されています。Anthropic とは提携関係にありません。「Claude」は Anthropic の商標であり、ここでは互換性を説明する目的でのみ使用しています。
