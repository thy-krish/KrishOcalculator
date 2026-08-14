/* Acid-Pop Lab: asymmetrical neo-editorial calculator workbench. Keep math rigorous, interactions snappy, and the equals audio affordance ready without inventing its final sound. */
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Bookmark,
  Calculator,
  ChevronDown,
  Copy,
  Delete,
  Eraser,
  History,
  Keyboard,
  LogOut,
  Moon,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sun,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/manus-storage/calc-lab-mark_6d9acf53.png";
const PAPER = "/manus-storage/lab-paper-texture_d60cfd69.png";
const WAVEFORM = "/manus-storage/waveform-sticker_041c2686.png";
const BRUH_AUDIO = "/manus-storage/calc-bruh_212688b9.wav";

type AngleMode = "DEG" | "RAD";
type HistoryItem = { expression: string; result: string; stamp: string };

type HistoryGroup = { label: string; items: HistoryItem[] };

function formatHistoryTime(stamp: string) {
  const date = new Date(stamp);
  return Number.isNaN(date.getTime()) ? stamp : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const buttonRows = [
  ["sin", "cos", "tan", "π", "e"],
  ["sin⁻¹", "cos⁻¹", "tan⁻¹", "ln", "log"],
  ["√", "x²", "xʸ", "(", ")"],
  ["7", "8", "9", "÷", "⌫"],
  ["4", "5", "6", "×", "AC"],
  ["1", "2", "3", "−", "%"],
  ["0", ".", "Ans", "+", "="],
];

const keyToLabel: Record<string, string> = {
  "/": "÷",
  "*": "×",
  "-": "−",
};

function formatResult(value: number) {
  if (!Number.isFinite(value)) return "not defined";
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-9)) {
    return value.toExponential(8).replace(/\.0+e/, "e");
  }
  return Number(value.toPrecision(12)).toString();
}

function factorial(n: number): number {
  if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n || n > 170) throw new Error("Factorial needs a whole number");
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function evaluateExpression(input: string, angle: AngleMode, ans: number) {
  let expression = input
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "PI")
    .replaceAll("Ans", "ANS")
    .replaceAll("^", "**")
    .replace(/(\d|\))(?=\()/g, "$1*")
    .replace(/(\d|\))(?=(PI|E|ANS))/g, "$1*")
    .replace(/(PI|E|ANS)(?=\d|\()/g, "$1*");

  expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
  let safety = 0;
  while (expression.includes("!")) {
    const next = expression.replace(/(\d+(?:\.\d+)?|\([^()]+\))!/g, (_match, part: string) => `factorial(${part})`);
    if (next === expression || safety++ > 20) throw new Error("Could not read factorial");
    expression = next;
  }

  const toRad = (n: number) => angle === "DEG" ? (n * Math.PI) / 180 : n;
  const fromRad = (n: number) => angle === "DEG" ? (n * 180) / Math.PI : n;
  const scope = {
    PI: Math.PI,
    E: Math.E,
    ANS: ans,
    factorial,
    sqrt: Math.sqrt,
    abs: Math.abs,
    pow: Math.pow,
    sin: (n: number) => Math.sin(toRad(n)),
    cos: (n: number) => Math.cos(toRad(n)),
    tan: (n: number) => Math.tan(toRad(n)),
    asin: (n: number) => fromRad(Math.asin(n)),
    acos: (n: number) => fromRad(Math.acos(n)),
    atan: (n: number) => fromRad(Math.atan(n)),
    ln: Math.log,
    log: Math.log10,
  };
  const fn = Function(...Object.keys(scope), `"use strict"; return (${expression});`);
  const value = fn(...Object.values(scope));
  if (typeof value !== "number" || Number.isNaN(value)) throw new Error("Check that expression");
  return value;
}

