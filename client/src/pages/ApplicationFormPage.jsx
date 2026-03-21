import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api";
import { jobTypeChoices, priorityChoices, statusChoices } from "../constants";
import { formatDateInput } from "../utils";

const emptyForm = {
  companyName: "",
  role: "",
  location: "",
  salaryRange: "",
  status: "applied",
  jobType: "full-time",
  source: "",
  applicationLink: "",
  contactName: "",
  contactEmail: "",
  priority: "medium",
  resumeVersion: "",
  nextStep: "",
  lastContactedOn: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  followUpDate: "",
  notes: ""
};

export default function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const pageTitle = useMemo(() => (id ? "Edit application" : "Add application"), [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    api.get(`/applications/${id}`).then((response) => {
      const item = response.data;
      setForm({
        companyName: item.companyName || "",
        role: item.role || "",
        location: item.location || "",
        salaryRange: item.salaryRange || "",
        status: item.status || "applied",
        jobType: item.jobType || "full-time",
        source: item.source || "",
        applicationLink: item.applicationLink || "",
        contactName: item.contactName || "",
        contactEmail: item.contactEmail || "",
        priority: item.priority || "medium",
        resumeVersion: item.resumeVersion || "",
        nextStep: item.nextStep || "",
        lastContactedOn: formatDateInput(item.lastContactedOn),
        dateApplied: formatDateInput(item.dateApplied),
        followUpDate: formatDateInput(item.followUpDate),
        notes: item.notes || ""
      });
    });
  }, [id]);

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (id) {
      await api.put(`/applications/${id}`, form);
      navigate(`/applications/${id}`);
      return;
    }
    const response = await api.post("/applications", form);
    navigate(`/applications/${response.data._id}`);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-ink/10 bg-[linear-gradient(135deg,_rgba(11,23,42,0.98),_rgba(19,34,56,0.92))] p-8 text-white shadow-card">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/50">Application editor</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{pageTitle}</h1>
          <p className="mt-4 text-white/70">Build a structured record for each placement opportunity with status, contact details, follow-ups, and preparation notes.</p>
        </div>
      </aside>

      <form className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/90 p-8 shadow-card lg:grid-cols-2" onSubmit={handleSubmit}>
        <Field label="Company Name"><input className="form-control" value={form.companyName} onChange={(event) => handleChange("companyName", event.target.value)} /></Field>
        <Field label="Role"><input className="form-control" value={form.role} onChange={(event) => handleChange("role", event.target.value)} /></Field>
        <Field label="Location"><input className="form-control" value={form.location} onChange={(event) => handleChange("location", event.target.value)} /></Field>
        <Field label="Salary Range"><input className="form-control" value={form.salaryRange} onChange={(event) => handleChange("salaryRange", event.target.value)} /></Field>
        <Field label="Status"><select className="form-control" value={form.status} onChange={(event) => handleChange("status", event.target.value)}>{statusChoices.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Job Type"><select className="form-control" value={form.jobType} onChange={(event) => handleChange("jobType", event.target.value)}>{jobTypeChoices.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Source"><input className="form-control" value={form.source} onChange={(event) => handleChange("source", event.target.value)} /></Field>
        <Field label="Application Link"><input className="form-control" value={form.applicationLink} onChange={(event) => handleChange("applicationLink", event.target.value)} /></Field>
        <Field label="Contact Name"><input className="form-control" value={form.contactName} onChange={(event) => handleChange("contactName", event.target.value)} /></Field>
        <Field label="Contact Email"><input className="form-control" value={form.contactEmail} onChange={(event) => handleChange("contactEmail", event.target.value)} /></Field>
        <Field label="Priority"><select className="form-control" value={form.priority} onChange={(event) => handleChange("priority", event.target.value)}>{priorityChoices.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Resume Version"><input className="form-control" value={form.resumeVersion} onChange={(event) => handleChange("resumeVersion", event.target.value)} /></Field>
        <Field label="Last Contacted On"><input type="date" className="form-control" value={form.lastContactedOn} onChange={(event) => handleChange("lastContactedOn", event.target.value)} /></Field>
        <Field label="Date Applied"><input type="date" className="form-control" value={form.dateApplied} onChange={(event) => handleChange("dateApplied", event.target.value)} /></Field>
        <Field label="Follow Up Date"><input type="date" className="form-control" value={form.followUpDate} onChange={(event) => handleChange("followUpDate", event.target.value)} /></Field>
        <Field label="Next Step" wide><input className="form-control" value={form.nextStep} onChange={(event) => handleChange("nextStep", event.target.value)} /></Field>
        <Field label="Notes" wide><textarea className="form-control" value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} /></Field>
        <div className="flex flex-wrap gap-3 pt-2 lg:col-span-2">
          <button className="rounded-2xl bg-navy px-5 py-3 font-medium text-canvas transition hover:-translate-y-0.5" type="submit">Save application</button>
          <Link className="rounded-2xl border border-ink/10 px-5 py-3 font-medium transition hover:bg-canvas" to="/applications">Cancel</Link>
        </div>
      </form>
    </section>
  );
}

function Field({ label, wide = false, children }) {
  return (
    <div className={wide ? "lg:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      {children}
    </div>
  );
}
