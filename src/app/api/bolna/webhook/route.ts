import prisma from "@/lib/prisma";
import { evaluateCandidate } from "@/lib/evaluate";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const executionId = payload.execution_id;

    const transcript = payload.transcript || payload.conversation_transcript;

    if (!transcript) {
      return Response.json(
        {
          ok: false,
          error: "No transcript",
        },
        { status: 400 },
      );
    }

    // FIND APPLICATION
    const application = await prisma.jobApplication.findFirst({
      where: {
        phone: payload.recipient_phone_number,
      },

      include: {
        job: true,
        interview: true,
      },
    });

    if (!application) {
      return Response.json(
        {
          ok: false,
          error: "Application not found",
        },
        { status: 404 },
      );
    }

    let interview = application.interview;

    // CREATE INTERVIEW IF NOT EXISTS
    if (!interview) {
      interview = await prisma.interview.create({
        data: {
          applicationId: application.id,
          executionId,
          interviewStatus: "STARTED",
        },
      });
    }

    // SAVE TRANSCRIPT
    await prisma.interview.update({
      where: {
        id: interview.id,
      },

      data: {
        executionId,
        transcript,
        completedAt: new Date(),
        interviewStatus: "COMPLETED",
        rawWebhook: payload,
      },
    });

    // AI EVALUATION
    const result = await evaluateCandidate({
      transcript,
      jobDescription: application.job.description,
    });

    // DETERMINE APPLICATION STATUS
    const applicationStatus =
      result.recommendation === "SHORTLIST" ? "SHORTLISTED" : "REJECTED";

    // UPDATE INTERVIEW
    await prisma.interview.update({
      where: {
        id: interview.id,
      },

      data: {
        aiScore: result.score,
        aiSummary: result.summary,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        recommendation: result.recommendation,
      },
    });

    // UPDATE APPLICATION STATUS
    await prisma.jobApplication.update({
      where: {
        id: application.id,
      },

      data: {
        status: applicationStatus,
      },
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
