import { ServiceUnavailableError } from "../../http/errors";

/** Selects an explicitly configured adapter. Unset selectors never infer from NODE_ENV. */
export function selectAdapter<T>(name: string, registry: Readonly<Record<string, T>>, value: string | undefined): T {
  if (value === undefined || value.trim() === "") {
    throw new ServiceUnavailableError(`Required adapter configuration is missing: ${name}`);
  }
  if (!Object.hasOwn(registry, value)) {
    throw new ServiceUnavailableError(`No adapter is registered for ${name}: ${value}`);
  }
  return registry[value];
}
