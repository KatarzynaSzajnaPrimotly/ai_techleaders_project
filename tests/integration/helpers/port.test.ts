import net from "node:net";
import { describe, expect, it } from "vitest";
import { reservePort } from "./port";

describe("reservePort", () => {
  it("holds a loopback port until released and releases it only once", async () => {
    const reservation = await reservePort();
    const competingServer = net.createServer();
    await expect(new Promise<void>((resolve, reject) => {
      competingServer.once("error", reject);
      competingServer.listen(reservation.port, "127.0.0.1", resolve);
    })).rejects.toMatchObject({ code: "EADDRINUSE" });

    await reservation.release();
    await reservation.release();
    await new Promise<void>((resolve, reject) => {
      competingServer.once("error", reject);
      competingServer.listen(reservation.port, "127.0.0.1", resolve);
    });
    await new Promise<void>((resolve, reject) => competingServer.close((error) => error ? reject(error) : resolve()));
  });
});
