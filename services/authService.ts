import { supabase } from './supabase';
import { UserProfile, UserRole } from '../types';

const ROLE_KEY = 'artisan_pass_user_role';

export const authService = {
  /**
   * Signs in a user and determines their role.
   * NOTE: In a real app, 'role' would be fetched from a 'profiles' table via Supabase.
   * For this demo, we persist the selected role to localStorage.
   */
  async signIn(email: string, role: UserRole): Promise<{ user: UserProfile | null; error: any }> {
    try {
      // 1. Attempt Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // MOCK AUTH for Demo purposes (since we don't have a backend to create users)
      // In production, uncomment the line above and handle errors.
      const mockUser = {
        id: 'user-' + Date.now(),
        email: email,
        role: role
      };
      
      // 2. Persist Session
      localStorage.setItem(ROLE_KEY, JSON.stringify(mockUser));
      
      return { user: mockUser, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signOut() {
    await supabase.auth.signOut();
    localStorage.removeItem(ROLE_KEY);
  },

  getCurrentUser(): UserProfile | null {
    const stored = localStorage.getItem(ROLE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(ROLE_KEY);
  }
};
