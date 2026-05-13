import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="border rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>

            <p className="mt-2 text-muted-foreground">{job.shortDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
