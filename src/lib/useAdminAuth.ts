import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface AdminAuthState {
  loading: boolean
  session: Session | null
  isAdmin: boolean
  authError: string | null
}

/** Real Supabase email/password auth + 'admin' role verification via the `has_role` RPC. */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({ loading: true, session: null, isAdmin: false, authError: null })

  const checkRole = async (session: Session | null) => {
    if (!session) {
      setState({ loading: false, session: null, isAdmin: false, authError: null })
      return
    }
    const { data, error } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" })
    if (error) {
      setState({ loading: false, session, isAdmin: false, authError: error.message })
      return
    }
    setState({ loading: false, session, isAdmin: Boolean(data), authError: null })
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
   * Self-service account creation. New accounts get no role until an
   * existing admin grants one in `user_roles` — signing up here never
   * grants admin access by itself, only lets someone request an account.
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
