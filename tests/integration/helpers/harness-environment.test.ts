import { describe, expect, it } from "vitest";
import { createHarnessEnvironment } from "./harness-environment";

describe("integration harness environment", () => {
  it("preserves the base environment and explicitly configures auth test services", () => {
    expect(createHarnessEnvironment({
      base: { PATH: "/usr/bin", CUSTOM_SETTING: "keep" },
      databaseUrl: "postgresql://throwaway/db",
      appUrl: "http://127.0.0.1:4123",
      fakeServerUrl: "http://127.0.0.1:4234",
      jwtSecret: "random-test-secret",
      operatorEmail: "operator@example.test",
      listedMentorEmail: "mentor@example.test",
    })).toEqual({
      PATH: "/usr/bin",
      CUSTOM_SETTING: "keep",
      DEVMENTOR_DATABASE_URL: "postgresql://throwaway/db",
      NODE_ENV: "production",
      APP_URL: "http://127.0.0.1:4123",
      JWT_SECRET: "random-test-secret",
      GITHUB_CLIENT_ID: "devmentor-integration-client",
      GITHUB_CLIENT_SECRET: "devmentor-integration-secret",
      GITHUB_OAUTH_BASE_URL: "http://127.0.0.1:4234",
      GITHUB_API_BASE_URL: "http://127.0.0.1:4234",
      MAILER_TRANSPORT: "log",
      TRUST_PROXY_HOPS: "1",
      OPERATOR_EMAILS: "operator@example.test,mentor@example.test",
      ALLOW_INSECURE_HTTP: "true",
    });
  });
});
