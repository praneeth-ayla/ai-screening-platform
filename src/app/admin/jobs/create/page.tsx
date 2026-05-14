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

    const response = await fetch("/api/jobs", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        employmentType: formData.get("employmentType"),
        experienceLevel: formData.get("experienceLevel"),
        salaryMin: Number(formData.get("salaryMin")),
        salaryMax: Number(formData.get("salaryMax")),
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/admin/jobs");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input
        name="title"
        placeholder="Job Title"
        required
        className="w-full border rounded-lg p-3"
      />

      <textarea
        name="description"
        placeholder="Job Description"
        required
        className="w-full border rounded-lg p-3 h-40"
      />

      <input
        name="location"
        placeholder="Location"
        className="w-full border rounded-lg p-3"
      />

      <select
        name="employmentType"
        required
        className="w-full border rounded-lg p-3"
      >
        <option value="">Select Employment Type</option>

        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
      </select>

      <select
        name="experienceLevel"
        required
        className="w-full border rounded-lg p-3"
      >
        <option value="">Select Experience Level</option>

        <option value="JUNIOR">Junior</option>
        <option value="MID">Mid</option>
        <option value="SENIOR">Senior</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="salaryMin"
          placeholder="Minimum Salary"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="salaryMax"
          placeholder="Maximum Salary"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="border rounded-lg px-6 py-3"
      >
        {loading ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}
