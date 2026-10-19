import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@devmentor/ui";
import { createRequestScope } from "../../../server/container";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mentors | DevMentor admin" };

export default async function AdminMentorsPage() {
  const { cradle } = await createRequestScope();
  const mentors = await cradle.mentorService.list();

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
      <Card>
        <CardHeader>
          <CardTitle>
            Registered mentors <Badge variant="secondary">{mentors.length}</Badge>
          </CardTitle>
          <CardDescription>Add mentors with POST /api/mentors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No mentors yet.
                  </TableCell>
                </TableRow>
              ) : (
                mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">{mentor.name}</TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell>{mentor.createdAt.toISOString().slice(0, 10)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
