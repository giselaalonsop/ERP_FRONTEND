// app/login/page.jsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { loginToken } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/' })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  const onSubmit = async e => {
    e.preventDefault()
    try {
      await loginToken({ email, password, setErrors, setStatus })
      // redirección se maneja desde layout o donde leas user
    } catch (e) {
      // ya se setean status/errors
    }
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>

      {status && <p className="text-red-600 mb-2">{status}</p>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors?.email && <p className="text-red-600 text-sm">{errors.email}</p>}

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {errors?.password && <p className="text-red-600 text-sm">{errors.password}</p>}

        <button className="w-full bg-black text-white p-2 rounded" type="submit">
          Entrar
        </button>
      </form>
    </main>
  )
}
