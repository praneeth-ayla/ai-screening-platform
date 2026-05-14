"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/jobs", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        employmentType: formData.get("employmentType"),
        experienceLevel: formData.get("experienceLevel"),
        salaryMin: Number(formData.get("salaryMin")),
        salaryMax: Number(formData.get("salaryMax")),
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/recruiter/dashboard/jobs");
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
            Recruiter Dashboard
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Create new job
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Publish a new role and start receiving candidate applications
            through the AI interview platform.
          </p>
        </div>

        {/* Form */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Title */}
            <div>
              <label className="mb-3 block text-sm text-zinc-400">
                Job Title
              </label>

              <input
                name="title"
                placeholder="Senior Full Stack Developer"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-3 block text-sm text-zinc-400">
                Job Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the role responsibilities, requirements, and expectations..."
                required
                className="h-56 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-3 block text-sm text-zinc-400">
                Location
              </label>

              <input
                name="location"
                placeholder="Hyderabad, India"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
              />
            </div>

            {/* Selects */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none focus:border-white/20"
                >
                  <option value="">Select Employment Type</option>

                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERN">Internship</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-400">
                  Experience Level
                </label>

                <select
                  name="experienceLevel"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none focus:border-white/20"
                >
                  <option value="">Select Experience Level</option>

                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="mb-3 block text-sm text-zinc-400">
                Salary Range
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="number"
                  name="salaryMin"
                  placeholder="Minimum Salary"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                />

                <input
                  type="number"
                  name="salaryMax"
                  placeholder="Maximum Salary"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Creating Job..." : "Create Job"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/recruiter/dashboard/jobs")}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
