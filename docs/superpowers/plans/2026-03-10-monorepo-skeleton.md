# Monorepo Skeleton Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the controller-agent-mcp monorepo with a C# dotnet tool MCP server, a React/Vite/Tailwind marketing website, GitHub CI/CD workflows, branch protection, and a release skill.

**Architecture:** Flat monorepo with two top-level project directories (`controller-agent-mcp/` and `website/`). A shared versioning scheme (starting at `0.0.1`) is maintained in the C# `.csproj` and `website/package.json`. GitHub Actions workflows fire on version tags. A custom Claude Code skill (`/release`) automates the release PR flow.

**Tech Stack:** C# / .NET 9 / dotnet tool packaging / xUnit, TypeScript / React 18 / Vite / Tailwind CSS 3, GitHub Actions, Azure Static Web Apps, NuGet

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `.gitignore` | Modify | Add .NET and Node artifact exclusions |
| `README.md` | Create | Root placeholder with badges and project sections |
| `controller-agent-mcp/ControllerAgentMcp.slnx` | Create | Solution file referencing both C# projects |
| `controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj` | Create | Dotnet tool package definition, version source of truth |
| `controller-agent-mcp/src/ControllerAgentMcp/Program.cs` | Create | Placeholder entry point |
| `controller-agent-mcp/tests/ControllerAgentMcp.Tests/ControllerAgentMcp.Tests.csproj` | Create | xUnit test project |
| `controller-agent-mcp/tests/ControllerAgentMcp.Tests/PlaceholderTest.cs` | Create | Single placeholder passing test |
| `website/package.json` | Create | Node project, version kept in sync with csproj |
| `website/index.html` | Create | Vite entry HTML |
| `website/vite.config.ts` | Create | Vite config — injects `__APP_VERSION__` from package.json |
| `website/tailwind.config.ts` | Create | Tailwind config scoped to `src/**` |
| `website/tsconfig.json` | Create | TypeScript config |
| `website/tsconfig.node.json` | Create | TypeScript config for Vite config file |
| `website/src/main.tsx` | Create | React entry point |
| `website/src/App.tsx` | Create | Root app component, renders Home |
| `website/src/pages/Home.tsx` | Create | Placeholder home/landing page |
| `website/src/components/Footer.tsx` | Create | Footer showing `__APP_VERSION__` |
| `.github/workflows/publish-nuget.yml` | Create | Build, test, pack, push to NuGet on version tag |
| `.github/workflows/deploy-website.yml` | Create | Build and deploy website to Azure Static Web Apps on version tag |
| `.claude/skills/release.md` | Create | Claude Code skill for computing next version, updating files, creating release PR |

---

## Chunk 1: Repo Foundation

### Task 1: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Replace `.gitignore` with its final correct content**

Note: ignore only the settings file, not the whole `.claude/` directory — the `skills/` subdirectory must be committed.

```gitignore
# Claude Code settings (skills are committed; only ignore the settings file)
.claude/settings.json

# .NET
bin/
obj/
*.user
*.suo
.vs/
*.nupkg
*.snupkg

# Node / website
node_modules/
website/dist/
website/.env
website/.env.local
```

- [ ] **Step 2: Verify the file looks correct**

```bash
cat .gitignore
```

Expected: file shows `.claude/settings.json` (not `.claude/`) as the ignore rule.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore for .NET and Node artifacts"
```

---

### Task 2: Create root README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create the file**

```markdown
# Controller Agent MCP

