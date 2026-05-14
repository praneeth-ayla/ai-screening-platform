// app/recruiter/dashboard/applications/[id]/page.tsx

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

  if (score >= 80) return "text-emerald-300";

  if (score >= 60) return "text-yellow-300";

  return "text-red-300";
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;

  const application = await prisma.jobApplication.findUnique({
    where: {
      id,
    },

    include: {
      job: true,
      interview: true,
      user: true,
    },
  });

  if (!application) {
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
              Candidate Review
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              {application.fullName}
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Review candidate profile, interview results, and AI screening
              insights for this application.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/recruiter/dashboard/jobs/${application.jobId}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-300 transition hover:bg-white/10"
            >
              Back to Applicants
            </Link>

            <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black">
              {formatStatus(application.status)}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Candidate Info */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm text-zinc-400">
                    Candidate Information
                  </div>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    {application.fullName}
                  </h2>

                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                    <span>{application.email}</span>

                    <span>{application.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {application.linkedinUrl && (
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                  >
                    LinkedIn
                  </a>
                )}

                {application.portfolioUrl && (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                  >
                    Portfolio
                  </a>
                )}

                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10"
                  >
                    Resume
                  </a>
                )}
              </div>
            </div>

            {/* Interview Summary */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-zinc-400">
                    AI Interview Analysis
                  </div>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Interview Summary
                  </h2>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                  {application.interview?.interviewStatus
                    ? formatStatus(application.interview.interviewStatus)
                    : "Pending"}
                </div>
              </div>

              <div className="mt-8">
                {application.interview?.aiSummary ? (
                  <p className="text-[15px] leading-8 text-zinc-300">
                    {application.interview.aiSummary}
                  </p>
                ) : (
                  <p className="text-zinc-500">
                    No interview summary available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="text-sm text-zinc-400">Candidate Strengths</div>

                <div className="mt-6 space-y-4">
                  {application.interview?.strengths?.length ? (
                    application.interview.strengths.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4 text-sm leading-7 text-zinc-300"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No strengths recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="text-sm text-zinc-400">
                  Areas for Improvement
                </div>

                <div className="mt-6 space-y-4">
                  {application.interview?.weaknesses?.length ? (
                    application.interview.weaknesses.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-red-400/10 bg-red-400/5 p-4 text-sm leading-7 text-zinc-300"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No weaknesses recorded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-sm text-zinc-400">Interview Transcript</div>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Full Conversation
              </h2>

              <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
                {application.interview?.transcript ? (
                  <pre className="whitespace-pre-wrap text-sm leading-8 text-zinc-300">
                    {application.interview.transcript}
                  </pre>
                ) : (
                  <p className="text-zinc-500">No transcript available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-sm text-zinc-400">AI Evaluation Score</div>

              <div
                className={`mt-5 text-6xl font-semibold tracking-tight ${getScoreColor(
                  application.interview?.aiScore,
                )}`}
              >
                {application.interview?.aiScore || "--"}
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Overall candidate performance score generated from the AI
                interview.
              </p>
            </div>

            {/* Recommendation */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-sm text-zinc-400">AI Recommendation</div>

              <div className="mt-5 text-xl font-semibold">
                {application.interview?.recommendation ||
                  "No recommendation available"}
              </div>
            </div>

            {/* Job Info */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-sm text-zinc-400">Applied Role</div>

              <h3 className="mt-4 text-2xl font-semibold">
                {application.job.title}
              </h3>

              <div className="mt-6 flex flex-col gap-3 text-sm text-zinc-500">
                <span>
                  Applied on{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(application.appliedAt)}
                </span>

                {application.job.location && (
                  <span>{application.job.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
