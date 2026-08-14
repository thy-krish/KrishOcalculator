import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("history procedures", () => {
  it("rejects history access for guests", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.history.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects empty history entries before touching the database", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 7,
      openId: "history-test-user",
      email: null,
      name: "History Tester",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.history.add({ expression: "", result: "4" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