[![Build](https://github.com/juanmicrosoft/controller-agent-mcp/actions/workflows/publish-nuget.yml/badge.svg)](https://github.com/juanmicrosoft/controller-agent-mcp/actions/workflows/publish-nuget.yml)
[![NuGet](https://img.shields.io/nuget/v/ControllerAgentMcp.svg)](https://www.nuget.org/packages/ControllerAgentMcp)
[![License](https://img.shields.io/github/license/juanmicrosoft/controller-agent-mcp)](LICENSE)

An MCP server that allows coding agents to coordinate work between them across multiple machines using Azure Queues.

## Overview

Controller Agent MCP implements a master/slave coordination model for AI coding agents. One master agent orchestrates multiple slave agents, each running on a different machine, using Azure Storage Queues as the message bus.

## Architecture

- **Master agent** — coordinates work, dispatches commands to slaves, collects results
- **Slave agents** — register with the MCP, enter listening mode, execute commands, respond back
- **Azure Queues** — message transport layer shared by all agents via a common connection string

## Getting Started

### Install the MCP tool

```bash
dotnet tool install --global ControllerAgentMcp
```

### Configure

Set the Azure Storage connection string via MCP configuration or environment variable.

## Projects

| Project | Description |
|---------|-------------|
| [`controller-agent-mcp/`](controller-agent-mcp/) | C# dotnet tool — the MCP server |
| [`website/`](website/) | Marketing and documentation site |

## Contributing

All contributions go through pull requests. Direct pushes to `main` are not allowed.

## License

Apache 2.0 — see [LICENSE](LICENSE).
```

- [ ] **Step 2: Verify the file was created**

```bash
test -f README.md && echo OK
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add placeholder root README"
```

---

## Chunk 2: C# MCP Skeleton

### Task 3: Create solution file

**Files:**
- Create: `controller-agent-mcp/ControllerAgentMcp.slnx`

- [ ] **Step 1: Create the directory and .slnx file**

```bash
mkdir -p controller-agent-mcp/src/ControllerAgentMcp
mkdir -p controller-agent-mcp/tests/ControllerAgentMcp.Tests
```

Create `controller-agent-mcp/ControllerAgentMcp.slnx`:

```xml
<Solution>
  <Project Path="src/ControllerAgentMcp/ControllerAgentMcp.csproj" />
  <Project Path="tests/ControllerAgentMcp.Tests/ControllerAgentMcp.Tests.csproj" />
</Solution>
```

- [ ] **Step 2: Verify the file was created**

```bash
test -f controller-agent-mcp/ControllerAgentMcp.slnx && echo OK
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add controller-agent-mcp/ControllerAgentMcp.slnx
git commit -m "chore: add solution file"
```

---

### Task 4: Create the MCP dotnet tool project

**Files:**
- Create: `controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj`
- Create: `controller-agent-mcp/src/ControllerAgentMcp/Program.cs`

- [ ] **Step 1: Create `ControllerAgentMcp.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <PackAsTool>true</PackAsTool>
    <ToolCommandName>controller-agent-mcp</ToolCommandName>
    <PackageId>ControllerAgentMcp</PackageId>
    <Version>0.0.1</Version>
    <Authors>juanmicrosoft</Authors>
    <Description>An MCP server that allows coding agents to coordinate work between them using Azure Queues.</Description>
    <PackageLicenseExpression>Apache-2.0</PackageLicenseExpression>
    <PackageProjectUrl>https://github.com/juanmicrosoft/controller-agent-mcp</PackageProjectUrl>
    <RepositoryUrl>https://github.com/juanmicrosoft/controller-agent-mcp</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
    <PackageTags>mcp;agents;azure;queues;coordination</PackageTags>
  </PropertyGroup>
</Project>
```

- [ ] **Step 2: Create `Program.cs`**

```csharp
Console.WriteLine("Controller Agent MCP v0.0.1");
// MCP server initialization will be added here.
```

- [ ] **Step 3: Verify build**

```bash
cd controller-agent-mcp
dotnet build src/ControllerAgentMcp/ControllerAgentMcp.csproj
```

Expected: `Build succeeded.`

- [ ] **Step 4: Commit**

```bash
git add controller-agent-mcp/src/
git commit -m "feat: add C# MCP dotnet tool skeleton at v0.0.1"
```

---

### Task 5: Create the test project

**Files:**
- Create: `controller-agent-mcp/tests/ControllerAgentMcp.Tests/ControllerAgentMcp.Tests.csproj`
- Create: `controller-agent-mcp/tests/ControllerAgentMcp.Tests/PlaceholderTest.cs`

- [ ] **Step 1: Create `ControllerAgentMcp.Tests.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <IsPackable>false</IsPackable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.11.1" />
    <PackageReference Include="xunit" Version="2.9.0" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.8.2" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\..\src\ControllerAgentMcp\ControllerAgentMcp.csproj" />
  </ItemGroup>
</Project>
```

- [ ] **Step 2: Create `PlaceholderTest.cs`**

```csharp
namespace ControllerAgentMcp.Tests;

public class PlaceholderTest
{
    [Fact]
    public void Placeholder_ShouldPass()
    {
        // This test exists to validate the test infrastructure.
        // Replace with real tests as the MCP server is implemented.
        Assert.True(true);
    }
}
```

- [ ] **Step 3: Run tests**

```bash
cd controller-agent-mcp
dotnet test tests/ControllerAgentMcp.Tests/ControllerAgentMcp.Tests.csproj
```

Expected: `Failed: 0, Passed: 1, Skipped: 0, Total: 1`

- [ ] **Step 4: Commit**

```bash
git add controller-agent-mcp/tests/
git commit -m "test: add placeholder test project"
```

---

## Chunk 3: Website Skeleton

### Task 6: Initialize the website project

**Files:**
- Create: `website/package.json`
- Create: `website/tsconfig.json`
- Create: `website/tsconfig.node.json`
- Create: `website/index.html`

- [ ] **Step 1: Create `website/package.json`**

```json
{
  "name": "controller-agent-mcp-website",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.5.3",
    "vite": "^5.4.8"
  }
}
```

- [ ] **Step 2: Create `website/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `website/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `website/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Controller Agent MCP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Commit**

```bash
git add website/package.json website/tsconfig.json website/tsconfig.node.json website/index.html
git commit -m "feat: add website project config files"
```

---

### Task 7: Configure Vite and Tailwind

**Files:**
- Create: `website/vite.config.ts`
- Create: `website/tailwind.config.ts`
- Create: `website/postcss.config.js`

- [ ] **Step 1: Create `website/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
) as { version: string }

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
```

- [ ] **Step 2: Create `website/tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Create `website/postcss.config.js`**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Commit**

```bash
git add website/vite.config.ts website/tailwind.config.ts website/postcss.config.js
git commit -m "feat: configure Vite and Tailwind"
```

---

### Task 8: Create React source files

**Files:**
- Create: `website/src/main.tsx`
- Create: `website/src/index.css`
- Create: `website/src/App.tsx`
- Create: `website/src/pages/Home.tsx`
- Create: `website/src/components/Footer.tsx`

- [ ] **Step 1: Declare the global `__APP_VERSION__` type**

Create `website/src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
```

- [ ] **Step 2: Create `website/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create `website/src/main.tsx`**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 4: Create `website/src/components/Footer.tsx`**

```typescript
export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-500">
      Controller Agent MCP &mdash; v{__APP_VERSION__} &mdash;{' '}
      <a
        href="https://github.com/juanmicrosoft/controller-agent-mcp"
        className="underline hover:text-gray-700"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </footer>
  )
}
```

- [ ] **Step 5: Create `website/src/pages/Home.tsx`**

```typescript
import { Footer } from '../components/Footer'

export function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Controller Agent MCP
        </h1>
        <p className="max-w-xl text-lg text-gray-600">
          An MCP server that allows coding agents to coordinate work across
          multiple machines using Azure Queues.
        </p>
        <a
          href="https://github.com/juanmicrosoft/controller-agent-mcp"
          className="rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 6: Create `website/src/App.tsx`**

```typescript
import { Home } from './pages/Home'

export default function App() {
  return <Home />
}
```

- [ ] **Step 7: Install dependencies and verify build**

```bash
cd website
npm install
npm run build
```

Expected: `dist/` directory created, no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add website/src/ website/src/vite-env.d.ts
git commit -m "feat: add React/Tailwind website skeleton with versioned footer"
```

---

## Chunk 4: GitHub Workflows

### Task 9: Create NuGet publish workflow

**Files:**
- Create: `.github/workflows/publish-nuget.yml`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/publish-nuget.yml`:

```yaml
name: Publish to NuGet

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Build
        run: dotnet build controller-agent-mcp/ControllerAgentMcp.slnx --configuration Release

      - name: Test
        run: dotnet test controller-agent-mcp/tests/ControllerAgentMcp.Tests/ControllerAgentMcp.Tests.csproj --configuration Release --no-build

      - name: Pack
        run: dotnet pack controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj --configuration Release --no-build --output ./nupkg

      - name: Push to NuGet
        run: dotnet nuget push ./nupkg/*.nupkg --api-key ${{ secrets.NUGET_API_KEY }} --source https://api.nuget.org/v3/index.json --skip-duplicate
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/publish-nuget.yml
git commit -m "ci: add NuGet publish workflow on version tag"
```

---

### Task 10: Create Azure Static Web Apps deploy workflow

**Files:**
- Create: `.github/workflows/deploy-website.yml`

- [ ] **Step 1: Create `.github/workflows/deploy-website.yml`**

```yaml
name: Deploy Website

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: website

      - name: Build
        run: npm run build
        working-directory: website

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: website
          output_location: dist
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-website.yml
git commit -m "ci: add Azure Static Web Apps deploy workflow on version tag"
```

---

## Chunk 5: Branch Protection and Release Skill

### Task 11: Set branch protection on main

- [ ] **Step 1: Apply branch protection via gh CLI**

```bash
gh api repos/juanmicrosoft/controller-agent-mcp/branches/main/protection \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  --field "required_status_checks=null" \
  --field "enforce_admins=false" \
  --field "required_pull_request_reviews[required_approving_review_count]=1" \
  --field "restrictions=null"
```

Expected: HTTP 200 with protection object returned.

- [ ] **Step 2: Verify in GitHub**

```bash
gh api repos/juanmicrosoft/controller-agent-mcp/branches/main/protection \
  --jq '.required_pull_request_reviews.required_approving_review_count'
```

Expected: `1`

---

### Task 12: Create the release skill

**Files:**
- Create: `.claude/skills/release.md`

- [ ] **Step 1: Create `.claude/skills/release.md`**

```markdown
# Release Skill

Use when the user invokes `/release` or asks to cut a new release.

## What This Skill Does

Computes the next version, updates all version files, creates a release branch, commits, pushes, and opens a pull request. The tag is pushed manually AFTER the PR is merged to main, which triggers the deploy workflows.

## Versioning Rules

Starting at `0.0.1`. Rules:
- If patch < 9: increment patch (e.g. `0.0.3` → `0.0.4`)
- If patch = 9: increment minor, reset patch to 0 (e.g. `0.0.9` → `0.1.0`)
- If minor = 9 and patch = 9: increment major, reset minor and patch (e.g. `0.9.9` → `1.0.0`)
- All releases are GitHub pre-releases until version reaches `1.0.0`

## Steps

1. **Read current version** from `controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj`:

   ```bash
   grep -oP '(?<=<Version>)[^<]+' controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj
   ```

2. **Compute the next version** following the rules above.

3. **Update `ControllerAgentMcp.csproj`** — replace `<Version>OLD</Version>` with `<Version>NEW</Version>`

4. **Update `website/package.json`** — replace `"version": "OLD"` with `"version": "NEW"`

5. **Create release branch and commit:**

   ```bash
   git checkout -b release/vNEW
   git add controller-agent-mcp/src/ControllerAgentMcp/ControllerAgentMcp.csproj website/package.json
   git commit -m "chore: bump version to vNEW"
   git push origin release/vNEW
   ```

6. **Open pull request:**

   ```bash
   gh pr create \
     --title "Release vNEW" \
     --body "## Release vNEW\n\nBumps version from vOLD to vNEW.\n\nAfter merging, push the tag to trigger deployments:\n\`\`\`\ngit tag vNEW\ngit push origin vNEW\n\`\`\`" \
     --base main \
     --head release/vNEW
   ```

7. **Tell the user:**
   - The PR URL
   - After merging, run: `git tag vNEW && git push origin vNEW`
   - This will trigger `publish-nuget.yml` and `deploy-website.yml`

## Pre-release Marking

When pushing the tag, if version < `1.0.0`, mark the GitHub release as pre-release:

```bash
gh release create vNEW --prerelease --title "vNEW" --notes "Release vNEW"
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/release.md
git commit -m "feat: add /release skill for versioned release PR workflow"
```

---

### Task 13: Push all commits to remote

- [ ] **Step 1: Push to origin**

```bash
git push origin main
```

Expected: All commits pushed. Note: after branch protection is applied (Task 11), subsequent changes must go via PR — this push is the last direct push.

---

## Post-Setup Checklist

After all tasks are complete, verify:

- [ ] `gh repo view juanmicrosoft/controller-agent-mcp` shows the repo with README
- [ ] `gh api repos/juanmicrosoft/controller-agent-mcp/branches/main/protection --jq '.required_pull_request_reviews'` confirms protection is active
- [ ] `cd controller-agent-mcp && dotnet test` passes
- [ ] `cd website && npm run build` produces a `dist/` folder
- [ ] `ls .github/workflows/` shows both workflow files
- [ ] `/release` skill is available in Claude Code
