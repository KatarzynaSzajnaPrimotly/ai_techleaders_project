import net from "node:net";

const LOOPBACK_HOST = "127.0.0.1";

export interface PortReservation {
  port: number;
  release: () => Promise<void>;
}

export async function reservePort(): Promise<PortReservation> {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, LOOPBACK_HOST, resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    throw new Error("Could not reserve an application port");
  }

  let active = true;
  return {
    port: address.port,
    release: async () => {
      if (!active) return;
      active = false;
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}
