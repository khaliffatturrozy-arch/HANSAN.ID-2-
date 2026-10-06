/**
 * HANSAN Role Model — §5 / §7.
 * Development-only role access. These are presentation/dev identities,
 * NOT production credentials. Later replaced by real auth without
 * redesigning the frontend (contracts stay stable).
 */

export const DEV_ROLES = [
  "developer",
  "owner",
  "pos",
  "kds",
  "finance",
] as const;

export type DevRole = (typeof DEV_ROLES)[number];

export interface DevAccount {
  role: DevRole;
  /** Development-only identifier (never a production credential). */
  email: string;
  /** Landing route after development sign-in. */
  home: string;
  label: string;
  description: string;
}

export const DEV_ACCOUNTS: Record<DevRole, DevAccount> = {
  developer: {
    role: "developer",
    email: "developer@hansan.local",
    home: "/developer",
    label: "Developer",
    description: "System overview, health, flags, logs, configuration.",
  },
  owner: {
    role: "owner",
    email: "owner@hansan.local",
    home: "/hq",
    label: "Owner / HQ",
    description: "Complete back-office workspace.",
  },
  pos: {
    role: "pos",
    email: "pos@hansan.local",
    home: "/pos",
    label: "POS",
    description: "Order flow: type → table → menu → cart → payment → receipt.",
  },
  kds: {
    role: "kds",
    email: "kds@hansan.local",
    home: "/kds",
    label: "KDS",
    description: "Kitchen display: new → preparing → ready → completed.",
  },
  finance: {
    role: "finance",
    email: "finance@hansan.local",
    home: "/finance",
    label: "Finance",
    description: "Transactions, refunds, approvals, reconciliation.",
  },
};
