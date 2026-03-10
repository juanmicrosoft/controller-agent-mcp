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
