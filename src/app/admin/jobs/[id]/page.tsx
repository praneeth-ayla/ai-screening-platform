import prisma from "@/lib/prisma";

export default async function ApplicantsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const applications = await prisma.jobApplication.findMany({
    where: {
      jobId: params.id,
    },
  });

  return (
    <div className="space-y-4">
      {applications.map((applicant) => (
        <div key={applicant.id} className="border rounded-xl p-4">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold">{applicant.fullName}</h2>

              <p>{applicant.email}</p>
            </div>

            <div>{applicant.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
