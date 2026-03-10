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
