const MIN_REQUEST_COUNT = 1;

export async function runConcurrently<Result>(
  count: number,
  requestFn: (index: number) => Result | Promise<Result>,
): Promise<Result[]> {
  if (!Number.isInteger(count) || count < MIN_REQUEST_COUNT) {
    throw new RangeError(`count must be an integer greater than or equal to ${MIN_REQUEST_COUNT}`);
  }

  let ready = 0;
  let releaseStart: () => void = () => undefined;
  const start = new Promise<void>((resolve) => { releaseStart = resolve; });
  const requests = Array.from({ length: count }, async (_unused, index) => {
    ready += 1;
    if (ready === count) releaseStart();
    await start;
    return requestFn(index);
  });
  return Promise.all(requests);
}
