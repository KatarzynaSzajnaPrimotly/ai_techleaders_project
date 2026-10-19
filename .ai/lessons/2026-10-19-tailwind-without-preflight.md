# Tailwind pages need explicit resets (no preflight)

`globals.css` deliberately omits Tailwind's preflight, so browser defaults leak into utility-built pages:

- `<a>` keeps the default blue/purple link colour: give links a colour (`text-inherit` or a token) and `no-underline`.
- `border-dashed`/`border-dotted` on a single side (`border-t`) draws all four sides at the default 3px width, because
  preflight's `border: 0 solid` is missing: add `border-0` before `border-t`.
- `h1`-`h3`, `p`, `ul`, `ol` keep their margins and list styles: add `m-0`, `list-none p-0`.

Found while building the Mentora home page; caught only by looking at a screenshot (unit tests cannot see it).
Emoji render as boxes in the sandbox browser because it has no emoji font; that is an environment limit, not a bug.
