# Awesome Claude MCP Servers [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Awesome Claude MCP Servers](web/banner.png)](https://kuber.studio/awesome-claude-mcp-servers/)

**Traducciones:** [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · Español · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [add yours →](CONTRIBUTING.md#translations)

> _Esta es una traducción comunitaria del [README](README.md) en inglés, que es la versión autorizada y puede estar más actualizada._

> Un catálogo cuidado y sin exageraciones de servidores del Model Context Protocol (MCP) que le dan a **Claude** manos y ojos — en Claude Desktop, Claude Code y la Claude API.

**[Explora el directorio con búsqueda →](https://kuber.studio/awesome-claude-mcp-servers/)** — busca, filtra por categoría, lenguaje y alojamiento, y copia un fragmento de configuración con un solo clic.

El [Model Context Protocol](https://modelcontextprotocol.io) es un estándar abierto para conectar aplicaciones de IA con herramientas, datos y servicios externos. Claude es el **cliente (host)**; cada servidor de esta lista expone herramientas, recursos o prompts que Claude puede invocar. Como MCP es un estándar, la mayoría de estos servidores también funcionan en Cursor, Codex y otros clientes — lo único que cambia es el formato de configuración. Si usas OpenAI Codex, consulta la lista hermana: **[awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers)**.

Esta lista prioriza la **señal sobre el volumen**: servidores que la gente realmente usa, que reciben mantenimiento y que hacen bien una sola cosa. Cada entrada está etiquetada para que puedas revisar de un vistazo por lenguaje, dónde se ejecuta y quién está detrás.

## Contenido

- [Cómo leer esta lista](#cómo-leer-esta-lista)
- [Primeros pasos con Claude](#primeros-pasos-con-claude)
- [Kits de inicio](#kits-de-inicio)
- [Seguridad y buenas prácticas](#seguridad-y-buenas-prácticas)
- [Agregadores y pasarelas](#agregadores-y-pasarelas)
- [Herramientas de desarrollo y control de versiones](#herramientas-de-desarrollo-y-control-de-versiones)
- [Automatización de navegador](#automatización-de-navegador)
- [Búsqueda web y scraping](#búsqueda-web-y-scraping)
- [Bases de datos y almacenes de datos](#bases-de-datos-y-almacenes-de-datos)
- [Conocimiento y memoria](#conocimiento-y-memoria)
- [Archivos y manejo de documentos](#archivos-y-manejo-de-documentos)
- [Nube, infraestructura y devops](#nube-infraestructura-y-devops)
- [Monitoreo y observabilidad](#monitoreo-y-observabilidad)
- [Seguridad](#seguridad)
- [Comunicación](#comunicación)
- [Productividad y gestión de proyectos](#productividad-y-gestión-de-proyectos)
- [Finanzas y pagos](#finanzas-y-pagos)
- [Diseño y creatividad](#diseño-y-creatividad)
- [IA, datos y analítica](#ia-datos-y-analítica)
- [Mapas y ubicación](#mapas-y-ubicación)
- [Medios y entretenimiento](#medios-y-entretenimiento)
- [Ciencia e investigación](#ciencia-e-investigación)
- [Todo lo demás](#todo-lo-demás)
- [Listas relacionadas](#listas-relacionadas)
- [Contribuir](#contribuir)

## Cómo leer esta lista

Cada entrada tiene este aspecto:

```
- [Nombre](enlace) - Lo que hace, en una frase clara. `Lang` `runs` `source`
```

Las etiquetas al final son los metadatos para revisar de un vistazo:

**Lenguaje** — `TS` TypeScript · `Py` Python · `Go` Go · `Rust` Rust · `C#` C# · `Java` Java · `JS` JavaScript · `Ruby` Ruby

**Ejecución** — `local` se ejecuta en tu máquina como un subproceso sobre stdio · `remote` un endpoint HTTP alojado al que apuntas Claude · `local/remote` ofrece ambos

**Origen** — `reference` un servidor de referencia oficial del proyecto MCP · `official` mantenido por el propio proveedor del producto · `archived` un servidor de referencia archivado, todavía utilizable pero sin mantenimiento. Las entradas sin etiqueta de origen las mantiene la comunidad.

Sin estrellas ni número de instalaciones — esos datos quedan obsoletos el mismo día en que los escribes. La popularidad vive en los [Kits de inicio](#kits-de-inicio).

## Primeros pasos con Claude

Los servidores MCP se conectan mediante dos transportes: **stdio** (un subproceso local) y **streamable HTTP** (un endpoint remoto, opcionalmente detrás de OAuth). Así se conectan en cada interfaz de Claude.

### Claude Code (CLI)

Añade un servidor **local (stdio)**. Todo lo que va después de `--` se pasa al servidor sin modificar:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects
```

Añade un servidor **remoto (HTTP)**, con una cabecera de autenticación opcional:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer <token>"
```

Pasa variables de entorno a un servidor local (mantén una opción entre `--env` y el nombre):

```bash
claude mcp add --env AIRTABLE_API_KEY=<key> --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

Elige **dónde** se recuerda un servidor con `--scope`:

| Ámbito | Disponible en | Compartido con tu equipo | Almacenado en |
|-------|--------------|----------------------|-----------|
| `local` (predeterminado) | el proyecto actual, solo tú | no | `~/.claude.json` |
| `project` | el proyecto actual, todos | sí, haz commit | `.mcp.json` en el repositorio |
| `user` | todos tus proyectos | no | `~/.claude.json` |

Un **`.mcp.json`** en el repositorio (ámbito de proyecto) tiene este aspecto y viaja con el repositorio:

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

Gestiona lo que has añadido: `claude mcp list`, `claude mcp get <name>`, `claude mcp remove <name>`. Dentro de una sesión, `/mcp` muestra el estado en vivo, el número de herramientas y el estado de OAuth. Para los servidores remotos que requieren inicio de sesión, ejecuta `/mcp` y completa el flujo en el navegador (o `claude mcp login <name>` desde la terminal).

### Claude Desktop

Edita la configuración directamente — **Settings → Developer → Edit Config** — luego cierra Claude por completo y vuelve a abrirlo.

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

Usa **rutas absolutas** en `args`, nunca rutas relativas. Los registros se encuentran en `~/Library/Logs/Claude/` (macOS) o `%APPDATA%\Claude\logs` (Windows). Los servidores remotos/OAuth conviene añadirlos a través de la interfaz **Connectors** integrada en Claude Desktop, en lugar de editarlos a mano aquí.

### Claude API

Los modelos de Claude invocan herramientas MCP a través del [conector MCP](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector) (servidores remotos) o el [Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), que usa las mismas configuraciones de servidor que Claude Code.

## Kits de inicio

No quieres treinta servidores. Las definiciones de herramientas se consumen de la misma ventana de contexto que tu trabajo real, y a partir de unas 40 herramientas activas el modelo empieza a elegir la equivocada. Instala un conjunto pequeño que se ajuste a lo que estás haciendo.

**El stack de programación** — en lo que converge la mayoría de los usuarios de Claude Code:

- [Context7](https://github.com/upstash/context7) - documentación de bibliotecas actualizada y fijada por versión para que Claude deje de adivinar las APIs.
- [GitHub](https://github.com/github/github-mcp-server) - issues, PRs, búsqueda de código y Actions, para que Claude participe en el repositorio.
- [Playwright](https://github.com/microsoft/playwright-mcp) - controla y verifica un navegador para trabajo de UI y pruebas de extremo a extremo.
- [Serena](https://github.com/oraios/serena) - navegación y edición de código a nivel de símbolo para bases de código grandes.
- [Sentry](https://github.com/getsentry/sentry-mcp) - obtén errores reales de producción y trazas de pila mientras los corriges.

> Claude Code ya cuenta con potentes herramientas integradas de archivos, shell y Git. Un servidor MCP de Filesystem o Git es en gran parte redundante ahí — añádelos para **Claude Desktop**, donde esas herramientas integradas no existen.

**El stack de conocimiento** — para investigación, escritura y automatización personal en Claude Desktop:

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - convierte cualquier URL en markdown limpio.
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - fundamentación web en tiempo real.
- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - permite que Claude lea y escriba archivos locales.
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - conserva datos entre sesiones.
- [Notion](https://github.com/makenotion/notion-mcp-server) u [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - conecta tu base de conocimiento.

## Seguridad y buenas prácticas

MCP le entrega a un modelo capacidades reales. Trata cada servidor como una dependencia que instalas con credenciales adjuntas.

- **Instala servidores en los que confíes.** Un servidor malicioso puede ocultar instrucciones dentro de las descripciones de sus herramientas (tool poisoning) y cambiarlas después de que lo apruebes. Prefiere los servidores `reference` y `official`, o revisa el código fuente.
- **Limita el alcance de las credenciales.** Da a los servidores de bases de datos y API acceso de **solo lectura** a todo lo que esté en producción, y usa tokens granulares de mínimo privilegio. Un PAT de GitHub para un agente no debería poder hacer force-push.
- **La inyección de prompts es real.** Un servidor que lee contenido externo — un issue de GitHub, una página web, un correo — puede llevar instrucciones que intenten secuestrar a Claude. Mantén separados, cuando puedas, los servidores con capacidad de escritura y los que leen contenido.
- **Cuida el presupuesto de tokens.** Las definiciones de herramientas de cada servidor cuestan contexto antes de que empiece cualquier trabajo; algunos servidores grandes cuestan decenas de miles de tokens. Pocos servidores bien elegidos superan a un cajón de sastre.
- **Fija las versiones.** Fija las versiones de los paquetes `npx`/`uvx` para todo lo sensible, y vincula los servidores HTTP locales a `127.0.0.1`.

## Agregadores y pasarelas

Ejecuta y gestiona muchos servidores detrás de un solo endpoint — enrutamiento, autenticación, filtrado de herramientas y espacios de nombres.

- [MetaMCP](https://github.com/metatool-ai/metamcp) - Agrega servidores MCP en endpoints con espacios de nombres, con middleware, autenticación y una GUI. `TS` `local/remote`
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - Ejecuta y gestiona servidores MCP como contenedores Docker aislados y firmados. `Go` `local/remote` `official`
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - Conecta stdio y SSE/streamable-HTTP para que cualquier servidor alcance a cualquier cliente. `Py` `local`
- [MCP Context Forge](https://github.com/IBM/mcp-context-forge) - Federa herramientas REST, MCP y A2A detrás de una sola pasarela. `Py` `remote`
- [agentgateway](https://github.com/agentgateway/agentgateway) - Proxy de plano de datos para agentes y MCP con controles de seguridad y gobernanza. `Rust` `remote`
- [Klavis](https://github.com/Klavis-AI/klavis) - Plataforma alojada o autoalojada que sirve y gestiona integraciones MCP a escala. `Py` `local/remote`
- [Unla](https://github.com/AmoyLab/Unla) - Pasarela ligera que convierte servidores MCP existentes en endpoints gestionados. `Go` `remote`
- [MCP Router](https://github.com/mcp-router/mcp-router) - Aplicación de escritorio que enruta, gestiona y agrega servidores MCP locales. `TS` `local`
- [MCPJungle](https://github.com/mcpjungle/MCPJungle) - Registro y proxy MCP autoalojado para flotas de agentes empresariales. `Go` `remote`
- [Nexus](https://github.com/grafbase/nexus) - Pasarela que agrega servidores MCP y proveedores de LLM detrás de una sola API. `Rust` `remote`
- [1MCP](https://github.com/1mcp-app/agent) - Agrega múltiples servidores MCP en un único endpoint unificado. `TS` `local/remote`
- [Magg](https://github.com/sitbon/magg) - Hub meta-MCP para el descubrimiento, la instalación y la orquestación autónomos de servidores. `Py` `local`
- [mcgravity](https://github.com/tigranbs/mcgravity) - Proxy que combina muchos servidores MCP en un endpoint con balanceo de carga. `TS` `local`
- [pluggedin-mcp](https://github.com/VeriTeknik/pluggedin-mcp) - Unifica servidores con descubrimiento de herramientas y recursos, además de un playground. `TS` `local`

## Herramientas de desarrollo y control de versiones

- [GitHub](https://github.com/github/github-mcp-server) - Gestiona repositorios, issues, pull requests, búsqueda de código y Actions. `Go` `local/remote` `official`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) - Lee, busca y manipula repositorios Git locales. `Py` `local` `reference`
- [Serena](https://github.com/oraios/serena) - Recuperación y edición de código a nivel de símbolo, impulsadas por servidores de lenguaje. `Py` `local`
- [Context7](https://github.com/upstash/context7) - Inyecta en los prompts documentación de bibliotecas actualizada y específica por versión. `TS` `local/remote` `official`
- [Desktop Commander](https://github.com/wonderwhy-er/DesktopCommanderMCP) - Control de terminal y edición de archivos basada en diffs en toda tu máquina. `TS` `local`
- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/) - Endpoint integrado de GitLab para proyectos, issues, merge requests y pipelines. `Ruby` `remote` `official`
- [E2B](https://github.com/e2b-dev/mcp-server) - Ejecuta código generado por LLM en sandboxes seguros en la nube. `TS` `local/remote` `official`
- [Postman](https://github.com/postmanlabs/postman-mcp-server) - Conecta agentes con APIs, colecciones y entornos en Postman. `TS` `local/remote` `official`
- [CircleCI](https://github.com/CircleCI-Public/mcp-server-circleci) - Permite que los agentes diagnostiquen y corrijan compilaciones de CI fallidas. `TS` `local` `official`
- [Buildkite](https://github.com/buildkite/buildkite-mcp-server) - Gestiona pipelines, compilaciones y jobs de Buildkite. `Go` `local` `official`
- [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) - Accede a los tableros, repositorios y pipelines de Azure DevOps. `TS` `local` `official`
- [GitKraken](https://github.com/gitkraken/gk-cli) - CLI y MCP que envuelven GitKraken, Jira, GitHub y GitLab. `TS` `local` `official`
- [MCP Language Server](https://github.com/isaacphi/mcp-language-server) - Da a los agentes herramientas semánticas de código: definiciones, referencias y diagnósticos. `Go` `local`
- [Gitee](https://github.com/oschina/mcp-gitee) - Gestión de repositorios, issues y pull requests para Gitee. `TS` `local` `official`

## Automatización de navegador

- [Playwright](https://github.com/microsoft/playwright-mcp) - Controla un navegador a través del árbol de accesibilidad en lugar de capturas de pantalla. `TS` `local/remote` `official`
- [Chrome DevTools](https://github.com/ChromeDevTools/chrome-devtools-mcp) - Controla e inspecciona un Chrome en vivo para automatización, depuración y trazado de rendimiento. `TS` `local` `official`
- [browser-use](https://github.com/browser-use/browser-use) - Permite que los agentes controlen un navegador real para extraer datos y completar tareas. `Py` `local`
- [Browserbase](https://github.com/browserbase/mcp-server-browserbase) - Controla un navegador en la nube mediante la infraestructura de Browserbase y Stagehand. `TS` `local/remote` `official`
- [Stagehand](https://github.com/browserbase/stagehand) - Framework de automatización de navegador con IA, con primitivas act, extract y observe. `TS` `local/remote` `official`
- [Browser MCP](https://github.com/browsermcp/mcp) - Automatiza tu Chrome local mediante una extensión de navegador complementaria. `TS` `local`
- [Playwright (ExecuteAutomation)](https://github.com/executeautomation/mcp-playwright) - Automatización con Playwright de la comunidad, más herramientas de web scraping. `TS` `local`
- [Skyvern](https://github.com/Skyvern-AI/skyvern) - Automatiza flujos de trabajo en el navegador usando LLMs y visión por computadora. `Py` `local/remote`
- [Hyperbrowser](https://github.com/hyperbrowserai/mcp) - Plataforma de navegador en la nube para scraping y automatización con agentes. `TS` `local/remote` `official`
- [Selenium](https://github.com/angiejones/mcp-selenium) - Automatización de navegador a través del Selenium WebDriver. `JS` `local`
- [Puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) - Automatización de navegador y scraping mediante Puppeteer. `TS` `local` `archived`

## Búsqueda web y scraping

- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) - Obtén una URL y convierte su contenido a markdown. `Py` `local` `reference`
- [Firecrawl](https://github.com/firecrawl/firecrawl-mcp-server) - Haz scraping, rastrea y extrae datos web estructurados para LLMs. `TS` `local/remote` `official`
- [Exa](https://github.com/exa-labs/exa-mcp-server) - Búsqueda web neuronal, rastreo e investigación de empresas para agentes. `TS` `local/remote` `official`
- [Tavily](https://github.com/tavily-ai/tavily-mcp) - Búsqueda, extracción, mapeo y rastreo en tiempo real, ajustados para agentes. `TS` `local/remote` `official`
- [Brave Search](https://github.com/brave/brave-search-mcp-server) - Búsqueda web, local, de imágenes, videos y noticias mediante la Brave API. `TS` `local/remote` `official`
- [Perplexity](https://github.com/ppl-ai/modelcontextprotocol) - Investigación web en tiempo real mediante los modelos Sonar de Perplexity. `TS` `local/remote` `official`
- [Kagi](https://github.com/kagisearch/kagimcp) - Acceso a la API de búsqueda y resumen de Kagi. `Py` `local` `official`
- [DuckDuckGo](https://github.com/nickclyde/duckduckgo-mcp-server) - Búsqueda web y obtención de páginas mediante DuckDuckGo, sin clave de API. `Py` `local`
- [SearXNG](https://github.com/ihor-sokoliuk/mcp-searxng) - Consulta una instancia autoalojada del metabuscador SearXNG. `Py` `local`
- [Apify](https://github.com/apify/actors-mcp-server) - Ejecuta miles de scrapers y actors de Apify Store para obtener datos web. `TS` `local/remote` `official`
- [Bright Data](https://github.com/brightdata/brightdata-mcp) - Kit de herramientas de desbloqueo web, SERP y scraping. `JS` `local/remote` `official`
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - Rastreador de código abierto, pensado para LLMs, con un endpoint MCP integrado. `Py` `local`
- [Oxylabs](https://github.com/oxylabs/oxylabs-mcp) - API de scraping con renderizado dinámico y segmentación geográfica. `Py` `local/remote` `official`

## Bases de datos y almacenes de datos

- [PostgreSQL Pro](https://github.com/crystaldba/postgres-mcp) - Acceso a Postgres consciente del esquema, con comprobaciones de salud y SQL seguro. `Py` `local`
- [SQLite](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sqlite) - Consulta y gestiona bases de datos SQLite. `Py` `local` `archived`
- [MySQL](https://github.com/designcomputer/mysql_mcp_server) - Acceso a MySQL con permisos configurables e inspección de esquema. `Py` `local`
- [MongoDB](https://github.com/mongodb-js/mongodb-mcp-server) - Conecta agentes con bases de datos MongoDB y clústeres Atlas. `TS` `local/remote` `official`
- [Redis](https://github.com/redis/mcp-redis) - Interfaz en lenguaje natural para gestionar y buscar datos en Redis. `Py` `local` `official`
- [Supabase](https://github.com/supabase/mcp) - Gestiona Postgres, autenticación, almacenamiento y edge functions de Supabase. `TS` `local/remote` `official`
- [Neon](https://github.com/neondatabase/mcp-server-neon) - Gestiona proyectos, ramas y consultas de Postgres serverless de Neon. `TS` `local/remote` `official`
- [ClickHouse](https://github.com/ClickHouse/mcp-clickhouse) - Explora bases de datos y ejecuta SQL de solo lectura sobre ClickHouse. `Py` `local/remote` `official`
- [BigQuery](https://github.com/LucasHild/mcp-server-bigquery) - Consulta BigQuery con inspección de esquema y ejecución de SQL. `Py` `local`
- [Snowflake](https://github.com/isaacwasserman/mcp-snowflake-server) - Consulta Snowflake con acceso de lectura/escritura y seguimiento de insights. `Py` `local`
- [DuckDB](https://github.com/ktanaka101/mcp-server-duckdb) - Acceso a DuckDB con inspección de esquema y modo de solo lectura. `Py` `local`
- [MotherDuck](https://github.com/motherduckdb/mcp-server-motherduck) - Consulta datos con MotherDuck y DuckDB local. `Py` `local/remote` `official`
- [Prisma](https://github.com/prisma/mcp) - Gestiona bases de datos Prisma y ejecuta migraciones. `TS` `local/remote` `official`
- [Neo4j](https://github.com/neo4j-contrib/mcp-neo4j) - Explora el esquema y ejecuta Cypher sobre bases de datos de grafos Neo4j. `Py` `local` `official`
- [Airtable](https://github.com/domdomegg/airtable-mcp-server) - Lee y escribe registros de bases de Airtable con inspección de esquema. `TS` `local`
- [NocoDB](https://github.com/edwinbernadus/nocodb-mcp-server) - Lee y escribe registros de bases de datos NocoDB. `JS` `local`
- [Elasticsearch](https://github.com/elastic/mcp-server-elasticsearch) - Búsqueda en lenguaje natural sobre datos de Elasticsearch. `TS` `local` `official`
- [Tinybird](https://github.com/tinybirdco/mcp-tinybird) - Consulta la plataforma de analítica ClickHouse serverless de Tinybird. `Py` `local` `official`

## Conocimiento y memoria

- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Memoria persistente de grafo de conocimiento entre sesiones. `TS` `local` `reference`
- [Basic Memory](https://github.com/basicmachines-co/basic-memory) - Base de conocimiento en Markdown con enfoque local-first y memoria semántica persistente. `Py` `local`
- [mem0](https://github.com/coleam00/mcp-mem0) - Memoria de agente persistente a largo plazo respaldada por mem0. `Py` `local`
- [Memento](https://github.com/gannonh/memento-mcp) - Memoria de grafo de conocimiento respaldada por Neo4j con conciencia temporal. `TS` `local`
- [Reference](https://github.com/Kuberwastaken/reference) - Busca y recupera sesiones y memoria anteriores en Claude, Codex y otras herramientas de IA. `Py` `local`
- [Qdrant](https://github.com/qdrant/mcp-server-qdrant) - Almacena y recupera memorias semánticas en el motor vectorial Qdrant. `Py` `local/remote` `official`
- [Chroma](https://github.com/chroma-core/chroma-mcp) - Búsqueda vectorial, de texto completo y por metadatos sobre colecciones de Chroma. `Py` `local` `official`
- [Milvus](https://github.com/zilliztech/mcp-server-milvus) - Búsqueda vectorial, de texto e híbrida en la base de datos Milvus. `Py` `local/remote` `official`
- [Pinecone](https://github.com/pinecone-io/pinecone-mcp) - Busca documentos, gestiona índices y consulta datos en Pinecone. `TS` `local` `official`
- [Obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) - Lee, busca y edita notas en un vault de Obsidian. `Py` `local`
- [Apple Notes](https://github.com/sirmews/apple-notes-mcp) - Lee desde la base de datos local de Apple Notes en macOS. `Py` `local`
- [Logseq](https://github.com/apw124/logseq-mcp) - Interactúa con un grafo de conocimiento de Logseq. `Py` `local`
- [Graphlit](https://github.com/graphlit/graphlit-mcp-server) - Ingiere contenido de Slack, Gmail y la web en una base de conocimiento con búsqueda. `TS` `local/remote` `official`

## Archivos y manejo de documentos

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Operaciones seguras con archivos locales y controles de acceso configurables. `TS` `local` `reference`
- [Filesystem (Go)](https://github.com/mark3labs/mcp-filesystem-server) - Implementación en Go del acceso al sistema de archivos local. `Go` `local`
- [Everything Search](https://github.com/mamertofabian/mcp-everything-search) - Búsqueda rápida de archivos locales en Windows, macOS y Linux. `Py` `local`
- [Google Drive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) - Acceso y búsqueda de archivos para Google Drive. `TS` `local` `archived`
- [Microsoft 365](https://github.com/softeria/ms-365-mcp-server) - Accede a archivos, correo y calendario de Microsoft 365 mediante la Graph API. `TS` `local`
- [Box](https://github.com/hmk/box-mcp-server) - Busca y lee archivos en Box. `JS` `local`
- [Pandoc](https://github.com/vivekVells/mcp-pandoc) - Convierte documentos entre Markdown, HTML, PDF y docx. `Py` `local`
- [Unstructured](https://github.com/Unstructured-IO/UNS-MCP) - Crea flujos de trabajo de análisis e ingesta de documentos. `Py` `local/remote` `official`
- [Cloudinary](https://github.com/cloudinary/mcp-servers) - Sube, transforma, analiza y organiza recursos multimedia. `TS` `local/remote` `official`
- [llm-context](https://github.com/cyberchitta/llm-context.py) - Comparte código y contexto de archivos con LLMs mediante MCP o el portapapeles. `Py` `local`

## Nube, infraestructura y devops

- [AWS](https://github.com/awslabs/mcp) - Conjunto de servidores para servicios de AWS, CDK, costos, documentación y Bedrock. `Py` `local/remote` `official`
- [Azure](https://github.com/microsoft/mcp) - Accede a los servicios de Azure con autenticación de Entra ID. `C#` `local` `official`
- [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) - Servidores remotos para desarrollo, observabilidad y seguridad de Cloudflare. `TS` `remote` `official`
- [Google Cloud Run](https://github.com/GoogleCloudPlatform/cloud-run-mcp) - Despliega aplicaciones en Google Cloud Run. `TS` `local` `official`
- [Terraform](https://github.com/hashicorp/terraform-mcp-server) - Interactúa con el Terraform Registry y las APIs de HCP Terraform. `Go` `local/remote` `official`
- [Pulumi](https://www.pulumi.com/docs/ai/mcp-server/) - Ejecuta operaciones de infraestructura como código de Pulumi mediante las APIs de Automation y Cloud. `TS` `local` `official`
- [Kubernetes](https://github.com/Flux159/mcp-server-kubernetes) - Gestiona pods, deployments y servicios en Kubernetes. `TS` `local`
- [mcp-k8s-go](https://github.com/strowk/mcp-k8s-go) - Operaciones de clúster de Kubernetes: pods, registros y eventos. `Go` `local`
- [Docker](https://github.com/QuantGeekDev/docker-mcp) - Gestiona contenedores y stacks de Compose. `Py` `local`
- [Heroku](https://github.com/heroku/heroku-mcp-server) - Gestiona aplicaciones, Postgres y add-ons de Heroku. `TS` `local` `official`
- [Netlify](https://github.com/netlify/netlify-mcp) - Crea, compila, despliega y gestiona sitios de Netlify. `TS` `local` `official`
- [Nomad](https://github.com/kocierik/mcp-nomad) - Gestiona jobs y clústeres de HashiCorp Nomad. `Go` `local`
- [Hetzner Cloud](https://github.com/dkruyt/mcp-hetzner) - Interactúa con la API de Hetzner Cloud. `TS` `local`

## Monitoreo y observabilidad

- [Sentry](https://github.com/getsentry/sentry-mcp) - Recupera issues, trazas de pila y análisis de Seer AI. `TS` `local/remote` `official`
- [Grafana](https://github.com/grafana/mcp-grafana) - Accede a dashboards, fuentes de datos, alertas e incidentes. `Go` `local/remote` `official`
- [Axiom](https://github.com/axiomhq/mcp) - Consulta datos de observabilidad con el Axiom Processing Language. `TS` `remote` `official`
- [Logfire](https://github.com/pydantic/logfire-mcp) - Accede a trazas y métricas de OpenTelemetry mediante Pydantic Logfire. `Py` `local` `official`
- [VictoriaMetrics](https://github.com/VictoriaMetrics-Community/mcp-victoriametrics) - Consulta métricas y datos de observabilidad de VictoriaMetrics. `Go` `local`
- [SigNoz](https://github.com/DrDroidLab/signoz-mcp-server) - Consulta métricas, trazas y dashboards de SigNoz. `Py` `local`
- [Raygun](https://github.com/MindscapeHQ/mcp-server-raygun) - Accede a datos de reportes de fallos y monitoreo de usuarios reales. `TS` `local` `official`
- [Loki](https://github.com/scottlepp/loki-mcp) - Consulta datos de registros de Grafana Loki. `Go` `local`

## Seguridad

- [Semgrep](https://github.com/semgrep/mcp) - Escanea código en busca de vulnerabilidades de seguridad con Semgrep. `Py` `local/remote` `official`
- [OSV](https://github.com/StacklokLabs/osv-mcp) - Consulta la base de datos Open Source Vulnerabilities. `Go` `local`
- [Snyk](https://github.com/sammcj/mcp-snyk) - Escanea repositorios y proyectos mediante la CLI de Snyk. `TS` `local`
- [Burp Suite](https://github.com/PortSwigger/mcp-server) - Integra Burp Suite para pruebas de seguridad web. `Py` `local` `official`
- [HashiCorp Vault](https://github.com/hashicorp/vault-mcp-server) - Gestiona secretos y políticas en HashiCorp Vault. `Go` `local` `official`
- [Auth0](https://github.com/auth0/auth0-mcp-server) - Gestiona tenants de Auth0 con lenguaje natural. `TS` `local` `official`
- [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Realiza ingeniería inversa de binarios mediante la decompilación de Ghidra. `Java` `local`
- [IDA Pro](https://github.com/mrexodia/ida-pro-mcp) - Automatiza la ingeniería inversa con IDA Pro. `Py` `local`
- [Shodan](https://github.com/BurtTheCoder/mcp-shodan) - Consulta la inteligencia de red de Shodan con salida estructurada. `Py` `local`
- [VirusTotal](https://github.com/BurtTheCoder/mcp-virustotal) - Analiza archivos y URLs mediante la API de VirusTotal. `Py` `local`
- [1Password](https://github.com/goodwokdev/op-mcp) - Accede a la CLI de 1Password para gestionar secretos y vaults. `Rust` `local`

## Comunicación

- [Slack](https://github.com/korotovsky/slack-mcp-server) - Accede a espacios de trabajo de Slack mediante stdio, SSE y HTTP con historial inteligente. `Go` `local/remote`
- [WhatsApp](https://github.com/lharries/whatsapp-mcp) - Busca, lee y envía mensajes y contenido multimedia personales de WhatsApp. `Go` `local`
- [Gmail](https://github.com/GongRzhe/Gmail-MCP-Server) - Envía, busca y gestiona Gmail con OAuth automático. `TS` `local`
- [Telegram](https://github.com/chaindead/telegram-mcp) - Gestiona diálogos, mensajes y borradores de Telegram mediante MTProto. `Go` `local`
- [Twilio](https://github.com/twilio-labs/mcp) - Envía mensajes y gestiona números de teléfono mediante las APIs de Twilio. `TS` `local` `official`
- [LINE](https://github.com/line/line-bot-mcp-server) - Conecta un agente a una cuenta oficial de LINE. `TS` `local` `official`
- [Resend](https://github.com/Hawstein/resend-mcp) - Redacta y envía correo mediante la API de Resend. `TS` `local`
- [Mailgun](https://github.com/mailgun/mailgun-mcp-server) - Interactúa con la API de correo de Mailgun para envíos y analítica. `TS` `local` `official`
- [Bluesky](https://github.com/keturiosakys/bluesky-context-server) - Consulta y busca feeds y publicaciones de Bluesky mediante el AT Protocol. `TS` `local`
- [Intercom](https://github.com/intercom/intercom-mcp-server) - Busca conversaciones y contactos de Intercom. `TS` `remote` `official`

## Productividad y gestión de proyectos

- [Notion](https://github.com/makenotion/notion-mcp-server) - Lee y escribe páginas, bases de datos, bloques y comentarios de Notion. `TS` `local/remote` `official`
- [Linear](https://linear.app/docs/mcp) - Gestiona issues, proyectos y ciclos de Linear. `remote` `official`
- [Atlassian](https://github.com/atlassian/atlassian-mcp-server) - Accede a Jira, Confluence y Bitbucket mediante OAuth. `remote` `official`
- [Atlassian (community)](https://github.com/sooperset/mcp-atlassian) - Integración autoalojable de Jira y Confluence. `Py` `local`
- [Asana](https://developers.asana.com/docs/using-asanas-mcp-server) - Crea tareas y busca en el Asana Work Graph. `remote` `official`
- [monday.com](https://github.com/mondaycom/mcp) - Accede a los tableros, elementos y flujos de trabajo de monday.com. `TS` `local/remote` `official`
- [ClickUp](https://github.com/taazkareem/clickup-mcp-server) - Gestiona tareas, documentos, seguimiento de tiempo y comentarios de ClickUp. `TS` `local`
- [Todoist](https://github.com/abhiz123/todoist-mcp-server) - Gestiona tareas de Todoist con lenguaje natural. `TS` `local`
- [Trello](https://github.com/m0xai/trello-mcp-server) - Trabaja con tableros, listas y tarjetas de Trello. `TS` `local`
- [Google Calendar](https://github.com/nspady/google-calendar-mcp) - Gestiona eventos de Google Calendar con detección de conflictos. `TS` `local`
- [Apple Reminders](https://github.com/FradSer/mcp-server-apple-reminders) - Interactúa con Apple Reminders en macOS. `TS` `local`
- [Zapier](https://zapier.com/mcp) - Conecta agentes con miles de aplicaciones para acciones y disparadores. `remote` `official`
- [Taskade](https://github.com/taskade/mcp) - Gestiona tareas, proyectos y espacios de trabajo de Taskade. `TS` `local/remote` `official`
- [Webflow](https://github.com/webflow/mcp-server) - Diseña, estructura y gestiona sitios de Webflow mediante la Data API. `TS` `local/remote` `official`

## Finanzas y pagos

- [Stripe](https://github.com/stripe/agent-toolkit) - Gestiona pagos, facturación y clientes mediante la API de Stripe. `TS` `local/remote` `official`
- [PayPal](https://github.com/paypal/agent-toolkit) - Gestiona facturas, pagos, disputas y suscripciones. `TS` `local/remote` `official`
- [Xero](https://github.com/XeroAPI/xero-mcp-server) - Gestiona facturas, contactos y datos contables. `TS` `local` `official`
- [Chargebee](https://github.com/chargebee/agentkit) - Conecta agentes con la plataforma de facturación de suscripciones Chargebee. `TS` `local` `official`
- [CoinGecko](https://github.com/coingecko/coingecko-typescript) - Datos de precios y mercado de criptomonedas en monedas y exchanges. `TS` `local/remote` `official`
- [Financial Datasets](https://github.com/financial-datasets/mcp-server) - Datos del mercado de valores y fundamentales pensados para agentes. `Py` `local`
- [Alpaca](https://github.com/cesarvarela/alpaca-mcp) - Opera acciones y criptomonedas mediante las APIs de Alpaca. `Py` `local`
- [CoinCap](https://github.com/QuantGeekDev/coincap-mcp) - Datos de mercado de criptomonedas en tiempo real, sin clave de API. `TS` `local`

## Diseño y creatividad

- [Figma Dev Mode](https://developers.figma.com/docs/figma-mcp-server/) - Proporciona contexto de diseño y acceso al lienzo desde archivos de Figma. `local/remote` `official`
- [Figma Context](https://github.com/GLips/Figma-Context-MCP) - Alimenta a los agentes de programación con datos de maquetación y estilos de Figma. `TS` `local`
- [Blender](https://github.com/ahujasid/blender-mcp) - Controla Blender para el modelado 3D y la creación de escenas. `Py` `local`
- [AntV Chart](https://github.com/antvis/mcp-server-chart) - Genera gráficos con la biblioteca de visualización AntV. `TS` `local` `official`
- [ECharts](https://github.com/hustcc/mcp-echarts) - Genera gráficos con Apache ECharts. `TS` `local`
- [Mermaid](https://github.com/hustcc/mcp-mermaid) - Genera diagramas de Mermaid de forma dinámica. `TS` `local`
- [shadcn/ui](https://github.com/heilgar/shadcn-ui-mcp-server) - Explora e instala componentes de shadcn/ui. `TS` `local`
- [SlideSpeak](https://github.com/SlideSpeak/slidespeak-mcp) - Crea presentaciones y diapositivas de PowerPoint con IA. `Py` `local`

## IA, datos y analítica

- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - Razonamiento estructurado de varios pasos y revisable. `TS` `local` `reference`
- [Hugging Face](https://github.com/huggingface/hf-mcp-server) - Accede a modelos, datasets y Spaces de Hugging Face. `TS` `local/remote` `official`
- [Hugging Face Spaces](https://github.com/evalstate/mcp-hfspace) - Usa Hugging Face Spaces para modelos de imagen, audio y texto. `TS` `local`
- [Google Analytics](https://github.com/googleanalytics/google-analytics-mcp) - Consulta datos de analítica de GA4. `Py` `local` `official`
- [MindsDB](https://github.com/mindsdb/mindsdb) - Consulta y unifica datos entre plataformas como un único servidor MCP. `Py` `local/remote`
- [Vectorize](https://github.com/vectorize-io/vectorize-mcp-server) - Recuperación, investigación profunda y extracción de Markdown sobre Vectorize. `JS` `local/remote` `official`
- [ZenML](https://github.com/zenml-io/mcp-zenml) - Consulta pipelines de MLOps y LLMOps en ZenML. `Py` `local` `official`
- [Chronulus AI](https://github.com/ChronulusAI/chronulus-mcp) - Pronóstico y predicción multimodal sobre entradas arbitrarias. `Py` `local`

## Mapas y ubicación

- [Google Maps](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/google-maps) - Servicios de ubicación, indicaciones y detalles de lugares. `TS` `local` `archived`
- [Mapbox](https://github.com/mapbox/mcp-server) - Geocodificación, navegación e inteligencia geoespacial mediante Mapbox. `TS` `local/remote` `official`
- [QGIS](https://github.com/jjsantos01/qgis_mcp) - Conecta QGIS con agentes para operaciones geoespaciales. `Py` `local`
- [IPLocate](https://github.com/iplocate/mcp-server-iplocate) - Geolocalización de IP, información de red y detección de proxies. `TS` `local` `official`
- [AccuWeather](https://github.com/TimLukaHorstmann/mcp-weather) - Pronósticos meteorológicos mediante la API de AccuWeather. `TS` `local`
- [Globalping](https://github.com/jsdelivr/globalping-mcp-server) - Ejecuta sondas de ping, traceroute y DNS desde ubicaciones de todo el mundo. `TS` `local` `official`

## Medios y entretenimiento

- [ElevenLabs](https://github.com/elevenlabs/elevenlabs-mcp) - Texto a voz, clonación de voz y procesamiento de audio. `Py` `local/remote` `official`
- [YouTube](https://github.com/anaisbetts/mcp-youtube) - Descarga subtítulos y transcripciones de YouTube para su análisis. `TS` `local`
- [Spotify](https://github.com/varunneal/spotify-mcp) - Controla la reproducción y gestiona pistas, álbumes y listas de reproducción. `Py` `local`
- [VideoDB](https://github.com/video-db/agent-toolkit) - Edita video, realiza búsqueda semántica y transcribe. `Py` `local/remote` `official`
- [Godot](https://github.com/Coding-Solo/godot-mcp) - Inicia, ejecuta y depura el motor de juegos Godot. `TS` `local`
- [Unity](https://github.com/CoderGamester/mcp-unity) - Controla e interactúa con el editor de Unity. `C#` `local`
- [OP.GG](https://github.com/opgginc/opgg-mcp) - Estadísticas de juego en tiempo real de títulos populares. `TS` `local/remote` `official`

## Ciencia e investigación

- [ArXiv](https://github.com/blazickjp/arxiv-mcp-server) - Busca y analiza artículos de investigación de arXiv. `Py` `local`
- [BioMCP](https://github.com/genomoncology/biomcp) - Investigación biomédica en PubMed y ClinicalTrials.gov. `Py` `local`
- [PapersWithCode](https://github.com/hbg/mcp-paperswithcode) - Busca artículos de investigación, conferencias y las bases de código asociadas. `Py` `local`
- [OpenNutrition](https://github.com/deadletterq/mcp-opennutrition) - Busca alimentos, datos nutricionales y códigos de barras. `TS` `local`
- [gget](https://github.com/longevity-genie/gget-mcp) - Kit de herramientas de bioinformática y genómica que envuelve la biblioteca gget. `Py` `local`

## Todo lo demás

- [Time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - Conversión de hora y zona horaria. `Py` `local` `reference`
- [Everything](https://github.com/modelcontextprotocol/servers/tree/main/src/everything) - Servidor de referencia que ejercita todas las funciones de MCP, para probar clientes. `TS` `local` `reference`
- [Home Assistant](https://github.com/voska/hass-mcp) - Controla dispositivos del hogar inteligente a través de Home Assistant. `Py` `local`
- [Coreflux MQTT](https://github.com/CorefluxCommunity/CorefluxMCPServer) - Hub de automatización MQTT para interactuar con dispositivos IoT. `C#` `local`
- [Congress](https://github.com/amurshak/congressMCP) - Consulta datos legislativos de EE. UU. desde Congress.gov. `Py` `local`
- [eSignatures](https://github.com/esignaturescom/mcp-server-esignatures) - Redacta, revisa y envía contratos y plantillas. `Py` `local` `official`
- [ShopSavvy](https://github.com/shopsavvy/shopsavvy-mcp-server) - Consulta precios de productos por código de barras, ASIN o URL. `TS` `local` `official`

## Listas relacionadas

- [Model Context Protocol](https://github.com/modelcontextprotocol) - El protocolo oficial, los SDKs y los servidores de referencia.
- [MCP Registry](https://registry.modelcontextprotocol.io) - El registro oficial de servidores con espacios de nombres (vista previa).
- [awesome-codex-mcp-servers](https://github.com/Kuberwastaken/awesome-codex-mcp-servers) - El mismo catálogo, adaptado para OpenAI Codex.

## Contribuir

¿Encontraste un servidor que debería estar aquí, o detectaste un enlace roto? Las contribuciones son bienvenidas — por favor, lee primero las [pautas de contribución](CONTRIBUTING.md). Un proyecto por pull request, mantén la objetividad y colócalo en la categoría correcta.

---

Esta lista está dedicada al dominio público bajo [CC0-1.0](LICENSE). No está afiliada a Anthropic. «Claude» es una marca registrada de Anthropic; se utiliza aquí únicamente para describir compatibilidad.
