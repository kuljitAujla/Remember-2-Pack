import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoute() {
  const [authStatus, setAuthStatus] = useState(null) // null = loading, true/false = decided

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/is-auth`, {
          method: 'POST',
          credentials: 'include',
        })
        const data = await response.json()

        if (data.success) {
          setAuthStatus("authorized")
        } else if (data.message === "Account not verified. Please verify your email to access the app.") {
          setAuthStatus("verify")
        } else if (data.message === "User ID not found") {
          setAuthStatus("signup")
        } else {
          setAuthStatus("login")
        }
      } catch (error) {
        setAuthStatus("login")
      }
    }

    checkAuth()
  }, [])

  // Show loading state while checking
  if (authStatus === null) {
    return <div>Loading...</div>
  }

  if (authStatus === "authorized") {
    return <Outlet />
  } else if (authStatus === "verify") {
    return <Navigate to="/verify-email" replace />
  } else if (authStatus === "signup") {
    return <Navigate to="/signup" replace />
  } else {
    return <Navigate to="/login" replace />
  }
}

export default ProtectedRoute
