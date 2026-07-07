# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**Traductions :** [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · Français · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _Ceci est une traduction communautaire du [README](README.md) en anglais, qui fait foi et peut être plus à jour._

> Un catalogue soigné et sans battage des serveurs Model Context Protocol (MCP) qui donnent des mains et des yeux à **Claude** — sur Claude Desktop, Claude Code et l'API Claude.

**[Parcourir le répertoire consultable →](https://kuber.studio/awesome-claude-mcp-servers/)** — recherchez, filtrez par catégorie, langage et hébergement, et récupérez un extrait de configuration en un clic.

Le [Model Context Protocol](https://modelcontextprotocol.io) est une norme ouverte pour connecter les applications d'IA à des outils, données et services externes. Claude est le **client (hôte)** ; chaque serveur ci-dessous expose des outils, des ressources ou des prompts que Claude peut appeler. MCP étant une norme, la plupart de ces serveurs fonctionnent aussi dans Cursor, Codex et d'autres clients — seul le format de configuration change. Si vous utilisez OpenAI Codex, consultez la liste jumelle : **[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**.

Cette liste privilégie **le signal au volume** : des serveurs que les gens utilisent réellement, qui sont maintenus et qui font une chose bien. Chaque entrée est étiquetée pour que vous puissiez la parcourir par langage, lieu d'exécution et qui la soutient.

## Sommaire

- [Comment lire cette liste](#comment-lire-cette-liste)
- [Démarrer avec Claude](#démarrer-avec-claude)
- [Kits de démarrage](#kits-de-démarrage)
- [Sécurité et bonne hygiène](#sécurité-et-bonne-hygiène)
- [Agrégateurs et passerelles](#agrégateurs-et-passerelles)
- [Outils de développement et gestion de versions](#outils-de-développement-et-gestion-de-versions)
- [Automatisation de navigateur](#automatisation-de-navigateur)
- [Recherche web et scraping](#recherche-web-et-scraping)
- [Bases de données et entrepôts de données](#bases-de-données-et-entrepôts-de-données)
- [Connaissance et mémoire](#connaissance-et-mémoire)
- [Fichiers et gestion de documents](#fichiers-et-gestion-de-documents)
- [Cloud, infrastructure et devops](#cloud-infrastructure-et-devops)
- [Supervision et observabilité](#supervision-et-observabilité)
- [Sécurité](#sécurité)
- [Communication](#communication)
- [Productivité et gestion de projet](#productivité-et-gestion-de-projet)
- [Finance et paiements](#finance-et-paiements)
- [Design et création](#design-et-création)
- [IA, données et analytique](#ia-données-et-analytique)
- [Cartes et localisation](#cartes-et-localisation)
- [Médias et divertissement](#médias-et-divertissement)
- [Science et recherche](#science-et-recherche)
- [Tout le reste](#tout-le-reste)
- [Listes connexes](#listes-connexes)
- [Contribuer](#contribuer)

## Comment lire cette liste

Chaque entrée se présente ainsi :

```
- [Nom](lien) - Ce que fait le serveur, en une phrase claire. `Lang` `exéc` `source`
```

Les étiquettes en fin de ligne sont des métadonnées à parcourir rapidement :

**Langage** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**Exécution** — `local` s'exécute sur votre machine en tant que sous-processus via stdio · `remote` un point de terminaison HTTP hébergé vers lequel vous dirigez Claude · `local/remote` propose les deux

**Source** — `reference` un serveur de référence officiel du projet MCP · `official` maintenu par l'éditeur du produit lui-même · `archived` un serveur de référence archivé, toujours utilisable mais qui n'est plus maintenu. Les entrées sans étiquette de source sont maintenues par la communauté.

Pas d'étoiles, pas de nombre d'installations — ces chiffres sont périmés le jour même où on les écrit. La popularité se trouve plutôt dans les [Kits de démarrage](#kits-de-démarrage).

## Démarrer avec Claude

Les serveurs MCP se connectent via deux transports : **stdio** (un sous-processus local) et **HTTP streamable** (un point de terminaison distant, éventuellement derrière OAuth). Voici comment les brancher sur chaque interface de Claude.

### Claude Code (CLI)

Ajoutez un serveur **local (stdio)**. Tout ce qui suit `--` est transmis tel quel au serveur :

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

Ajoutez un serveur **distant (HTTP)**, avec un en-tête d'authentification facultatif :

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

Passez des variables d'environnement à un serveur local (placez une option entre `--env` et le nom) :

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

Choisissez **où** un serveur est mémorisé avec `--scope` :

| Portée | Disponible dans | Partagé avec votre équipe | Stocké dans |
|-------|--------------|----------------------|-----------|
| `local` (par défaut) | le projet en cours, vous seul | non | `~/.claude.json` |
| `project` | le projet en cours, tout le monde | oui, à committer | `.mcp.json` dans le dépôt |
| `user` | tous vos projets | non | `~/.claude.json` |

Un fichier **`.mcp.json`** committé (portée projet) ressemble à ceci et accompagne le dépôt :

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

Gérez ce que vous avez ajouté : `claude mcp list`, `claude mcp get <name>`, `claude mcp remove <name>`. Dans une session, `/mcp` affiche l'état en direct, le nombre d'outils et l'état OAuth. Pour les serveurs distants qui nécessitent une connexion, exécutez `/mcp` et effectuez le processus dans le navigateur (ou `claude mcp login <name>` depuis le terminal).

### Claude Desktop

Modifiez la configuration directement — **Settings → Developer → Edit Config** — puis quittez complètement et relancez Claude.

- macOS : `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows : `%APPDATA%\Claude\claude_desktop_config.json`

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

Utilisez des **chemins absolus** dans `args`, jamais de chemins relatifs. Les journaux se trouvent dans `~/Library/Logs/Claude/` (macOS) ou `%APPDATA%\Claude\logs` (Windows). Les serveurs distants/OAuth s'ajoutent de préférence via l'interface **Connectors** intégrée à Claude Desktop plutôt qu'en modifiant à la main ici.

### API Claude

Les modèles Claude appellent les outils MCP via le [connecteur MCP](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector) (serveurs distants) ou l'[Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), qui comprend les mêmes configurations de serveur que Claude Code.

## Kits de démarrage

Vous ne voulez pas trente serveurs. Les définitions d'outils puisent dans la même fenêtre de contexte que votre travail réel, et au-delà d'environ 40 outils actifs, le modèle commence à se tromper d'outil. Installez un petit ensemble adapté à ce que vous faites.

**La stack de développement** — ce vers quoi convergent la plupart des utilisateurs de Claude Code :

- [Context7](https://github.com/upstash/context7) - documentation de bibliothèques à jour et épinglée par version pour que Claude cesse de deviner les API.
- [GitHub](https://github.com/github/github-mcp-server) - issues, PR, recherche de code et Actions, pour que Claude participe au dépôt.
- [Playwright](https://github.com/microsoft/playwright-mcp) - pilotez et vérifiez un navigateur pour le travail d'interface et les tests de bout en bout.
- [Serena](https://github.com/oraios/serena) - navigation et édition de code au niveau des symboles pour les grandes bases de code.
- [Sentry](https://github.com/getsentry/sentry-mcp) - récupérez les vraies erreurs de production et les traces d'appel pendant que vous les corrigez.

> Claude Code dispose déjà d'outils intégrés puissants pour les fichiers, le shell et Git. Un serveur MCP Filesystem ou Git y est le plus souvent redondant — ajoutez-les plutôt pour **Claude Desktop**, où ces outils intégrés n'existent pas.

**La stack de connaissance** — pour la recherche, la rédaction et l'automatisation personnelle dans Claude Desktop :

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - transformez n'importe quelle URL en markdown propre.
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - ancrage web en temps réel.
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - laissez Claude lire et écrire des fichiers locaux.
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - conservez des informations d'une session à l'autre.
- [Notion](https://github.com/makenotion/notion-mcp-server) ou [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - connectez votre base de connaissances.

## Sécurité et bonne hygiène

MCP confie à un modèle de véritables capacités. Traitez chaque serveur comme une dépendance que vous installez avec des identifiants attachés.

- **Installez des serveurs de confiance.** Un serveur malveillant peut dissimuler des instructions dans les descriptions de ses outils (empoisonnement d'outils) et les modifier après votre approbation. Préférez les serveurs `reference` et `official`, ou lisez le code source.
- **Restreignez les identifiants.** Donnez aux serveurs de base de données et d'API un accès en **lecture seule** à tout ce qui est en production, et utilisez des jetons à privilèges minimaux et à granularité fine. Un PAT GitHub destiné à un agent ne devrait pas pouvoir forcer un push (force-push).
- **L'injection de prompt est bien réelle.** Un serveur qui lit du contenu externe — une issue GitHub, une page web, un e-mail — peut véhiculer des instructions qui tentent de détourner Claude. Séparez autant que possible les serveurs capables d'écrire et ceux qui lisent du contenu.
- **Surveillez le budget de tokens.** Les définitions d'outils de chaque serveur consomment du contexte avant même de commencer le travail ; certains gros serveurs coûtent des dizaines de milliers de tokens. Mieux vaut quelques serveurs bien ciblés qu'un fourre-tout.
- **Épinglez les versions.** Épinglez les versions des paquets `npx`/`uvx` pour tout ce qui est sensible, et liez les serveurs HTTP locaux à `127.0.0.1`.

## Agrégateurs et passerelles

Exécutez et gérez de nombreux serveurs derrière un seul point de terminaison — routage, authentification, filtrage d'outils et gestion des espaces de noms.

- [MetaMCP](https://github.com/metatool-ai/metamcp) - Agrège des serveurs MCP en points de terminaison avec espaces de noms, dotés de middleware, d'authentification et d'une interface graphique. `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - Exécute et gère des serveurs MCP sous forme de conteneurs Docker isolés et signés. `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - Fait le pont entre stdio et SSE/HTTP streamable pour que tout serveur atteigne tout client. `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - Fédère des outils REST, MCP et A2A derrière une seule passerelle. `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - Proxy de plan de données pour les agents et MCP, avec contrôles de sécurité et de gouvernance. `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - Plateforme hébergée ou auto-hébergée qui sert et gère les intégrations MCP à grande échelle. `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - Passerelle légère qui transforme les serveurs MCP existants en points de terminaison gérés. `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - Application de bureau qui route, gère et agrège les serveurs MCP locaux. `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - Registre et proxy MCP auto-hébergés pour les flottes d'agents en entreprise. `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - Passerelle qui agrège les serveurs MCP et les fournisseurs de LLM derrière une seule API. `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - Agrège plusieurs serveurs MCP en un seul point de terminaison unifié. `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - Hub méta-MCP pour la découverte, l'installation et l'orchestration autonomes de serveurs. `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - Proxy qui compose de nombreux serveurs MCP en un seul point de terminaison à répartition de charge. `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - Unifie les serveurs avec découverte d'outils et de ressources, plus un bac à sable. `TS` `local`

## Outils de développement et gestion de versions

- [GitHub](https://github.com/github/github-mcp-server) - Gère les dépôts, issues, pull requests, la recherche de code et Actions. `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - Lit, recherche et manipule les dépôts Git locaux. `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - Récupération et édition de code au niveau des symboles, propulsées par des serveurs de langage. `Py` `local`
- [Context7](https://github.com/upstash/context7) - Injecte dans les prompts une documentation de bibliothèques à jour et spécifique à chaque version. `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - Contrôle du terminal et modifications de fichiers basées sur les diffs sur toute votre machine. `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - Point de terminaison GitLab intégré pour les projets, issues, merge requests et pipelines. `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - Exécute du code généré par un LLM dans des bacs à sable cloud sécurisés. `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - Connecte les agents aux API, collections et environnements dans Postman. `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - Permet aux agents de diagnostiquer et corriger les builds CI en échec. `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - Gère les pipelines, builds et jobs Buildkite. `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - Accède aux tableaux, dépôts et pipelines Azure DevOps. `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - CLI et MCP englobant GitKraken, Jira, GitHub et GitLab. `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - Offre aux agents des outils de code sémantiques : définitions, références et diagnostics. `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Gestion des dépôts, issues et pull requests pour Gitee. `TS` `local` `official`

## Automatisation de navigateur

- [Playwright](https://github.com/microsoft/playwright-mcp) - Pilote un navigateur via l'arbre d'accessibilité plutôt que par captures d'écran. `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - Contrôle et inspecte un Chrome en direct pour l'automatisation, le débogage et le traçage des performances. `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - Permet aux agents de piloter un vrai navigateur pour extraire des données et accomplir des tâches. `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - Contrôle un navigateur cloud via l'infrastructure Browserbase et Stagehand. `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - Framework d'automatisation de navigateur par IA avec les primitives act, extract et observe. `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - Automatise votre Chrome local via une extension de navigateur compagnon. `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - Automatisation Playwright communautaire avec en plus des outils de web scraping. `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - Automatise des flux de navigateur à l'aide de LLM et de vision par ordinateur. `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - Plateforme de navigateur cloud pour le scraping et l'automatisation par agents. `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - Automatisation de navigateur via Selenium WebDriver. `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - Automatisation de navigateur et scraping via Puppeteer. `TS` `local` `archived`

## Recherche web et scraping

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - Récupère une URL et convertit son contenu en markdown. `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - Scrape, explore et extrait des données web structurées pour les LLM. `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - Recherche web neuronale, exploration et recherche d'entreprises pour les agents. `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - Recherche, extraction, cartographie et exploration en temps réel, optimisées pour les agents. `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - Recherche web, locale, d'images, de vidéos et d'actualités via l'API Brave. `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - Recherche web en temps réel via les modèles Sonar de Perplexity. `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - Accès à l'API de recherche et de résumé Kagi. `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - Recherche web et récupération de pages via DuckDuckGo, sans clé API. `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - Interroge une instance de métarecherche SearXNG auto-hébergée. `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - Exécute des milliers de scrapers et d'acteurs de l'Apify Store pour récupérer des données web. `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - Boîte à outils de déblocage web, de SERP et de scraping. `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - Crawler open source, adapté aux LLM, avec un point de terminaison MCP intégré. `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - API de scraping avec rendu dynamique et ciblage géographique. `Py` `local/remote` `official`

## Bases de données et entrepôts de données

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - Accès à Postgres tenant compte du schéma, avec contrôles de santé et SQL sécurisé. `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - Interroge et gère des bases de données SQLite. `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - Accès à MySQL avec permissions configurables et inspection du schéma. `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - Connecte les agents aux bases de données MongoDB et aux clusters Atlas. `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - Interface en langage naturel pour gérer et rechercher des données Redis. `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - Gère Postgres, l'authentification, le stockage et les edge functions de Supabase. `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - Gère les projets, branches et requêtes Postgres serverless de Neon. `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - Explore les bases de données et exécute du SQL en lecture seule sur ClickHouse. `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - Interroge BigQuery avec inspection du schéma et exécution de SQL. `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - Interroge Snowflake avec accès en lecture/écriture et suivi des informations. `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - Accès à DuckDB avec inspection du schéma et mode lecture seule. `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - Interroge les données avec MotherDuck et DuckDB en local. `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - Gère les bases de données Prisma et exécute les migrations. `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - Explore le schéma et exécute du Cypher sur les bases de données graphe Neo4j. `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - Lit et écrit les enregistrements de bases Airtable avec inspection du schéma. `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - Lit et écrit les enregistrements de bases de données NocoDB. `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - Recherche en langage naturel sur les données Elasticsearch. `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - Interroge la plateforme d'analytique ClickHouse serverless de Tinybird. `Py` `local` `official`

## Connaissance et mémoire

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Mémoire persistante sous forme de graphe de connaissances, d'une session à l'autre. `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - Base de connaissances Markdown local-first avec mémoire sémantique persistante. `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - Mémoire d'agent persistante à long terme, propulsée par mem0. `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - Mémoire sous forme de graphe de connaissances, adossée à Neo4j et sensible au temps. `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - Recherche et rappelle les sessions passées et la mémoire à travers Claude, Codex et d'autres outils d'IA. `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - Stocke et récupère des mémoires sémantiques dans le moteur vectoriel Qdrant. `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - Recherche vectorielle, plein texte et par métadonnées sur les collections Chroma. `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - Recherche vectorielle, textuelle et hybride sur la base de données Milvus. `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - Recherche de documents, gestion des index et interrogation des données dans Pinecone. `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - Lit, recherche et modifie les notes d'un coffre Obsidian. `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - Lit la base de données locale d'Apple Notes sur macOS. `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - Interagit avec un graphe de connaissances Logseq. `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - Ingère du contenu Slack, Gmail et web dans une base de connaissances consultable. `TS` `local/remote` `official`

## Fichiers et gestion de documents

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Opérations sécurisées sur les fichiers locaux avec contrôles d'accès configurables. `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - Implémentation en Go de l'accès au système de fichiers local. `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - Recherche rapide de fichiers locaux sous Windows, macOS et Linux. `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - Accès aux fichiers et recherche pour Google Drive. `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - Accède aux fichiers, e-mails et au calendrier Microsoft 365 via l'API Graph. `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - Recherche et lit des fichiers dans Box. `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - Convertit des documents entre Markdown, HTML, PDF et docx. `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - Crée des flux d'analyse et d'ingestion de documents. `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - Téléverse, transforme, analyse et organise des médias. `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - Partage du code et du contexte de fichiers avec les LLM via MCP ou le presse-papiers. `Py` `local`

## Cloud, infrastructure et devops

- [AWS](https://github.com/awslabs/mcp) - Suite de serveurs pour les services AWS, CDK, les coûts, la documentation et Bedrock. `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - Accède aux services Azure avec l'authentification Entra ID. `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - Serveurs distants couvrant le développement, l'observabilité et la sécurité chez Cloudflare. `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - Déploie des applications sur Google Cloud Run. `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - Interagit avec le Terraform Registry et les API HCP Terraform. `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - Exécute des opérations d'infrastructure-as-code Pulumi via les API Automation et Cloud. `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - Gère les pods, déploiements et services dans Kubernetes. `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Opérations sur les clusters Kubernetes : pods, journaux et événements. `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - Gère les conteneurs et les stacks Compose. `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - Gère les applications, Postgres et add-ons Heroku. `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - Crée, build, déploie et gère des sites Netlify. `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - Gère les jobs et clusters HashiCorp Nomad. `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - Interagit avec l'API Hetzner Cloud. `TS` `local`

## Supervision et observabilité

- [Sentry](https://github.com/getsentry/sentry-mcp) - Récupère les issues, les traces d'appel et l'analyse Seer AI. `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - Accède aux tableaux de bord, sources de données, alertes et incidents. `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - Interroge les données d'observabilité avec l'Axiom Processing Language. `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - Accède aux traces et métriques OpenTelemetry via Pydantic Logfire. `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - Interroge les métriques et données d'observabilité VictoriaMetrics. `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - Interroge les métriques, traces et tableaux de bord SigNoz. `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - Accède aux données de rapport de plantage et de surveillance des utilisateurs réels. `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - Interroge les données de journaux Grafana Loki. `Go` `local`

## Sécurité

- [Semgrep](https://github.com/semgrep/mcp) - Analyse le code à la recherche de vulnérabilités de sécurité avec Semgrep. `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - Interroge la base de données Open Source Vulnerabilities. `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - Analyse les dépôts et projets via la CLI Snyk. `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - Intègre Burp Suite pour les tests de sécurité web. `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - Gère les secrets et les politiques dans HashiCorp Vault. `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - Gère les tenants Auth0 en langage naturel. `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Rétro-ingénierie de binaires via la décompilation Ghidra. `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - Automatise la rétro-ingénierie avec IDA Pro. `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - Interroge le renseignement réseau Shodan avec une sortie structurée. `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - Analyse des fichiers et des URL via l'API VirusTotal. `Py` `local`
- [Dark-Moon](https://github.com/ASCIT31/Dark-Moon) - Plateforme autonome de test d'intrusion qui orchestre des sous-agents offensifs spécialisés par technologie sur le web, le cloud, l'Active Directory, Kubernetes et les API, avec une trace de preuves pour chaque vulnérabilité. `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - Accède à la CLI 1Password pour gérer les secrets et les coffres. `Rust` `local`

## Communication

- [Slack](https://github.com/korotovsky/slack-mcp-server) - Accède aux espaces de travail Slack via stdio, SSE et HTTP avec un historique intelligent. `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - Recherche, lit et envoie des messages et médias WhatsApp personnels. `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - Envoie, recherche et gère Gmail avec OAuth automatique. `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - Gère les conversations, messages et brouillons Telegram via MTProto. `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - Envoie des messages et gère les numéros de téléphone via les API Twilio. `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - Connecte un agent à un compte officiel LINE. `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - Compose et envoie des e-mails via l'API Resend. `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - Interagit avec l'API e-mail Mailgun pour l'envoi et l'analytique. `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - Interroge et recherche les fils et publications Bluesky via le protocole AT. `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - Recherche les conversations et contacts Intercom. `TS` `remote` `official`

## Productivité et gestion de projet

- [Notion](https://github.com/makenotion/notion-mcp-server) - Lit et écrit les pages, bases de données, blocs et commentaires Notion. `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - Gère les issues, projets et cycles Linear. `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - Accède à Jira, Confluence et Bitbucket via OAuth. `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - Intégration Jira et Confluence auto-hébergeable. `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - Crée des tâches et effectue des recherches dans l'Asana Work Graph. `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - Accède aux tableaux, éléments et workflows monday.com. `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - Gère les tâches, documents, suivi du temps et commentaires ClickUp. `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - Gère les tâches Todoist en langage naturel. `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - Travaille avec les tableaux, listes et cartes Trello. `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - Gère les événements Google Calendar avec détection des conflits. `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - Interagit avec Apple Reminders sur macOS. `TS` `local`
- [Zapier](https://zapier.com/mcp) - Connecte les agents à des milliers d'applications pour des actions et des déclencheurs. `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - Gère les tâches, projets et espaces de travail Taskade. `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - Conçoit, structure et gère des sites Webflow via la Data API. `TS` `local/remote` `official`

## Finance et paiements

- [Stripe](https://github.com/stripe/agent-toolkit) - Gère les paiements, la facturation et les clients via l'API Stripe. `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - Gère les factures, paiements, litiges et abonnements. `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - Gère les factures, contacts et données comptables. `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - Connecte les agents à la plateforme de facturation par abonnement Chargebee. `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - Données de prix et de marché crypto pour les cryptomonnaies et les plateformes d'échange. `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - Données boursières et fondamentales conçues pour les agents. `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - Négocie actions et crypto via les API Alpaca. `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - Données de marché des cryptomonnaies en temps réel, sans clé API. `TS` `local`

## Design et création

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - Fournit le contexte de conception et l'accès au canevas des fichiers Figma. `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - Transmet les données de mise en page et de style Figma aux agents de codage. `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - Contrôle Blender pour la modélisation 3D et la création de scènes. `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - Génère des graphiques avec la bibliothèque de visualisation AntV. `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - Génère des graphiques avec Apache ECharts. `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - Génère dynamiquement des diagrammes Mermaid. `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - Parcourt et installe des composants shadcn/ui. `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - Crée des présentations et des diaporamas PowerPoint avec l'IA. `Py` `local`

## IA, données et analytique

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - Raisonnement multi-étapes structuré et révisable. `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - Accède aux modèles, jeux de données et Spaces de Hugging Face. `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - Utilise les Spaces de Hugging Face pour des modèles d'image, d'audio et de texte. `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - Interroge les données d'analytique GA4. `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - Interroge et unifie les données de plusieurs plateformes via un seul serveur MCP. `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - Récupération, recherche approfondie et extraction Markdown via Vectorize. `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - Interroge les pipelines MLOps et LLMOps dans ZenML. `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - Prévision et prédiction multimodales à partir d'entrées arbitraires. `Py` `local`

## Cartes et localisation

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - Services de localisation, itinéraires et détails des lieux. `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - Géocodage, navigation et intelligence géospatiale via Mapbox. `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - Connecte QGIS aux agents pour des opérations géospatiales. `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - Géolocalisation IP, informations réseau et détection de proxy. `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - Prévisions météo via l'API AccuWeather. `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - Exécute des sondes ping, traceroute et DNS depuis des emplacements dans le monde entier. `TS` `local` `official`

## Médias et divertissement

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - Synthèse vocale, clonage de voix et traitement audio. `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - Télécharge les sous-titres et transcriptions YouTube à des fins d'analyse. `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - Contrôle la lecture et gère les titres, albums et playlists. `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - Monte des vidéos, effectue une recherche sémantique et transcrit. `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - Lance, exécute et débogue le moteur de jeu Godot. `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - Contrôle et interagit avec l'éditeur Unity. `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - Statistiques de jeu en temps réel pour les titres populaires. `TS` `local/remote` `official`

## Science et recherche

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - Recherche et analyse les articles de recherche d'arXiv. `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - Recherche biomédicale à travers PubMed et ClinicalTrials.gov. `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - Recherche des articles de recherche, des conférences et les bases de code associées. `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - Recherche des aliments, des valeurs nutritionnelles et des codes-barres. `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - Boîte à outils de bio-informatique et de génomique englobant la bibliothèque gget. `Py` `local`

## Tout le reste

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - Conversion de l'heure et des fuseaux horaires. `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - Serveur de référence exploitant toutes les fonctionnalités MCP, pour tester les clients. `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - Contrôle les appareils domotiques via Home Assistant. `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - Hub d'automatisation MQTT pour interagir avec les appareils IoT. `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - Interroge les données législatives américaines de Congress.gov. `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - Rédige, révise et envoie des contrats et des modèles. `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - Recherche le prix des produits par code-barres, ASIN ou URL. `TS` `local` `official`

## Listes connexes

- [Model Context Protocol](https://github.com/modelcontextprotocol) - Le protocole officiel, les SDK et les serveurs de référence.
- [MCP Registry](https://registry.modelcontextprotocol.io) - Le registre officiel de serveurs avec espaces de noms (préversion).
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - Le même catalogue, pensé pour OpenAI Codex.

## Contribuer

Vous avez trouvé un serveur qui a sa place ici, ou repéré un lien mort ? Les contributions sont les bienvenues — veuillez d'abord lire les [règles de contribution](CONTRIBUTING.md). Un projet par pull request, restez objectif, et placez-le dans la bonne catégorie.

---

Cette liste est dédiée au domaine public sous licence [CC0-1.0](LICENSE). Sans affiliation avec Anthropic. « Claude » est une marque déposée d'Anthropic ; utilisée ici uniquement pour décrire la compatibilité.
