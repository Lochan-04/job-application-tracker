import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import { StatusBadge } from "../components/Badges";
import { statusChoices } from "../constants";
import { formatDateDisplay, labelFor } from "../utils";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/applications/summary").then((response) => setSummary(response.data));
  }, []);

  if (!summary) {
    return <div className="py-10 text-slate">Loading dashboard...</div>;
  }

  const safeTotal = Math.max(summary.totalCount || 0, 1);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(11,23,42,0.98),_rgba(19,34,56,0.92))] p-6 text-white shadow-card sm:p-8 xl:p-10">
          <div className="max-w-3xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/50">Placement Dashboard</p>
              <h1 className="mt-4 max-w-[12ch] font-display text-[2.35rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[3.2rem] xl:max-w-[12ch] xl:text-[4.1rem]">
                Manage jobs and internships with a cleaner, placement-ready workflow.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8 lg:text-lg">
                Track application status, follow-ups, resume versions, recruiter touchpoints, and next steps in one structured dashboard designed for real-world usability.
              </p>
            </div>
            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
              <Link className="hero-action hero-action-primary" to="/applications/new">Add application</Link>
              <Link className="hero-action hero-action-secondary" to="/applications">View records</Link>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard dark label="Total applications" value={summary.totalCount} />
            <MetricCard label="Active pipeline" value={summary.activeCount} />
            <MetricCard label="Response rate" value={`${summary.responseRate}%`} />
            <MetricCard green label="High priority" value={summary.highPriorityCount} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white/85 p-8 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">Status Mix</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Pipeline balance</h2>
            </div>
            <span className="rounded-full bg-sky px-3 py-1 text-sm font-medium text-ink">{summary.offerCount} offers</span>
          </div>
          <div className="mt-6 space-y-4">
            {statusChoices.map(([value, label]) => {
              const count = summary.statusCounts?.[value] || 0;
              return (
                <div key={value}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate">{label}</span>
                    <span className="font-medium text-ink">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-coral" style={{ width: `${(count / safeTotal) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <MetricCard subtle label="Interviews in progress" value={summary.interviewCount} />
            <MetricCard subtle label="Follow-ups due" value={summary.dueFollowUpCount} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">Recent records</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Latest applications</h2>
            </div>
            <Link className="text-sm font-medium text-pine" to="/applications">See all</Link>
          </div>
          <div className="space-y-4">
            {summary.recentApplications?.map((application) => (
              <Link key={application._id} to={`/applications/${application._id}`} className="block rounded-3xl border border-ink/10 bg-canvas/80 p-5 transition hover:-translate-y-0.5 hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xl font-bold">{application.role}</p>
                    <p className="text-slate">{application.companyName}{application.location ? ` | ${application.location}` : ""}</p>
                  </div>
                  <StatusBadge value={application.status} label={labelFor(statusChoices, application.status)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate">
                  <span>Applied {formatDateDisplay(application.dateApplied)}</span>
                  <span>{labelFor([["full-time","Full Time"],["part-time","Part Time"],["contract","Contract"],["internship","Internship"],["remote","Remote"]], application.jobType)}</span>
                  {application.resumeVersion ? <span>{application.resumeVersion}</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <PanelList title="Upcoming follow-ups" eyebrow="Action queue" badge="Stay proactive" items={summary.upcomingFollowUps} />
          <PanelList title="Interview-ready applications" eyebrow="Interview lane" items={summary.interviewPipeline} interview />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, dark = false, green = false, subtle = false }) {
  const className = dark
    ? "rounded-3xl bg-white/8 p-5 backdrop-blur-sm"
    : green
      ? "rounded-3xl bg-pine p-5 text-canvas"
      : subtle
        ? "rounded-3xl bg-canvas p-5"
        : "rounded-3xl bg-white p-5 text-ink";

  return (
    <div className={className}>
      <p className={`text-sm ${dark ? "text-white/60" : green ? "text-canvas/70" : "text-slate"}`}>{label}</p>
      <p className="mt-3 font-display text-4xl font-bold">{value}</p>
    </div>
  );
}

function PanelList({ title, eyebrow, badge, items = [], interview = false }) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-card">
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">{eyebrow}</p>
          <h2 className="mt-2 max-w-[12rem] font-display text-[1.8rem] font-bold leading-tight sm:max-w-none sm:text-2xl">{title}</h2>
        </div>
        {badge ? <span className="shrink-0 rounded-full bg-gold/30 px-3 py-1 text-sm font-medium text-ink">{badge}</span> : null}
      </div>
      <div className="space-y-4">
        {items.length ? items.map((application) => (
          <div key={application._id} className={`rounded-3xl ${interview ? "bg-canvas" : "border border-ink/10 bg-white"} p-5`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{application.companyName}</p>
                <p className="text-sm text-slate">{application.role}</p>
                {application.nextStep ? <p className="mt-2 text-sm text-slate">{interview ? `Next step: ${application.nextStep}` : application.nextStep}</p> : null}
              </div>
              {interview ? (
                <StatusBadge value={application.status} label={labelFor(statusChoices, application.status)} />
              ) : (
                <p className="font-display text-xl font-bold">{formatDateDisplay(application.followUpDate, { month: "short", day: "2-digit" })}</p>
              )}
            </div>
          </div>
        )) : <div className="rounded-3xl border border-dashed border-ink/15 p-6 text-slate">Nothing here yet.</div>}
      </div>
    </div>
  );
}
