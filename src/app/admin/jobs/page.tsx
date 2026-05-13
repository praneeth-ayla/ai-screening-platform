import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>

        <Link href="/admin/jobs/create" className="border rounded-lg px-4 py-2">
          Create Job
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/admin/jobs/${job.id}`}
            className="block border rounded-xl p-4"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{job.title}</h2>

                <p className="text-sm text-muted-foreground">{job.location}</p>
              </div>

              <div>{job._count.applications} applicants</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