function translateFunction(label: string) {
  const translations: Record<string, string> = { sin: "sin(", cos: "cos(", tan: "tan(", "sin⁻¹": "asin(", "cos⁻¹": "acos(", "tan⁻¹": "atan(", ln: "ln(", log: "log(", "√": "sqrt(", "x²": "²", "xʸ": "^" };
  return translations[label] ?? label;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [angle, setAngle] = useState<AngleMode>("DEG");
  const [inverse, setInverse] = useState(false);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = window.localStorage.getItem("krishotator-history");
      return stored ? JSON.parse(stored) as HistoryItem[] : [];
    } catch {
      return [];
    }
  });
  const [dark, setDark] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => window.localStorage.getItem("krishotator-sound-muted") === "true");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const groupedHistory = useMemo<HistoryGroup[]>(() => {
    const groups = new Map<string, HistoryItem[]>();
    history.forEach((item) => {
      const date = new Date(item.stamp);
      const key = Number.isNaN(date.getTime()) ? "Earlier" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return Array.from(groups, ([label, items]) => ({ label, items }));
  }, [history]);
  const bruhRef = useRef<HTMLAudioElement | null>(null);

  const playEqualsCue = useCallback(() => {
    const bruh = bruhRef.current;
    if (!bruh || soundMuted) return;
    bruh.currentTime = 0;
    void bruh.play().catch(() => undefined);
  }, [soundMuted]);

  useEffect(() => {
    window.localStorage.setItem("krishotator-sound-muted", String(soundMuted));
  }, [soundMuted]);

  useEffect(() => {
    window.localStorage.setItem("krishotator-history", JSON.stringify(history));
  }, [history]);

  const displayExpression = expression || "0";
  const displayResult = result === "0" ? "" : `= ${result}`;

  const clear = useCallback(() => {
    setExpression("");
    setResult("0");
    setJustCalculated(false);
  }, []);

  const calculate = useCallback(() => {
    if (!expression.trim()) return;
    playEqualsCue();
    try {
      const value = evaluateExpression(expression, angle, ans);
      const formatted = formatResult(value);
      setResult(formatted);
      setAns(value);
      setHistory((items) => [{ expression, result: formatted, stamp: new Date().toISOString() }, ...items].slice(0, 24));
      setJustCalculated(true);
      // Audio-ready hook: connect the requested sound/narration here later.
      window.dispatchEvent(new CustomEvent("calc:equals", { detail: { expression, value } }));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Try again");
      setJustCalculated(false);
    }
  }, [angle, ans, expression, playEqualsCue]);

  const press = useCallback((label: string) => {
    if (label === "=") return calculate();
    if (label === "AC") return clear();
    if (label === "⌫") {
      setExpression((current) => current.slice(0, -1));
      return setResult("0");
    }
    if (label === "MC") return setMemory(0);
    if (label === "MR") return setExpression((current) => `${current}${formatResult(memory)}`);
    if (label === "M+") {
      try { setMemory((current) => current + evaluateExpression(expression || result, angle, ans)); toast.success("Memory stacked"); } catch { toast.error("Nothing numeric to store"); }
      return;
    }
    if (label === "M−") {
      try { setMemory((current) => current - evaluateExpression(expression || result, angle, ans)); toast.success("Memory updated"); } catch { toast.error("Nothing numeric to store"); }
      return;
    }
    if (label === "Ans") return setExpression((current) => `${current}${current ? "" : ""}Ans`);
    if (label === "sin⁻¹" || label === "cos⁻¹" || label === "tan⁻¹") return setExpression((current) => `${current}${translateFunction(label)}`);
    if (["sin", "cos", "tan", "ln", "log", "√"].includes(label)) return setExpression((current) => `${current}${translateFunction(label)}`);
    if (label === "x²") return setExpression((current) => `${current}^2`);
    if (label === "xʸ") return setExpression((current) => `${current}^`);
    if (label === "π" || label === "e") return setExpression((current) => `${current}${label}`);
    setJustCalculated(false);
    setExpression((current) => `${current}${label}`);
  }, [angle, ans, calculate, clear, expression, memory, result]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "m") { event.preventDefault(); setSoundMuted((value) => !value); toast.message(soundMuted ? "Sound on" : "Sound muted", { duration: 1200 }); return; }
      if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); return; }
      if (event.key === "Escape") return clear();
      if (event.key === "Backspace") return press("⌫");
      const label = keyToLabel[event.key] ?? event.key;
      if (/^[0-9.+()/%]$/.test(label) || ["×", "÷", "−"].includes(label)) press(label);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [calculate, clear, press, soundMuted]);

  const memoryLabel = useMemo(() => memory === 0 ? "empty" : formatResult(memory), [memory]);

  return (
    <main className={dark ? "app-shell dark-shell" : "app-shell"} style={{ backgroundImage: `url(${PAPER})` }}>
      <audio ref={bruhRef} src={BRUH_AUDIO} preload="auto" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src={MARK} alt="Calc Lab mark" />
          <div><div className="brand-name">KRISHOTATOR</div><div className="brand-kicker">scientific, but make it yours</div></div>
        </div>
        <div className="top-actions">
          <span className="status-pill"><span className="status-dot" /> {isAuthenticated ? "synced mode" : "guest mode"}</span>
          {isAuthenticated ? <button className="account-chip" type="button" onClick={() => void logout()} title="Sign out"><span>{user?.name ?? "signed in"}</span><LogOut size={14} /></button> : <button className="login-button" type="button" onClick={() => startLogin()}>SIGN IN WITH GOOGLE <ArrowRight size={14} /></button>}
          <button className={soundMuted ? "icon-button muted" : "icon-button"} type="button" aria-label={soundMuted ? "Unmute equals sound" : "Mute equals sound"} title={soundMuted ? "Unmute equals sound" : "Mute equals sound"} onClick={() => setSoundMuted((value) => !value)}>{soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <button className="icon-button" type="button" aria-label="Toggle theme" onClick={() => setDark((value) => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </header>

      <section className="workbench">
        <div className="calculator-card">
          <div className="card-topline"><span className="eyebrow">01 / calculate</span><span className="tiny-note"><Keyboard size={14} /> keyboard ready</span></div>
          <div className="display-panel" aria-live="polite">
            <div className="display-meta"><span>{angle} mode</span><span>{inverse ? "INV functions" : "standard functions"}</span></div>
            <div className="expression-display">{displayExpression}</div>
            <div className={`result-display ${justCalculated ? "result-flash" : ""}`}>{displayResult}</div>
          </div>
          <div className="control-row">
            <div className="segmented-control" aria-label="Angle mode"><button className={angle === "DEG" ? "active" : ""} onClick={() => setAngle("DEG")} type="button">DEG</button><button className={angle === "RAD" ? "active" : ""} onClick={() => setAngle("RAD")} type="button">RAD</button></div>
            <button className={inverse ? "chip-button active-chip" : "chip-button"} type="button" onClick={() => setInverse((value) => !value)}>INV</button>
            <span className="memory-readout">M <b>{memoryLabel}</b></span>
          </div>
          <div className="keypad" aria-label="Calculator keypad">
            {buttonRows.flatMap((row) => row).map((label) => {
              const functionKey = ["sin", "cos", "tan", "π", "e", "sin⁻¹", "cos⁻¹", "tan⁻¹", "ln", "log", "√", "x²", "xʸ", "(", ")"].includes(label);
              const operatorKey = ["÷", "×", "−", "+", "%"].includes(label);
              const isEquals = label === "=";
              const shown = inverse && label === "sin" ? "sin⁻¹" : inverse && label === "sin⁻¹" ? "sin" : inverse && label === "cos" ? "cos⁻¹" : inverse && label === "cos⁻¹" ? "cos" : inverse && label === "tan" ? "tan⁻¹" : inverse && label === "tan⁻¹" ? "tan" : label;
              return <button key={label} type="button" className={`calc-key ${functionKey ? "function-key" : ""} ${operatorKey ? "operator-key" : ""} ${isEquals ? "equals-key" : ""} ${label === "AC" || label === "⌫" ? "utility-key" : ""}`} onClick={() => press(shown)}>{isEquals ? <><span>=</span><img src={WAVEFORM} alt="" /></> : label === "⌫" ? <Delete size={20} /> : shown}</button>;
            })}
          </div>
          <div className="shortcut-note"><Zap size={14} /> Tip: press <kbd>Enter</kbd> to solve, <kbd>M</kbd> to mute, <kbd>Esc</kbd> to reset</div>
        </div>

        <aside className="notes-rail">
          <div className="rail-header"><div><span className="eyebrow">02 / lab notes</span><h1>Make the numbers behave.</h1></div><img className="rail-sticker" src={WAVEFORM} alt="" /></div>
          <div className="note-card coral-card"><div className="note-label">ANGLE MODE</div><p>{angle === "DEG" ? "Degrees on. Your trig is feeling seen." : "Radians on. Deep math mode unlocked."}</p><span className="scribble">↳ switch upstairs</span></div>
          <div className="note-card lime-card"><div className="note-label">MEMORY STACK</div><p className="memory-value">{memoryLabel}</p><div className="memory-actions"><button type="button" onClick={() => press("M+")}>M+</button><button type="button" onClick={() => press("M−")}>M−</button><button type="button" onClick={() => press("MR")}>MR</button><button type="button" onClick={() => press("MC")}>MC</button></div></div>
          <div className="history-card"><div className="history-heading"><span><History size={16} /> LAST MOVES</span><button type="button" aria-label="Clear history" onClick={() => setHistory([])}><Trash2 size={15} /></button></div>{history.length === 0 ? <div className="empty-history"><Bookmark size={18} /><span>Your solved stuff lands here.</span></div> : <div className="history-list">{history.slice(0, 3).map((item, index) => <button type="button" className="history-item" key={`${item.expression}-${index}`} onClick={() => { setExpression(item.expression); setResult(item.result); }}><span>{item.expression}</span><b>{item.result}</b></button>)}</div>}<button type="button" className="history-trigger" onClick={() => setHistoryOpen(true)}>OPEN FULL HISTORY <span className="history-trigger-end"><span className="history-badge">{history.length}</span><ArrowRight size={15} /></span></button></div>
          <div className="rail-footer"><AudioLines size={18} /><span>Equals is audio-ready.<br /><b>Tell us the vibe later.</b></span><ArrowRight size={16} /></div>
        </aside>
      </section>
      {historyOpen && <><button className="history-scrim" aria-label="Close history" onClick={() => setHistoryOpen(false)} type="button" /><aside className="history-drawer" aria-label="Calculation history"><div className="drawer-top"><div><span className="eyebrow">03 / archive</span><h2>Previous calculations.</h2></div><button className="drawer-close" type="button" onClick={() => setHistoryOpen(false)} aria-label="Close history"><X size={19} /></button></div><p className="drawer-copy">Your recent math, kept close. Tap a line to bring it back to the display.</p>{history.length === 0 ? <div className="drawer-empty"><Bookmark size={22} /><span>No solved expressions yet.</span></div> : <div className="drawer-list">{groupedHistory.map((group) => <section className="history-group" key={group.label}><div className="history-group-label"><span>{group.label}</span><span>{group.items.length} {group.items.length === 1 ? "calculation" : "calculations"}</span></div>{group.items.map((item, index) => <button type="button" className="drawer-item" key={`${item.expression}-${item.stamp}-${index}`} onClick={() => { setExpression(item.expression); setResult(item.result); setHistoryOpen(false); }}><span className="drawer-index">{String(index + 1).padStart(2, "0")}</span><span className="drawer-equation"><b>{item.expression}</b><small>{formatHistoryTime(item.stamp)}</small></span><strong>{item.result}</strong></button>)}</section>)}</div>}<button type="button" className="drawer-clear" onClick={() => setHistory([])}><Trash2 size={15} /> clear archive</button></aside></>}
      <footer className="app-footer"><span>KRISHOTATOR v1.0</span><span>built for curious brains · no cloud, no fuss</span><span><ArrowLeft size={12} /> swipe the rail on mobile</span></footer>
    </main>
  );
}
