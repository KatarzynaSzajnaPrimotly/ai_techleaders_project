export interface HarnessEnvironmentInput {
  base: NodeJS.ProcessEnv;
  databaseUrl: string;
  appUrl: string;
  fakeServerUrl: string;
  jwtSecret: string;
}

export function createHarnessEnvironment({ base, databaseUrl, appUrl, fakeServerUrl, jwtSecret }: HarnessEnvironmentInput): NodeJS.ProcessEnv {
  return {
    ...base,
    DEVMENTOR_DATABASE_URL: databaseUrl,
    NODE_ENV: "production",
    APP_URL: appUrl,
    JWT_SECRET: jwtSecret,
    GITHUB_CLIENT_ID: "devmentor-integration-client",
    GITHUB_CLIENT_SECRET: "devmentor-integration-secret",
    GITHUB_OAUTH_BASE_URL: fakeServerUrl,
    GITHUB_API_BASE_URL: fakeServerUrl,
    MAILER_TRANSPORT: "log",
    TRUST_PROXY_HOPS: "1",
    ALLOW_INSECURE_HTTP: "true",
  };
}
