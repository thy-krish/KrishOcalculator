import { describe, expect, it } from "vitest";
import { getHistorySyncNotice, mergeAccountHistory, selectActiveHistory, shareCalculation, shouldShowHistorySyncToast, type HistoryItem } from "./history";

const guest: HistoryItem[] = [
  { expression: "2+2", result: "4", stamp: "2026-08-14T10:00:00.000Z" },
  { expression: "9×9", result: "81", stamp: "2026-08-14T09:00:00.000Z" },
];

const remote: HistoryItem[] = [
  { expression: "3+3", result: "6", stamp: "2026-08-14T11:00:00.000Z" },
];

describe("history mode boundaries", () => {
  it("restores guest-local history after leaving account mode", () => {
    const account = [{ expression: "3+3", result: "6", stamp: "2026-08-14T11:00:00.000Z" }];
    expect(selectActiveHistory(true, guest, account)).toBe(account);
    expect(selectActiveHistory(false, guest, account)).toBe(guest);
  });
});

describe("history sync toast", () => {
  it("fires only after authenticated history data is ready and only once", () => {
    expect(shouldShowHistorySyncToast(false, true, false)).toBe(false);
    expect(shouldShowHistorySyncToast(true, false, false)).toBe(false);
    expect(shouldShowHistorySyncToast(true, true, false)).toBe(true);
    expect(shouldShowHistorySyncToast(true, true, true)).toBe(false);
  });
  it("uses the expected copy after an authenticated merge", () => {
    expect(getHistorySyncNotice(0)).toBe("Your archive is ready for new math.");
    expect(getHistorySyncNotice(1)).toBe("1 calculation is synced.");
    expect(getHistorySyncNotice(3)).toBe("3 calculations are synced.");
  });
});

describe("shareCalculation", () => {
  it("uses native sharing when available", async () => {
    let payload = "";
    const outcome = await shareCalculation({ share: async ({ text }) => { payload = text; }, clipboard: { writeText: async () => undefined } }, guest[0]);
    expect(outcome).toBe("shared");
    expect(payload).toContain("2+2 = 4");
  });

  it("falls back to clipboard when native sharing is unavailable", async () => {
    let copied = "";
    const outcome = await shareCalculation({ clipboard: { writeText: async (text) => { copied = text; } } }, guest[0]);
    expect(outcome).toBe("copied");
    expect(copied).toContain("2+2 = 4");
  });
});

describe("mergeAccountHistory", () => {
  it("keeps remote account rows and imports guest-only rows without duplicates", () => {
    expect(mergeAccountHistory(remote, guest)).toEqual([
      remote[0],
      guest[0],
      guest[1],
    ]);
  });

  it("does not mutate either source collection", () => {
    const guestCopy = structuredClone(guest);
    const remoteCopy = structuredClone(remote);
    mergeAccountHistory(remote, guest);
    expect(guest).toEqual(guestCopy);
    expect(remote).toEqual(remoteCopy);
  });
});
