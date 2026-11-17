"use client";

import { centsToMajorAmount, type PriceBounds } from "@devmentor/core";
import { mentorPricesUpdateSchema } from "@devmentor/core/validators";
import { useState } from "react";
import { apiCall, CrudForm } from "@devmentor/ui";

interface PriceConfiguration {
  prices: { price25Cents: number | null; price50Cents: number | null; currency: "EUR" } | null;
  priceBounds: PriceBounds | null;
}

export function MentorPriceEditor({ initial }: { initial: PriceConfiguration }) {
  const [saved, setSaved] = useState(false);
  if (!initial.priceBounds) {
    return (
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold">Session prices</h1>
        <p role="status" className="text-sm text-muted-foreground">Prices are not configured yet. Contact the DevMentor team before setting your prices.</p>
      </main>
    );
  }

  const { p25, p50 } = initial.priceBounds;
  const formatBounds = (bounds: { minCents: number; maxCents: number }) => `Allowed range: €${centsToMajorAmount(bounds.minCents)}–€${centsToMajorAmount(bounds.maxCents)}`;
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Session prices</h1>
        <p className="text-sm text-muted-foreground">Set both prices in EUR. Confirmed bookings keep the price from the time they were made.</p>
      </header>
      <CrudForm
        schema={mentorPricesUpdateSchema}
        fields={[
          { name: "price25", label: "25-minute session (EUR)", type: "text", description: formatBounds(p25), initialValue: initial.prices?.price25Cents == null ? "" : centsToMajorAmount(initial.prices.price25Cents) },
          { name: "price50", label: "50-minute session (EUR)", type: "text", description: formatBounds(p50), initialValue: initial.prices?.price50Cents == null ? "" : centsToMajorAmount(initial.prices.price50Cents) },
        ]}
        onSubmit={(values) => apiCall("/api/mentors/me/prices", { method: "PUT", body: values })}
        onSuccess={() => setSaved(true)}
        resetOnSuccess={false}
        submitLabel="Save prices"
      />
      {saved ? <p role="status" className="text-sm">Prices saved.</p> : null}
    </main>
  );
}
