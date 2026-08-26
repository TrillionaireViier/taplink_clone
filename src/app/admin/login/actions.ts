'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  const validPassword = process.env.ADMIN_PASSWORD || '123456'
  
  if (password === validPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/admin')
  } else {
    return { error: 'Неправильный пароль' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin/login')
}
