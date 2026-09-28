'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { getAuthenticatedStaff } from '@/lib/auth/staff';

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action to authenticate a staff member.
 * Validates credentials against Supabase Auth and ensures the user
 * has a valid staff profile associated with a restaurant.
 */
export async function loginStaff(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Dados de login inválidos.',
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Erro de configuração no servidor. Tente novamente mais tarde.',
    };
  }

  // 1. Authenticate with Supabase Auth
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    return {
      success: false,
      error: 'Credenciais inválidas. Verifique o email e a palavra-passe.',
    };
  }

  // 2. Validate that the authenticated user is an authorized staff member
  const staff = await getAuthenticatedStaff();
  if (!staff) {
    // If not authorized as staff, sign out immediately to prevent dangling session
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Acesso não autorizado. Esta conta não possui perfil de staff para aceder à administração.',
    };
  }

  return { success: true };
}

/**
 * Server Action to terminate staff session and redirect to login.
 */
export async function logoutStaff(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}
