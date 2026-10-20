# git push and gh in the sandbox

- `git push` over HTTPS fails with `could not read Username for 'https://github.com'`: the sandbox has no git credentials,
  only a logged-in `gh`. Push with a one-off helper that changes no config:
  `git -c credential.helper= -c credential.helper='!gh auth git-credential' push -u origin <branch>`.
- `jq` is not installed. `gh api ... --jq` works (the filter is built into `gh`), and `python3` parses JSON when more is
  needed. The tracker descriptor's `remove_label` calls the `jq` binary; use `gh api` with a URL-encoded label instead.
- `gh` is 2.65.0, below the 2.82.1 the tracker descriptor requires. Create and edit issues and labels through
  `gh api` (REST), as the descriptor's guards do; `gh issue create/edit` and `gh pr edit` can abort on the Projects
  (classic) deprecation. `gh pr create` worked here, but read the result before relying on it.
