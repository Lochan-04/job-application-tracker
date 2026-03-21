import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api";
import { PriorityBadge, StatusBadge } from "../components/Badges";
import { jobTypeChoices, priorityChoices, statusChoices } from "../constants";
import { formatDateDisplay, labelFor } from "../utils";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`).then((response) => setApplication(response.data));
  }, [id]);

  if (!application) {
    return <div className="py-10 text-slate">Loading application...</div>;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${application.companyName}?`);
    if (!confirmed) {
      return;
    }
    await api.delete(`/applications/${id}`);
    navigate("/applications");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-8 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold">{application.role}</h1>
              <StatusBadge value={application.status} label={labelFor(statusChoices, application.status)} />
              <PriorityBadge value={application.priority} label={labelFor(priorityChoices, application.priority)} />
            </div>
            <p className="mt-3 text-xl text-slate">{application.companyName}{application.location ? ` | ${application.location}` : ""}</p>
            {application.nextStep ? (
              <div className="mt-5 rounded-2xl bg-canvas p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Immediate next step</p>
                <p className="mt-2 text-slate">{application.nextStep}</p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-2xl bg-navy px-5 py-3 font-medium text-canvas transition hover:-translate-y-0.5" to={`/applications/${id}/edit`}>Edit</Link>
            <button className="rounded-2xl border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50" onClick={handleDelete} type="button">Delete</button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <InfoCard label="Date applied" value={formatDateDisplay(application.dateApplied)} />
          <InfoCard label="Follow-up" value={formatDateDisplay(application.followUpDate)} />
          <InfoCard label="Last contacted" value={formatDateDisplay(application.lastContactedOn)} />
          <InfoCard label="Job type" value={labelFor(jobTypeChoices, application.jobType)} />
          <InfoCard label="Salary" value={application.salaryRange || "Not listed"} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold">Application details</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <DetailRow label="Source" value={application.source || "Not set"} />
              <DetailRow label="Resume version" value={application.resumeVersion || "Not set"} />
              <DetailRow label="Contact name" value={application.contactName || "Not set"} />
              <DetailRow label="Contact email" value={application.contactEmail || "Not set"} />
              <DetailRow label="Application link" value={application.applicationLink || "Not set"} link={application.applicationLink} />
            </dl>
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white/90 p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold">Notes and preparation</h2>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-slate">{application.notes || "No notes yet."}</p>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-canvas p-5">
      <p className="text-sm text-slate">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, link }) {
  return (
    <div>
      <dt className="text-slate">{label}</dt>
      <dd className="mt-1 text-base">
        {link ? <a className="text-pine underline decoration-coral decoration-2 underline-offset-4" href={link} target="_blank" rel="noreferrer">Open listing</a> : value}
      </dd>
    </div>
  );
}
