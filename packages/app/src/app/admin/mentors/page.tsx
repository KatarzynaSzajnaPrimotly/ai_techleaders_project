import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@devmentor/ui";
import { AdminMentors } from "./admin-mentors";

export const metadata: Metadata = { title: "Mentors | DevMentor admin" };

export default function AdminMentorsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mentors</h1>
          <p className="text-sm text-muted-foreground">Admin overview of registered mentors.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/mentors">View public page</Link>
        </Button>
      </div>
      <AdminMentors />
    </div>
  );
}
