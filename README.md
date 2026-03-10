# Cacique

[![Build](https://github.com/juanmicrosoft/cacique/actions/workflows/publish-nuget.yml/badge.svg)](https://github.com/juanmicrosoft/cacique/actions/workflows/publish-nuget.yml)
[![NuGet](https://img.shields.io/nuget/v/Cacique.svg)](https://www.nuget.org/packages/Cacique)
[![License](https://img.shields.io/github/license/juanmicrosoft/cacique)](LICENSE)

An MCP server that allows coding agents to coordinate work between them across multiple machines using Azure Queues.

## Overview

Cacique implements a master/slave coordination model for AI coding agents. One master agent orchestrates multiple slave agents, each running on a different machine, using Azure Storage Queues as the message bus.

## Architecture

- **Master agent** — coordinates work, dispatches commands to slaves, collects results
- **Slave agents** — register with the MCP, enter listening mode, execute commands, respond back
- **Azure Queues** — message transport layer shared by all agents via a common connection string

## Getting Started

### Install the MCP tool

```bash
dotnet tool install --global Cacique
```

### Configure

Set the Azure Storage connection string via MCP configuration or environment variable.

## Projects

| Project | Description |
|---------|-------------|
| [`cacique/`](cacique/) | C# dotnet tool — the MCP server |
| [`website/`](website/) | Marketing and documentation site |

## Contributing

All contributions go through pull requests. Direct pushes to `main` are not allowed.

## License

Apache 2.0 — see [LICENSE](LICENSE).
