# `next build` fails with NODE_ENV=development

`next build` fails prerendering `/_global-error` (`Cannot read properties of null (reading 'useContext')`)
when the shell exports `NODE_ENV=development`, as the sandbox does. Run `NODE_ENV=production npm run build`.
Not caused by the monorepo move (React is deduped to a single copy).
