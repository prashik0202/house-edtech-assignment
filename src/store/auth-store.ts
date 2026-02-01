'use client'

import { UserSchemaType } from '@/schema/userSchema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthUser = Omit<UserSchemaType, "password"> & {
  id: string
}

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
