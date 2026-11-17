export interface HarnessEnvironmentInput {
  base: NodeJS.ProcessEnv;
  databaseUrl: string;
  appUrl: string;
  fakeServerUrl: string;
  jwtSecret: string;
  operatorEmail: string;
  listedMentorEmail: string;
}

export function createHarnessEnvironment({ base, databaseUrl, appUrl, fakeServerUrl, jwtSecret, operatorEmail, listedMentorEmail }: HarnessEnvironmentInput): NodeJS.ProcessEnv {
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
    INVITATION_TTL_DAYS: "14",
    MENTOR_PUBLISH_WINDOW_DAYS: "14",
    // Deterministic integration-only bounds; production has no defaults.
    PRICE_MIN_25_CENTS: "1000",
    PRICE_MAX_25_CENTS: "60000",
    PRICE_MIN_50_CENTS: "18000",
    PRICE_MAX_50_CENTS: "120000",
    OPERATOR_EMAILS: `${operatorEmail},${listedMentorEmail}`,
    ALLOW_INSECURE_HTTP: "true",
  };
}
