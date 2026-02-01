'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

export default function AuthSync() {
  const { setUser, logout } = useAuthStore()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          console.log(data.user);
          setUser(data.user)
        } else {
          logout()
        }
      })
  }, [])

  return null
}
