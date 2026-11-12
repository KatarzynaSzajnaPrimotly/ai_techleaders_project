"use client";

import { useEffect, useState } from "react";
import {
  apiCall,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  type ApiResult,
  type DataTableColumn,
} from "@devmentor/ui";

interface MentorRow {
  slug: string;
  displayName: string;
  publicWorkUrl: string;
  bio: string;
  stackTags: string[];
}

const columns: DataTableColumn<MentorRow>[] = [
  { key: "displayName", header: "Name", className: "font-medium" },
  { key: "publicWorkUrl", header: "Public work" },
  { key: "slug", header: "Share page", cell: (mentor) => `/m/${mentor.slug}` },
];

export function AdminMentors() {
  const [result, setResult] = useState<ApiResult<MentorRow[]> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    apiCall<MentorRow[]>("/api/mentors/published").then((next) => {
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
          <CardDescription>Published mentor pages. Unpublished pages and private contact details are excluded.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={result?.ok ? result.data : []}
            getRowKey={(mentor) => mentor.slug}
            loading={result === null}
            error={result && !result.ok ? result.error.message : null}
            onRetry={reload}
            emptyTitle="No mentor has published a page yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
