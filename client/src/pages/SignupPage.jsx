import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create account.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl py-8 sm:py-12">
      <div className="rounded-[2rem] border border-ink/10 bg-white/85 p-6 shadow-card sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-ink/50">Create account</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Create your placement tracker account</h1>
        <p className="mt-3 text-ink/65">
          Set up your account and manage jobs, internships, interviews, and follow-ups in one place.
        </p>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input className="form-control" placeholder="Choose a username" value={form.username} onChange={(event) => handleChange("username", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input className="form-control" placeholder="Enter your email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" className="form-control" placeholder="Create a password" value={form.password} onChange={(event) => handleChange("password", event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm your password" value={form.confirmPassword} onChange={(event) => handleChange("confirmPassword", event.target.value)} />
          </div>
          <button className="mt-3 rounded-2xl bg-ink px-5 py-3 font-medium text-canvas transition hover:-translate-y-0.5" type="submit">
            Create account
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/65">
          Already have an account?{" "}
          <Link className="font-medium text-pine underline decoration-coral decoration-2 underline-offset-4" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
