"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { slotCreateSchema } from "@devmentor/core/validators";
import { apiCall, CrudForm, DataTable, LocalTime, type ApiResult, type DataTableColumn } from "@devmentor/ui";

interface SlotRow {
  id: string;
  startsAt: string;
  isPast: boolean;
}

const localDateTimeSchema = z.string().min(1, "Choose a start time").refine(
  (value) => Number.isFinite(new Date(value).getTime()),
  "Enter a valid start time",
);

const slotFormSchema = z.object({ startsAt: localDateTimeSchema })
  .transform(({ startsAt }) => ({ startsAt: new Date(startsAt).toISOString() }))
  .pipe(slotCreateSchema);

const timezoneSubscribe = () => () => {};
const browserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const serverTimezone = () => "your browser's time zone";

function TimezoneHint() {
  const timezone = useSyncExternalStore(timezoneSubscribe, browserTimezone, serverTimezone);
  return <p className="text-sm text-muted-foreground">Times are shown in {timezone}.</p>;
}

export function AvailabilitySlotManager() {
  const [result, setResult] = useState<ApiResult<SlotRow[]> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    let active = true;
    apiCall<SlotRow[]>("/api/availability/slots").then((next) => {
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

  const remove = async (slot: SlotRow) => {
    const removed = await apiCall<{ id: string }>(`/api/availability/slots/${slot.id}`, { method: "DELETE" });
    if (removed.ok) reload();
    else setResult({ ok: false, status: removed.status, error: removed.error });
  };

  const columns: DataTableColumn<SlotRow>[] = [
    { key: "startsAt", header: "Start time", cell: (slot) => <LocalTime value={slot.startsAt} /> },
  ];
  const rows = result?.ok
    ? result.data.filter((slot) => showPast || !slot.isPast)
    : [];

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Your availability</h1>
        <p className="text-sm text-muted-foreground">Publish individual start times for mentees to see on your mentor page.</p>
      </header>

      <section aria-labelledby="add-slot-heading" className="space-y-4 rounded-lg border p-4">
        <h2 id="add-slot-heading" className="text-lg font-medium">Add a start time</h2>
        <TimezoneHint />
        <CrudForm
          schema={slotFormSchema}
          fields={[{ name: "startsAt", label: "Start time", type: "datetime", description: "Times less than two hours away appear as unavailable." }]}
          onSubmit={(values) => apiCall("/api/availability/slots", { method: "POST", body: values })}
          onSuccess={reload}
          submitLabel="Publish time"
        />
      </section>

      <section aria-labelledby="slots-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="slots-heading" className="text-lg font-medium">Published times</h2>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} />
            Show past times
          </label>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(slot) => slot.id}
          loading={result === null}
          error={result && !result.ok ? result.error.message : null}
          onRetry={reload}
          emptyTitle={showPast ? "No published times." : "No future times published."}
          actions={(slot) => <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={() => void remove(slot)}>Remove</button>}
        />
      </section>
    </main>
  );
}
