import Link from "next/link";
import prisma from "@/lib/prisma";

function formatEmploymentType(type: string) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatExperienceLevel(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export default async function RecruiterJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
              Recruiter Dashboard
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              Manage jobs
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              View published openings, track applicant activity, and manage
              hiring positions from a single dashboard.
            </p>
          </div>

          <Link
            href="/recruiter/dashboard/jobs/create"
            className="inline-flex h-fit items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90"
          >
            Create New Job
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="mt-14 grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-white/20"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                {/* Left */}
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      {formatEmploymentType(job.employmentType)}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {formatExperienceLevel(job.experienceLevel)}
                    </span>

                    {job.location && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {job.location}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                    {job.title}
                  </h2>

                  <p className="mt-4 line-clamp-3 text-sm leading-8 text-zinc-400">
                    {job.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                    <span>{job._count.applications} Applicants</span>

                    <span>
                      Posted{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(job.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-4 lg:items-end">
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="text-left lg:text-right">
                      <div className="text-sm text-zinc-500">Salary Range</div>

                      <div className="mt-1 text-lg font-semibold">
                        ₹{job.salaryMin?.toLocaleString() || "0"} - ₹
                        {job.salaryMax?.toLocaleString() || "0"}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/recruiter/dashboard/jobs/${job.id}`}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
                    >
                      Manage Job
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/3 p-14 text-center">
              <h3 className="text-2xl font-semibold">No jobs created yet</h3>

              <p className="mt-4 text-zinc-400">
                Start by creating your first job posting.
              </p>

              <Link
                href="/recruiter/dashboard/jobs/create"
                className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90"
              >
                Create Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
