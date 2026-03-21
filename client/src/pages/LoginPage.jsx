import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("logged_out") === "1") {
      setForm({ username: "", password: "" });
      setError("");
    }
  }, [searchParams]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to log in.");
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-8rem)] items-start gap-5 px-1 pt-4 sm:gap-6 sm:pt-6 md:gap-8 md:pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 lg:pt-14">
      <div className="order-2 mx-auto w-full max-w-[25rem] space-y-5 sm:max-w-[28rem] sm:space-y-6 md:max-w-[34rem] lg:order-1 lg:max-w-none lg:space-y-7">
        <span className="hidden rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-medium lg:inline-flex">
          Placement and job application tracker
        </span>
        <h1 className="max-w-[18rem] font-display text-[1.85rem] font-bold leading-[1.03] tracking-[-0.04em] sm:max-w-[23rem] sm:text-[2.45rem] md:max-w-[29rem] md:text-[3rem] lg:max-w-3xl lg:text-[4.15rem]">
          Track every job, internship, follow-up, and outcome in one organized workspace.
        </h1>
        <p className="max-w-[22rem] text-[0.98rem] leading-7 text-ink/70 sm:max-w-[27rem] sm:text-base md:max-w-xl md:text-lg md:leading-8">
          Built for practical placement use, this tracker helps you manage application history,
          recruiter contacts, follow-up timing, and next-step preparation without losing clarity.
        </p>
        <div className="grid max-w-[24rem] gap-3 rounded-[1.75rem] border border-ink/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(250,244,238,0.92))] p-3.5 shadow-card sm:max-w-[28rem] sm:grid-cols-3 sm:gap-4 sm:p-5 md:max-w-2xl">
          <div className="rounded-[1.35rem] bg-[linear-gradient(135deg,_rgba(192,235,214,0.98),_rgba(221,246,232,0.9))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Status flow</p>
            <p className="mt-2 text-base font-semibold text-ink">Wishlist to offer</p>
          </div>
          <div className="rounded-[1.35rem] bg-sky/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Structured data</p>
            <p className="mt-2 text-base font-semibold text-ink">Contacts, dates, notes</p>
          </div>
          <div className="rounded-[1.35rem] bg-gold/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Usability</p>
            <p className="mt-2 text-base font-semibold text-ink">Clear records for placement prep</p>
          </div>
        </div>
      </div>

      <div className="order-1 mx-auto w-full max-w-[25rem] space-y-3 sm:max-w-[28rem] sm:space-y-4 md:max-w-[34rem] lg:order-2 lg:max-w-none lg:space-y-5">
        <span className="inline-flex rounded-full border border-ink/10 bg-white/85 px-4 py-2 text-sm font-medium shadow-sm lg:hidden">
          Placement and job application tracker
        </span>
        <div className="rounded-[2rem] border border-ink/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94),_rgba(250,251,255,0.88))] p-5 shadow-card backdrop-blur-sm sm:p-6 md:p-7 lg:p-8">
          <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-ink/50">Welcome back</p>
          <h2 className="mt-2 max-w-[14rem] font-display text-[1.85rem] font-bold tracking-[-0.03em] sm:max-w-none sm:text-[2.05rem] md:text-[2.25rem]">
            Log into your tracker
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate">
            Use your existing account to open your application dashboard.
          </p>
          </div>
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="form-control"
                placeholder="Enter your username"
                autoComplete="off"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>
            <button className="w-full rounded-2xl bg-ink px-5 py-3 font-medium text-canvas transition hover:-translate-y-0.5" type="submit">
              Log in
            </button>
          </form>
          <p className="mt-6 text-sm text-ink/65">
            No account yet?{" "}
            <Link className="font-medium text-pine underline decoration-coral decoration-2 underline-offset-4" to="/signup">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
