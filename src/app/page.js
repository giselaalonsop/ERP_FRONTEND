'use client'
import LoginLinks from '@/app/LoginLinks'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'

const Home = () => {
  const router = useRouter()
  const { users } = useAuth()

  useEffect(() => {
    if (users) {
      const hasUsers = users.length > 0
      if (hasUsers) {
        router.push('/login')
      } else {
        router.push('/register')
      }
    }
  }, [users, router])

  return (
    <div className="min-h-screen flex flex-col">
      <LoginLinks />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  )
}

export default Home
