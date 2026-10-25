import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CrudForm,
  DataTable,
  type DataTableColumn,
} from "@devmentor/ui";
import { mentorCreateSchema } from "@devmentor/core/validators";
import { SLOW_LATENCY_MS, type MentorRow, type Role } from "../data";
import { createMentor } from "../flows";
import { RoleShell } from "../gaps";
import { currentAccount, useStore } from "../store";

// s05 and s06: one card, one neutral sentence, no empty menu (G08). Nothing here offers to "become a mentor" (R07).
function Welcome({ role }: { role: Role }) {
  const account = useStore((state) => currentAccount(state));
  const shownRole = useStore((state) => state.session?.cookieRole ?? role);
  return (
    <RoleShell>
      <Card>
        <CardHeader>
          <h1 className="font-semibold leading-none tracking-tight">Welcome, {account?.name ?? ""}</h1>
          <CardDescription>You are signed in as a {shownRole}.</CardDescription>
        </CardHeader>
      </Card>
    </RoleShell>
  );
}

export function MenteeHome() {
  return <Welcome role="mentee" />;
}

export function MentorHome() {
  return <Welcome role="mentor" />;
}

const columns: DataTableColumn<MentorRow>[] = [
  { key: "name", header: "Name", className: "font-medium" },
  { key: "email", header: "Email" },
  { key: "createdAt", header: "Joined", cell: (mentor) => mentor.createdAt.slice(0, 10) },
];

type Phase = "loading" | "ready" | "error";

// s07: the existing /admin/mentors page, unchanged except for the shell (G09). Data comes from memory, never from /api.
// The list reacts to the network control (P10): slow shows the loading state, server error shows Retry, empty shows no rows.
export function OperatorHome() {
  const mentors = useStore((state) => state.mentors);
  const network = useStore((state) => state.scenario.network);
  const here = useStore((state) => state.currentScreen === "s07");
  const [phase, setPhase] = useState<Phase>("ready");
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    if (network === "slow") {
      setPhase("loading");
      const timer = window.setTimeout(() => setPhase("ready"), SLOW_LATENCY_MS);
      return () => window.clearTimeout(timer);
    }
    setPhase(network === "serverError" ? "error" : "ready");
    return undefined;
  }, [network, reloads, here]);

  const rows = network === "empty" ? [] : mentors;

  return (
    <RoleShell wide>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mentors</h1>
        <p className="text-sm text-muted-foreground">Admin overview of registered mentors.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            Registered mentors <Badge variant="secondary">{phase === "ready" ? rows.length : "–"}</Badge>
          </CardTitle>
          <CardDescription>Mentors visible on the public page.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={phase === "ready" ? rows : []}
            getRowKey={(mentor) => mentor.id}
            loading={phase === "loading"}
            error={phase === "error" ? "Internal server error" : null}
            onRetry={() => setReloads((count) => count + 1)}
            emptyTitle="No mentors yet."
            emptyDescription="Add the first one below."
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add mentor</CardTitle>
          <CardDescription>Ctrl+Enter submits.</CardDescription>
        </CardHeader>
        <CardContent>
          <CrudForm
            schema={mentorCreateSchema}
            fields={[
              { name: "name", label: "Name", placeholder: "Ada Lovelace" },
              { name: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
            ]}
            submitLabel="Add mentor"
            onSubmit={(values) => Promise.resolve(createMentor(values.name, values.email))}
          />
        </CardContent>
      </Card>
    </RoleShell>
  );
}
