import { ApplyForm } from "@/components/ApplyForm";
import prisma from "@/lib/prisma";

export default async function JobPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const slug = (await params).slug;
  const job = await prisma.job.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!job) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold">{job.title}</h1>

      <p className="mt-6 whitespace-pre-wrap">{job.description}</p>

      <ApplyForm jobId={job.id} />
    </div>
  );
}
