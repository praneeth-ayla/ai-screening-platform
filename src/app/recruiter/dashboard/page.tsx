import Link from "next/link";
import prisma from "@/lib/prisma";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function RecruiterDashboardPage() {
  const [
    totalJobs,
    totalApplications,
    totalInterviews,
    recentApplications,
    recentJobs,
  ] = await Promise.all([
    prisma.job.count(),

    prisma.jobApplication.count(),

    prisma.interview.count(),

    prisma.jobApplication.findMany({
      take: 5,
      orderBy: {
        appliedAt: "desc",
      },
      include: {
        job: true,
        interview: true,
      },
    }),

    prisma.job.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        applications: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
              Recruiter Dashboard
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              Hiring overview
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Manage open positions, review candidate applications, and monitor
              AI interview performance across your hiring pipeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/recruiter/dashboard/jobs"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              Manage Jobs
            </Link>

            <Link
              href="/recruiter/dashboard/jobs/create"
              className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90"
            >
              Create New Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-sm text-zinc-400">Total Jobs</div>

            <h2 className="mt-5 text-5xl font-semibold tracking-tight">
              {totalJobs}
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Active and published job openings currently available on the
              platform.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-sm text-zinc-400">Applications</div>

            <h2 className="mt-5 text-5xl font-semibold tracking-tight">
              {totalApplications}
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Total candidate applications received across all job postings.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-sm text-zinc-400">AI Interviews</div>

            <h2 className="mt-5 text-5xl font-semibold tracking-tight">
              {totalInterviews}
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Scheduled and completed AI voice screening interviews.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Applications */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Candidate Pipeline</div>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Recent Applications
                </h2>
              </div>

              <Link
                href="/recruiter/dashboard/applications"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                View All
              </Link>
            </div>

            <div className="mt-8 space-y-5">
              {recentApplications.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-10 text-center text-zinc-500">
                  No applications received yet.
                </div>
              )}

              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                          {formatStatus(application.status)}
                        </span>

                        {application.interview?.aiScore && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                            AI Score: {application.interview.aiScore}/100
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold">
                        {application.fullName}
                      </h3>

                      <p className="mt-2 text-zinc-400">
                        Applied for {application.job.title}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                        <span>{application.email}</span>

                        <span>{application.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <div className="text-sm text-zinc-500">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(application.appliedAt)}
                      </div>

                      <Link
                        href={`/recruiter/dashboard/applications/${application.id}`}
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
                      >
                        Review Candidate
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Published Openings</div>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Recent Jobs
                </h2>
              </div>

              <Link
                href="/recruiter/dashboard/jobs"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
              >
                Manage
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              {recentJobs.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-zinc-500">
                  No jobs created yet.
                </div>
              )}

              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>

                      <p className="mt-2 text-sm leading-7 text-zinc-500">
                        {job.applications.length} applicants
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/recruiter/dashboard/jobs/${job.id}`}
                        className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-black transition hover:opacity-90"
                      >
                        Manage Job
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
