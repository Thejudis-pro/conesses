-- New roles for event-day staffing: a general "admin" keeps full access,
-- "super_admin" additionally manages who holds which role, and
-- "checkin_agent" is scoped to badge creation + check-in only.
-- (Added in its own migration/transaction — Postgres requires a new enum
-- value to be committed before it can be referenced elsewhere.)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'checkin_agent';
