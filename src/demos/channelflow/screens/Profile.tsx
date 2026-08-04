// src/demos/channeflow/screens/Profile.tsx
//
// Profile / account — production-style stub mirroring
// /app/(app)/profile/page.tsx. A centered card with avatar, name, role,
// timezone, and a session-status footer.

import { Globe, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Badge } from "@/demos/_shared/Badge";

export function Profile() {
  return (
    <div className="flex h-full flex-col">
      <header
        className="flex items-end justify-between gap-3 border-b px-5 pb-3 pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--accent)" }}
          >
            Profile
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Your account</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Personal info, role, and active session.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <div
          className="mx-auto flex max-w-3xl flex-col gap-6 rounded-md border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
              style={{
                backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                color: "#1e293b",
              }}
            >
              AD
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Admin</h2>
                <Badge tone="ok">on shift</Badge>
                <Badge tone="info">Admin role</Badge>
              </div>
              <p className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                admin@thisbali.com
              </p>
            </div>
            <Button variant="secondary" size="md">Edit</Button>
          </div>

          <div
            className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2"
            style={{ borderColor: "var(--border)" }}
          >
            <Field
              icon={<Mail className="h-4 w-4" strokeWidth={2} />}
              label="Email"
              value="admin@thisbali.com"
            />
            <Field
              icon={<Phone className="h-4 w-4" strokeWidth={2} />}
              label="Phone"
              value="+62 811-3900-1200"
            />
            <Field
              icon={<Globe className="h-4 w-4" strokeWidth={2} />}
              label="Timezone"
              value="Asia/Makassar (WITA)"
            />
            <Field
              icon={<ShieldCheck className="h-4 w-4" strokeWidth={2} />}
              label="Permissions"
              value="Full access · super admin"
            />
          </div>

          <div
            className="border-t pt-4 text-[11px]"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Session started 2 hours ago from this device. Close shift from the
            sidebar to log out.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-medium" style={{ color: "var(--fg)" }}>
        {value}
      </div>
    </div>
  );
}
