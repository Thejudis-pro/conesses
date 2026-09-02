import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface AdminAuthState {
  loading: boolean
  session: Session | null
  isAdmin: boolean
  isSuperAdmin: boolean
  isCheckinAgent: boolean
  authError: string | null
}

const EMPTY_ROLES: Omit<AdminAuthState, "loading" | "session" | "authError"> = {
  isAdmin: false,
  isSuperAdmin: false,
  isCheckinAgent: false,
}

/**
 * Real Supabase email/password auth + role verification via the `has_role`
 * RPC. Three roles: 'admin' (general, full access), 'super_admin' (full
 * access + manages who holds which role), 'checkin_agent' (scoped to badge
 * creation + check-in only). `isAdmin` is true for admin OR super_admin —
 * super_admin is a superset of general admin access.
 */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({ loading: true, session: null, ...EMPTY_ROLES, authError: null })

  const checkRole = async (session: Session | null) => {
    if (!session) {
      setState({ loading: false, session: null, ...EMPTY_ROLES, authError: null })
      return
    }
    const [admin, superAdmin, checkinAgent] = await Promise.all([
      supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: session.user.id, _role: "super_admin" }),
      supabase.rpc("has_role", { _user_id: session.user.id, _role: "checkin_agent" }),
    ])
    // super_admin/checkin_agent errors are treated as "role not held" rather
    // than blocking access — e.g. right after this code deploys but before
    // the migration adding those enum values has been run, those two calls
    // fail while 'admin' still resolves normally. Only a failure on the
    // base 'admin' check itself is surfaced as a real auth error.
    if (admin.error) {
      setState({ loading: false, session, ...EMPTY_ROLES, authError: admin.error.message })
      return
    }
    setState({
      loading: false,
      session,
      isAdmin: Boolean(admin.data) || Boolean(superAdmin.data),
      isSuperAdmin: Boolean(superAdmin.data),
      isCheckinAgent: Boolean(checkinAgent.data),
      authError: null,
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => checkRole(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      checkRole(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, authError: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setState((s) => ({ ...s, loading: false, authError: error.message }))
      return error.message
    }
    return null
  }

  /**
   * Self-service account creation. New accounts get no role until a
   * super_admin grants one in `user_roles` — signing up here never
   * grants access by itself, only lets someone request an account.
   */
  const signUp = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, authError: null }))
    const { data, error } = await supabase.auth.signUp({ email, password })
    setState((s) => ({ ...s, loading: false }))
    if (error) return { error: error.message, needsEmailConfirmation: false }
    const needsEmailConfirmation = !data.session
    return { error: null, needsEmailConfirmation }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { ...state, signIn, signUp, signOut }
}
