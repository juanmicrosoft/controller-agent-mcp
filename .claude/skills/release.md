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
