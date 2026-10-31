// Terse Durable Actor backend: NOT IMPLEMENTED (time-boxed out at 13:58, 31 Oct).
// Why: no TERSE_API_KEY in .env or the shell, and no `terse` CLI installed on this machine
// (Bun 1.4.2+ / terse-cli 0.14.x not set up), so the gate "alarm fires while dormant and the
// lease expires" could not be run. createLease() falls back to the local backend when
// LEASE_BACKEND=terse and this throws. See docs/LEASE.md for the intended actor design.
import type { Lease, LeaseOptions } from './index.ts';

export async function createTerseLease(_opts: LeaseOptions): Promise<Lease> {
  throw new Error('terse backend not implemented (no TERSE_API_KEY / terse CLI); see docs/LEASE.md');
}
