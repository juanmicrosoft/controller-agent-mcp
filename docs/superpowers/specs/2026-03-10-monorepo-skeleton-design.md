# Monorepo Skeleton Design

**Date:** 2026-03-10
**Status:** Approved

## Overview

This document describes the skeleton structure for the `controller-agent-mcp` monorepo, which will host multiple projects under a flat top-level directory layout.

## Projects

### controller-agent-mcp (C# dotnet tool)

An MCP server that allows coding agents to coordinate work between them. One master agent orchestrates multiple slave agents across different machines using Azure Queues as the message bus. Slaves register with the MCP, enter listening mode, execute commands received via queue messages, and respond back to the master.

### website (React / Vite / Tailwind)

A marketing and documentation site for the Controller Agent MCP project. Version number is surfaced in the footer, kept in sync with the MCP package version.

## Repo Structure

```
controller-agent-mcp/           # C# dotnet tool (MCP server)
  src/
    ControllerAgentMcp/
      ControllerAgentMcp.csproj
      Program.cs
  tests/
    ControllerAgentMcp.Tests/
      ControllerAgentMcp.Tests.csproj
  ControllerAgentMcp.slnx

website/                        # React/Vite/Tailwind marketing site
  public/
  src/
    components/
    pages/
    App.tsx
    main.tsx
  index.html
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
  package.json

.github/
  workflows/
    deploy-website.yml          # Deploys to Azure Static Web Apps on version tag
    publish-nuget.yml           # Publishes dotnet tool to NuGet on version tag

.claude/
  skills/
    release.md                  # Custom release skill

.gitignore
LICENSE
README.md
```

## GitHub Workflows

### publish-nuget.yml
- Trigger: version tag push (`v*.*.*`)
- Steps: checkout → setup .NET → build → test → pack → push to NuGet.org
- Secret required: `NUGET_API_KEY`

### deploy-website.yml
- Trigger: version tag push (`v*.*.*`)
- Steps: checkout → setup Node → npm install → npm run build → deploy to Azure Static Web Apps
- Secret required: `AZURE_STATIC_WEB_APPS_API_TOKEN`

## Branch Protection

Main branch (`main`) is protected:
- No direct pushes allowed
- Pull request required before merging
- At least 1 approving review required
- Enforced via `gh` CLI during skeleton setup

## Versioning

- Starting version: `0.0.1`
- Patch increments: `0.0.1` → `0.0.9` (then roll to `0.1.0`)
- Minor increments: `0.1.0` → `0.1.9` (then roll to `0.2.0`)
- All releases marked pre-release in GitHub until `1.0.0`
- Version is the single source of truth in `ControllerAgentMcp.csproj`
- `website/package.json` is kept in sync
- Website footer displays the current version (injected at build time via env var)

## Release Skill (`.claude/skills/release.md`)

Invoked via `/release`. Workflow:
1. Read current version from `ControllerAgentMcp.csproj`
2. Compute next version following the scheme above
3. Update version in `ControllerAgentMcp.csproj` and `website/package.json`
4. Create branch `release/vX.X.X`, commit changes, push, open PR
5. After PR is merged, tag `vX.X.X` is pushed to main — this triggers both deploy workflows

## README

Root `README.md` includes:
- Project name and one-line description
- Badges: build status, NuGet version, license
- Sections: Overview, Architecture, Getting Started, Projects, Contributing, License
