import prisma from "./prisma";

export async function startBolnaInterview({
  applicationId,
}: {
  applicationId: string;
}) {
  const application = await prisma.jobApplication.findUnique({
    where: {
      id: applicationId,
    },

    include: {
      job: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const response = await fetch("https://api.bolna.ai/call", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.BOLNA_API_KEY}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      agent_id: process.env.BOLNA_AGENT_ID,

      recipient_phone_number: application.phone,

      from_phone_number: process.env.BOLNA_FROM_PHONE_NUMBER,

      user_data: {
        candidate_name: application.fullName,

        role: application.job.title,

        job_description: application.job.description,

        interview_context: application.job.description,
      },
    }),
  });

  const data = await response.json();

  await prisma.jobApplication.update({
    where: {
      id: applicationId,
    },

    data: {
      status: "SCREENING",
    },
  });

  return data;
}
