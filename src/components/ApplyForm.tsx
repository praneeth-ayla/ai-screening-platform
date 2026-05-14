"use client";

import { useState } from "react";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        linkedinUrl: formData.get("linkedinUrl"),
        portfolioUrl: formData.get("portfolioUrl"),
      }),
    });

    setLoading(false);

    if (response.ok) {
      setSuccess(true);
      e.currentTarget.reset();
    } else {
      alert("Something went wrong");
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
        <h3 className="text-lg font-semibold text-emerald-300">
          Application Submitted
        </h3>

        <p className="mt-3 text-sm leading-7 text-emerald-100/80">
          Your application has been submitted successfully. If shortlisted,
          you'll receive an AI screening interview shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">Full Name</label>

        <input
          required
          name="fullName"
          placeholder="John Doe"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Phone Number</label>

        <input
          required
          name="phone"
          placeholder="+91 9876543210"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">LinkedIn URL</label>

        <input
          name="linkedinUrl"
          placeholder="https://linkedin.com/in/username"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Portfolio URL
        </label>

        <input
          name="portfolioUrl"
          placeholder="https://yourportfolio.com"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
      </div>

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
