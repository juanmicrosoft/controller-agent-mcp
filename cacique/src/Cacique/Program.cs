var version = typeof(Program).Assembly.GetName().Version?.ToString(3) ?? "unknown";
Console.WriteLine($"Cacique v{version}");
// MCP server initialization will be added here.
