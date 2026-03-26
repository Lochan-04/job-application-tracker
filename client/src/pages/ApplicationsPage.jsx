import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import { PriorityBadge, StatusBadge } from "../components/Badges";
import { jobTypeChoices, priorityChoices, statusChoices } from "../constants";
import { formatDateDisplay, labelFor } from "../utils";

export default function ApplicationsPage() {
  const [filters, setFilters] = useState({ q: "", status: "", sort: "updated" });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    api.get(`/applications?${params.toString()}`).then((response) => setApplications(response.data));
  }, [filters]);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-ink/10 bg-white/85 p-8 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">Applications</p>
            <h1 className="mt-2 font-display text-4xl font-bold">A simple view of every role you have applied for.</h1>
            <p className="mt-3 max-w-2xl text-slate">
              Search by company or role, sort the list your way, and quickly open the details you need before your next follow-up.
            </p>
          </div>
          <Link className="inline-flex rounded-2xl bg-navy px-5 py-3 font-medium text-canvas transition hover:-translate-y-0.5" to="/applications/new">
            New application
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-ink/10 bg-white/85 p-6 shadow-card">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">Filters</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Narrow the list</h2>
            <div className="mt-6 grid gap-4">
              <input className="form-control" placeholder="Search company, role, location, notes..." value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
              <select className="form-control" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
                <option value="">All statuses</option>
                {statusChoices.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select className="form-control" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
                <option value="updated">Recently updated</option>
                <option value="applied">Date applied</option>
                <option value="company">Company</option>
                <option value="followup">Follow-up date</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate">Your list</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Saved applications</h2>
          </div>
          {applications.map((application) => (
            <article key={application._id} className="rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-card transition hover:-translate-y-1">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-3xl font-bold">{application.role}</h2>
                    <StatusBadge value={application.status} label={labelFor(statusChoices, application.status)} />
                    <PriorityBadge value={application.priority} label={labelFor(priorityChoices, application.priority)} />
                  </div>
                  <p className="text-lg text-slate">{application.companyName}{application.location ? ` | ${application.location}` : ""}</p>
                  <div className="grid gap-3 text-sm text-slate sm:grid-cols-2 xl:grid-cols-3">
                    <span>Type: {labelFor(jobTypeChoices, application.jobType)}</span>
                    <span>Source: {application.source || "Not set"}</span>
                    <span>Applied: {formatDateDisplay(application.dateApplied)}</span>
                    <span>Resume: {application.resumeVersion || "Not set"}</span>
                    <span>Last contact: {application.lastContactedOn ? formatDateDisplay(application.lastContactedOn) : "Not set"}</span>
                    <span>Follow-up: {application.followUpDate ? formatDateDisplay(application.followUpDate) : "Not set"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium transition hover:bg-canvas" to={`/applications/${application._id}`}>Open</Link>
                  <Link className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-canvas transition hover:-translate-y-0.5" to={`/applications/${application._id}/edit`}>Edit</Link>
                </div>
              </div>
              <div className="mt-5 grid gap-4 border-t border-ink/10 pt-5 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Next step</p>
                  <p className="mt-2 text-slate">{application.nextStep || "No next step recorded yet."}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Notes</p>
                  <p className="mt-2 text-slate">{application.notes || "No notes yet."}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
