import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatEmploymentType(type: string) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatExperienceLevel(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      applications: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
            Open Positions
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Join our team
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Explore open roles and apply through our AI-powered screening
            platform.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="mt-14 grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/candidate/dashboard/${job.slug}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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

                  <h2 className="mt-5 text-2xl font-semibold transition group-hover:text-white">
                    {job.title}
                  </h2>

                  <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    {job.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                    <div>{job.applications.length} Applicants</div>

                    <div>
                      Posted{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(job.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 lg:items-end">
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="text-right">
                      <div className="text-sm text-zinc-500">Salary Range</div>

                      <div className="mt-1 text-lg font-semibold">
                        ₹{job.salaryMin?.toLocaleString() || "0"} - ₹
                        {job.salaryMax?.toLocaleString() || "0"}
                      </div>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition group-hover:scale-[1.02]">
                    View Job
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="mt-20 rounded-3xl border border-dashed border-white/10 bg-white/3 p-14 text-center">
            <h3 className="text-2xl font-semibold">No open positions yet</h3>

            <p className="mt-4 text-zinc-400">
              New opportunities will appear here once jobs are published.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
