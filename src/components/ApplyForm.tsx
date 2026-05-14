"use client";

export function ApplyForm({ jobId }: { jobId: string }) {
  async function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        linkedinUrl: formData.get("linkedinUrl"),
      }),
    });

    alert("Applied successfully");
  }

  return (
    <form onSubmit={handleApply} className="mt-10 space-y-4">
      <input
        name="fullName"
        placeholder="Full Name"
        className="border p-3 w-full"
      />

      <input
        name="phone"
        placeholder="Phone Number"
        className="border p-3 w-full"
      />

      <input
        name="linkedinUrl"
        placeholder="LinkedIn URL"
        className="border p-3 w-full"
      />

      <button className="border px-6 py-3">Apply</button>
    </form>
  );
}
