import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const job = await prisma.job.create({
    data: {
      title: body.title,
      description: body.description,
      location: body.location,
      slug: crypto.randomUUID(),
      employmentType: "FULL_TIME",
      experienceLevel: "MID",
      shortDescription: body.description,
      createdById: session.user.id,
    },
  });

  return Response.json(job);
}
