import prisma from "@/lib/prisma";
import { evaluateCandidate } from "@/lib/evaluate";

export async function POST(req: Request) {
  try {
    // Parse incoming webhook payload
    const payload = await req.json();
    console.log({ payload });
    // Unique interview execution id from provider
    const executionId = payload.execution_id;

    // Some providers send transcript under different keys
    const transcript = payload.transcript || payload.conversation_transcript;

    // Find candidate application using phone number
    const application = await prisma.jobApplication.findFirst({
      where: {
        phone: payload.recipient_phone_number,
      },

      // Include related job + interview data
      include: {
        job: true,
        interview: true,
      },
    });

    // Application not found
    if (!application) {
      return Response.json(
        {
          ok: false,
          error: "Application not found",
        },
        { status: 404 },
      );
    }

    // Existing interview if already created
    let interview = application.interview;

    // Create interview record if this is first webhook
    if (!interview) {
      interview = await prisma.interview.create({
        data: {
          applicationId: application.id,
          executionId,
          interviewStatus: "STARTED",
        },
      });
    }

    // Save transcript + raw webhook data
    await prisma.interview.update({
      where: {
        id: interview.id,
      },

      data: {
        executionId,
        transcript,

        // Mark interview as completed
        completedAt: new Date(),
        interviewStatus: "COMPLETED",

        // Store full webhook for debugging/logging
        rawWebhook: payload,
      },
    });

    // Run AI evaluation on transcript
    const result = await evaluateCandidate({
      transcript,

      // Pass job description for better evaluation context
      jobDescription: application.job.description,
    });

    // Decide final application status from AI recommendation
    const applicationStatus =
      result.recommendation === "SHORTLIST" ? "SHORTLISTED" : "REJECTED";

    // Save AI evaluation results
    await prisma.interview.update({
      where: {
        id: interview.id,
      },

      data: {
        aiScore: result.score,
        aiSummary: result.summary,

        // Arrays of positives + negatives
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],

        recommendation: result.recommendation,
      },
    });

    // Update overall application status
    await prisma.jobApplication.update({
      where: {
        id: application.id,
      },

      data: {
        status: applicationStatus,
      },
    });

    // Success response
    return Response.json({
      ok: true,
    });
  } catch (error) {
    // Log actual error in server console
    console.error(error);

    // Generic error response to client
    return Response.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
