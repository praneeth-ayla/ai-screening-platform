"use client";

export function ApplyForm({ jobId }: { jobId: string }) {
  async function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch("/api/applications", {
      method: "POST",
      body: JSON.stringify({
        jobId,
        fullName: formData.get("fullName"),
        linkedinUrl: formData.get("linkedinUrl"),
      }),
    });
  }

  return (
    <form onSubmit={apply} className="mt-10 space-y-4">
      <input
        name="fullName"
        placeholder="Full Name"
        className="w-full border rounded-lg p-3"
      />

      <input
        name="linkedinUrl"
        placeholder="LinkedIn URL"
        className="w-full border rounded-lg p-3"
      />

      <button className="border rounded-lg px-6 py-3">Apply</button>
    </form>
  );
}
