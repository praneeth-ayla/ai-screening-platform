import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApplyForm } from "@/components/ApplyForm";

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

export default async function JobPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const session = await auth();

  const slug = (await params).slug;

  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
    include: {
      applications: true,
    },
  });

  if (!job) {
    return notFound();
  }

  let alreadyApplied = false;

  if (session?.user?.id) {
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId: job.id,
          userId: session.user.id,
        },
      },
    });

    alreadyApplied = !!existingApplication;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left Content */}
          <div>
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

            <h1 className="mt-6 text-5xl font-semibold tracking-tight">
              {job.title}
            </h1>

            {(job.salaryMin || job.salaryMax) && (
              <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300">
                ₹{job.salaryMin?.toLocaleString() || "0"} - ₹
                {job.salaryMax?.toLocaleString() || "0"}
              </div>
            )}

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h2 className="text-xl font-semibold">Job Description</h2>

              <div className="mt-6 whitespace-pre-wrap text-[15px] leading-8 text-zinc-300">
                {job.description}
              </div>
            </div>
          </div>

          {/* Right Apply Card */}
          <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Apply for this role</h2>

              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Complete your application and continue to the AI screening
                interview process.
              </p>
            </div>

            {!session ? (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <p className="text-sm leading-7 text-yellow-100">
                  Please login to apply for this role.
                </p>
              </div>
            ) : alreadyApplied ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <h3 className="font-semibold text-emerald-300">
                  Already Applied
                </h3>

                <p className="mt-2 text-sm leading-7 text-emerald-100/80">
                  You have already submitted an application for this role.
                </p>
              </div>
            ) : (
              <ApplyForm jobId={job.id} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
