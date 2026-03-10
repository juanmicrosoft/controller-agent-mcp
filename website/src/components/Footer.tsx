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
