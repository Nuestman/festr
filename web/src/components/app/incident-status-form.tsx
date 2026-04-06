"use client";

import { useActionState } from "react";

import {
  type UpdateIncidentStatusState,
  updateIncidentStatusAction,
} from "@/lib/actions/update-incident-status";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type Props = {
  incidentId: string;
  currentStatus: string;
  canUpdate: boolean;
  /** Table row: inline layout */
  compact?: boolean;
};

const statuses = ["open", "triaged", "closed"] as const;

export function IncidentStatusForm({ incidentId, currentStatus, canUpdate, compact }: Props) {
  const [state, formAction, pending] = useActionState(
    updateIncidentStatusAction,
    {} as UpdateIncidentStatusState,
  );

  if (!canUpdate) {
    return null;
  }

  return (
    <form
      action={formAction}
      className={cn(compact ? "flex flex-wrap items-center gap-2" : "flex flex-col gap-3 sm:flex-row sm:items-end")}
    >
      <input type="hidden" name="incidentId" value={incidentId} />
      <label className={cn("flex flex-col gap-1", compact && "min-w-0")}>
        {!compact && <span className="text-sm text-muted-foreground">Status</span>}
        <select
          name="status"
          defaultValue={currentStatus}
          className="rounded-md border border-border bg-background px-2 py-1.5 font-sans text-sm text-foreground"
          disabled={pending}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={cn(buttonVariants({ size: "sm" }))} disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </button>
      {state.error && (
        <span className="text-sm text-destructive" role="alert">
          Could not update status.
        </span>
      )}
    </form>
  );
}
