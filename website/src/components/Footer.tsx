export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-500">
      Cacique &mdash; v{__APP_VERSION__} &mdash;{' '}
      <a
        href="https://github.com/juanmicrosoft/cacique"
        className="underline hover:text-gray-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  )
}
