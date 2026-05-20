# pr-submit

Read the skill definition at `docs/skills/pr-submit.md` and execute all five steps exactly as described there.

Use `$ARGUMENTS` as the task identifier (e.g. `T2`, `moxie-467`).

After building the PR title and body per the skill template, run:

```bash
gh pr create --title "<title>" --body "<body>"
```

or, if a PR already exists for the current branch:

```bash
gh pr edit --title "<title>" --body "<body>"
```

Do not ask for confirmation before running the gh command unless a 🔴 unresolved review issue is detected, in which case warn the user first.
