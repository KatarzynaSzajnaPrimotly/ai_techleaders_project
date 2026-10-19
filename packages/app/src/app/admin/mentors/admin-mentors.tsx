"use client";

import { useEffect, useState } from "react";
import { mentorCreateSchema } from "@devmentor/core/validators";
import {
  apiCall,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CrudForm,
  DataTable,
  type ApiResult,
  type DataTableColumn,
} from "@devmentor/ui";

interface MentorRow {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const columns: DataTableColumn<MentorRow>[] = [
  { key: "name", header: "Name", className: "font-medium" },
  { key: "email", header: "Email" },
  { key: "createdAt", header: "Joined", cell: (mentor) => mentor.createdAt.slice(0, 10) },
];

export function AdminMentors() {
  const [result, setResult] = useState<ApiResult<MentorRow[]> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    apiCall<MentorRow[]>("/api/mentors").then((next) => {
      if (active) setResult(next);
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setResult(null);
    setReloadKey((key) => key + 1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Registered mentors <Badge variant="secondary">{result?.ok ? result.data.length : "–"}</Badge>
          </CardTitle>
          <CardDescription>Mentors visible on the public page.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={result?.ok ? result.data : []}
            getRowKey={(mentor) => mentor.id}
            loading={result === null}
            error={result && !result.ok ? result.error.message : null}
            onRetry={reload}
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
            onSubmit={(values) => apiCall("/api/mentors", { method: "POST", body: values })}
            onSuccess={reload}
          />
        </CardContent>
      </Card>
    </div>
  );
}
