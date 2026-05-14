import prisma from "@/lib/prisma";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;
  const applications = await prisma.jobApplication.findMany({
    where: {
      jobId: id,
    },
    include: {
      interview: true,
    },
  });

  return (
    <div className="space-y-4">
      {applications.map((applicant) => (
        <div key={applicant.id} className="border rounded-xl p-4">
          <div className="flex justify-between">
            {/* {JSON.stringify(applicant)} */}
            <div>
              <h2 className="font-semibold">{applicant.fullName}</h2>

              <p>{applicant.email}</p>
              <p>{applicant.phone}</p>
            </div>

            <div>
              <div>{applicant.status}</div>
              <div>
                {JSON.stringify({
                  test: applicant.interview,
                })}
              </div>

              {/* <div>{applicant.screeningScore}</div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
