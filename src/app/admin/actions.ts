'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

function requireAuth() {
  const token = cookies().get('admin_token')
  if (!token || token.value !== 'authenticated') {
    throw new Error('Не авторизован')
  }
}

export async function addLink(formData: FormData) {
  requireAuth()
  
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const pageIdStr = formData.get('pageId') as string
  
  if (!title || !url) throw new Error('Заполните все поля')

  const pageId = pageIdStr ? parseInt(pageIdStr, 10) : null

  // Get max order
  const maxOrderLink = await prisma.link.findFirst({
    where: { pageId },
    orderBy: { order: 'desc' }
  })
  
  const nextOrder = (maxOrderLink?.order ?? 0) + 1

  await prisma.link.create({
    data: {
      title,
      url,
      order: nextOrder,
      pageId
    }
  })
  
  revalidatePath('/', 'layout')
}

export async function updateLink(id: number, formData: FormData) {
  requireAuth()
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  
  if (!title || !url) throw new Error('Заполните все поля')

  await prisma.link.update({
    where: { id },
    data: { title, url }
  })
  
  revalidatePath('/', 'layout')
}

export async function deleteLink(id: number) {
  requireAuth()
  await prisma.link.delete({
    where: { id }
  })
  
  revalidatePath('/', 'layout')
}

export async function addPage(formData: FormData) {
  requireAuth()
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  
  if (!title || !slug) throw new Error('Заполните все поля')

  await prisma.page.create({
    data: {
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    }
  })
  
  revalidatePath('/', 'layout')
}

export async function deletePage(id: number) {
  requireAuth()
  await prisma.page.delete({
    where: { id }
  })
  
  revalidatePath('/', 'layout')
}
