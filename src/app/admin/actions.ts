'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addLink(formData: FormData) {
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  
  if (!title || !url) throw new Error('Заполните все поля')

  // Get max order
  const maxOrderLink = await prisma.link.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const nextOrder = (maxOrderLink?.order ?? 0) + 1

  await prisma.link.create({
    data: {
      title,
      url,
      order: nextOrder
    }
  })
  
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateLink(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const url = formData.get('url') as string
  
  if (!title || !url) throw new Error('Заполните все поля')

  await prisma.link.update({
    where: { id },
    data: { title, url }
  })
  
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteLink(id: number) {
  await prisma.link.delete({
    where: { id }
  })
  
  revalidatePath('/')
  revalidatePath('/admin')
}
