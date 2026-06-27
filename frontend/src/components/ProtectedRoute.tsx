"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // If user doesn't have the right role, send them home
      router.push('/')
      return
    }

    setIsAuthorized(true)
  }, [router, allowedRoles])

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center p-8 text-slate-500">กำลังตรวจสอบสิทธิ์...</div>
  }

  return <>{children}</>
}
