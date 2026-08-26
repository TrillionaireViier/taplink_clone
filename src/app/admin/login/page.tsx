'use client'

import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
          <span>🔒</span> Вход в Админ Панель
        </h1>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 border border-red-500/20 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="password" 
            type="password" 
            placeholder="Введите пароль..." 
            required 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-center"
          />
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isPending ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
