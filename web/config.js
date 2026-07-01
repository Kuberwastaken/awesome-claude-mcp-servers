// Per-site configuration. Only this file (plus the <title>/meta in index.html)
// differs between the Claude and Codex sites.
window.SITE = {
  client: "Claude",
  title: "Awesome Claude MCP Servers",
  tagline: "A searchable catalog of Model Context Protocol servers for Claude Desktop, Claude Code, and the Claude API.",
  repo: "https://github.com/Kuberwastaken/awesome-claude-mcp-servers",
  accent: "#c96442",
  sibling: {
    prompt: "On OpenAI Codex?",
    label: "awesome-codex-mcp-servers",
    href: "https://github.com/Kuberwastaken/awesome-codex-mcp-servers",
  },
  // A ready-to-adapt config skeleton for a given server. Placeholders are
  // intentional — the exact command/URL lives in each server's repo.
  snippet(server) {
    const remote = (server.runs || "").includes("remote");
    if (remote) {
      return [
        `# Claude Code — remote (HTTP)`,
        `claude mcp add --transport http ${server.id} <server-url>`,
        `# find the exact URL in ${server.url}`,
      ].join("\n");
    }
    return [
      `# Claude Code — local (stdio)`,
      `claude mcp add ${server.id} -- <command>`,
      `# e.g. npx -y <package> — see ${server.url}`,
    ].join("\n");
  },
  badge:
    "https://img.shields.io/badge/Awesome-Claude%20MCP-c96442?style=flat-square",
};
