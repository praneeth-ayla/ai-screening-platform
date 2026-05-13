"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
      }),
    });

    router.push("/admin/jobs");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input
        name="title"
        placeholder="Title"
        className="w-full border rounded-lg p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border rounded-lg p-3 h-40"
      />

      <input
        name="location"
        placeholder="Location"
        className="w-full border rounded-lg p-3"
      />

      <button disabled={loading} className="border rounded-lg px-6 py-3">
        Create Job
      </button>
    </form>
  );
}
