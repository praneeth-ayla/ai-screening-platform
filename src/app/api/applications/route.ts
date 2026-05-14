import { auth } from "@/lib/auth";
import { startBolnaInterview } from "@/lib/bolna";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const application = await prisma.jobApplication.create({
    data: {
      jobId: body.jobId,
      userId: session.user.id,
      fullName: body.fullName,
      linkedinUrl: body.linkedinUrl,
      email: session.user.email!,
      phone: body.phone,
    },
  });

  const bolna = await startBolnaInterview({ applicationId: application.id });

  console.log({ bolna });

  return Response.json(application);
}
