export type HistoryItem = { expression: string; result: string; stamp: string };

export function selectActiveHistory(isAuthenticated: boolean, guest: HistoryItem[], account: HistoryItem[]): HistoryItem[] {
  return isAuthenticated ? account : guest;
}

export type ShareTarget = {
  share?: (data: { title: string; text: string }) => Promise<void>;
  clipboard: { writeText: (text: string) => Promise<void> };
};

export async function shareCalculation(target: ShareTarget, item: HistoryItem): Promise<"shared" | "copied"> {
  const text = `KRISHOTATOR\\n${item.expression} = ${item.result}`;
  if (target.share) {
    await target.share({ title: "KRISHOTATOR calculation", text });
    return "shared";
  }
  await target.clipboard.writeText(text);
  return "copied";
}

export function mergeAccountHistory(remote: HistoryItem[], guest: HistoryItem[], limit = 24): HistoryItem[] {
  const remoteKeys = new Set(remote.map((item) => `${item.expression}|${item.result}`));
  const guestOnly = guest.filter((item) => !remoteKeys.has(`${item.expression}|${item.result}`));
  return [...remote, ...guestOnly]
    .sort((a, b) => b.stamp.localeCompare(a.stamp))
    .slice(0, limit);
}
