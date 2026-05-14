import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getScoreColor(score?: number | null) {
  if (!score) return "text-zinc-400";

  if (score >= 80) {
    return "text-emerald-300";
  }

  if (score >= 60) {
    return "text-yellow-300";
  }

  return "text-red-300";
}

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      applications: {
        orderBy: {
          appliedAt: "desc",
        },
        include: {
          interview: true,
          user: true,
        },
      },
    },
  });

  if (!job) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
              Job Applicants
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              {job.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Review applicants, AI interview scores, and candidate information
              for this role.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black">
              {job.applications.length} Applicants
            </div>
          </div>
        </div>

        {/* Applicants */}
        <div className="mt-14 space-y-6">
          {job.applications.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/3 p-14 text-center">
              <h3 className="text-2xl font-semibold">No applicants yet</h3>

              <p className="mt-4 text-zinc-400">
                Applications for this role will appear here.
              </p>
            </div>
          )}

          {job.applications.map((applicant) => (
            <div
              key={applicant.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-white/20"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                {/* Left */}
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {formatStatus(applicant.status)}
                    </span>

                    {applicant.interview?.interviewStatus && (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {formatStatus(applicant.interview.interviewStatus)}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                    {applicant.fullName}
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                    <span>{applicant.email}</span>

                    <span>{applicant.phone}</span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {applicant.linkedinUrl && (
                      <a
                        href={applicant.linkedinUrl}
                        target="_blank"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                      >
                        LinkedIn
                      </a>
                    )}

                    {applicant.portfolioUrl && (
                      <a
                        href={applicant.portfolioUrl}
                        target="_blank"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                      >
                        Portfolio
                      </a>
                    )}

                    {applicant.resumeUrl && (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                      >
                        Resume
                      </a>
                    )}
                  </div>

                  {applicant.interview?.aiSummary && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div className="text-sm text-zinc-400">
                        AI Interview Summary
                      </div>

                      <p className="mt-3 text-sm leading-8 text-zinc-300">
                        {applicant.interview.aiSummary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex w-full flex-col gap-5 lg:w-65">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="text-sm text-zinc-500">
                      AI Interview Score
                    </div>

                    <div
                      className={`mt-4 text-5xl font-semibold tracking-tight ${getScoreColor(
                        applicant.interview?.aiScore,
                      )}`}
                    >
                      {applicant.interview?.aiScore || "--"}
                    </div>

                    <div className="mt-3 text-sm text-zinc-500">
                      Overall candidate evaluation score
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="text-sm text-zinc-500">Applied On</div>

                    <div className="mt-3 text-lg font-medium">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(applicant.appliedAt)}
                    </div>
                  </div>

                  <Link
                    href={`/recruiter/dashboard/applications/${applicant.id}`}
                    className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-medium text-black transition hover:opacity-90"
                  >
                    Review Candidate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
