import { AdminSidebar } from "@/components/admin/sidebar";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const totalJobs = await prisma.job.count();

  const totalApplications = await prisma.jobApplication.count();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-xl p-6">
          <p>Total Jobs</p>

          <h2 className="text-3xl font-bold">{totalJobs}</h2>
        </div>

        <div className="border rounded-xl p-6">
          <p>Total Applications</p>

          <h2 className="text-3xl font-bold">{totalApplications}</h2>
        </div>
      </div>
    </div>
  );
}
