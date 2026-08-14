import { ArrowLeft, ArrowRight, Calculator, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { Link } from "wouter";

export default function Login() {
  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-mark"><Calculator size={26} /></div>
        <span className="eyebrow">KRISHOTATOR / OPTIONAL ACCOUNT</span>
        <h1 id="login-title">Keep your math close.</h1>
        <p>Sign in to unlock a more personal workspace. You can always continue as a guest and use the calculator without an account.</p>
        <button className="login-primary" type="button" onClick={() => startLogin()}>
          <UserRound size={17} />
          CONTINUE WITH GOOGLE
          <ArrowRight size={16} />
        </button>
        <Link href="/" className="login-guest"><ArrowLeft size={15} /> Continue as guest</Link>
        <small className="login-note">Secure OAuth sign-in. No login is required to calculate.</small>
      </section>
    </main>
  );
}
