import AuthButtons from "@/components/auth-buttons";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.15),transparent_40%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
            AI Voice Interview Platform
          </div>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            {" "}
            Hire better candidates
            <span className="block text-zinc-400">
              using AI voice screening
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Automate interview screening using voice AI. Candidates applies to
            openings, receive screening calls, and recruiters get structured
            evaluation scores instantly.
          </p>

          <div className="mt-12">
            <AuthButtons />
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm text-zinc-400">
              Candidate Screening
            </div>

            <h3 className="mb-3 text-xl font-semibold">AI Voice Interviews</h3>

            <p className="text-sm leading-7 text-zinc-400">
              Conduct automated voice interviews with structured technical and
              behavioral questions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm text-zinc-400">Recruiter Insights</div>

            <h3 className="mb-3 text-xl font-semibold">Candidate Scoring</h3>

            <p className="text-sm leading-7 text-zinc-400">
              Get AI-generated communication, technical, and confidence scores
              after each interview.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
