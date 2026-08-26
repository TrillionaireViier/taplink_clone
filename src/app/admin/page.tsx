import prisma from '@/lib/prisma'
import { addLink, updateLink, deleteLink, addPage, deletePage } from './actions'
import { logout } from './login/actions'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  
  if (!token || token.value !== 'authenticated') {
    redirect('/admin/login')
  }

  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'asc' },
    include: { links: { orderBy: { order: 'asc' } } }
  })
  
  const mainLinks = await prisma.link.findMany({
    where: { pageId: null },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>⚙️</span> Админ Панель
            </h1>
            <div className="flex gap-4 items-center">
              <Link href="/" className="text-blue-400 hover:text-blue-300">На главную</Link>
              <form action={logout}>
                <button type="submit" className="text-red-400 hover:text-red-300 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 text-sm font-medium">Выйти</button>
              </form>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Главная страница: Добавить ссылку</h2>
            <form action={addLink} className="flex gap-4">
              <input type="hidden" name="pageId" value="" />
              <input 
                name="title" 
                type="text" 
                placeholder="Текст кнопки (напр. VIP Канал)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input 
                name="url" 
                type="text" 
                placeholder="URL (напр. https://t.me/...)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-colors">
                Добавить
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Ссылки на главной</h2>
            {mainLinks.length === 0 && <p className="text-slate-500">Пока нет ссылок.</p>}
            <div className="flex flex-col gap-4">
              {mainLinks.map((link) => (
                <div key={link.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-4">
                  <form action={updateLink.bind(null, link.id)} className="flex gap-4">
                    <input 
                      name="title" 
                      type="text" 
                      defaultValue={link.title} 
                      required 
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      name="url" 
                      type="text" 
                      defaultValue={link.url} 
                      required 
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-medium transition-colors">
                      Сохранить
                    </button>
                  </form>
                  <form action={deleteLink.bind(null, link.id)}>
                    <button type="submit" className="text-red-400 hover:text-red-300 text-sm font-medium">
                      Удалить ссылку
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUB PAGES */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span>📄</span> Дополнительные страницы (Sub-pages)
          </h2>
          
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 text-slate-300">Создать новую страницу</h3>
            <form action={addPage} className="flex gap-4">
              <input 
                name="title" 
                type="text" 
                placeholder="Название (напр. YouTube)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input 
                name="slug" 
                type="text" 
                placeholder="URL slug (напр. youtube)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-medium transition-colors">
                Создать
              </button>
            </form>
          </div>

          <div className="space-y-12">
            {pages.map(page => (
              <div key={page.id} className="border-t border-slate-800 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-200">
                    {page.title} <span className="text-slate-500 text-sm font-normal">(/{page.slug})</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <Link href={`/${page.slug}`} target="_blank" className="text-blue-400 hover:text-blue-300 text-sm">Открыть</Link>
                    <form action={deletePage.bind(null, page.id)}>
                      <button type="submit" className="text-red-400 hover:text-red-300 text-sm font-medium">
                        Удалить страницу
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mb-6">
                  <form action={addLink} className="flex gap-4">
                    <input type="hidden" name="pageId" value={page.id} />
                    <input 
                      name="title" 
                      type="text" 
                      placeholder="Текст ссылки" 
                      required 
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input 
                      name="url" 
                      type="text" 
                      placeholder="URL" 
                      required 
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                      Добавить ссылку
                    </button>
                  </form>
                </div>

                <div className="flex flex-col gap-3">
                  {page.links.map(link => (
                    <div key={link.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                      <div className="flex-1 flex gap-4 mr-4">
                        <span className="font-medium truncate">{link.title}</span>
                        <span className="text-slate-500 truncate text-sm">{link.url}</span>
                      </div>
                      <form action={deleteLink.bind(null, link.id)}>
                        <button type="submit" className="text-red-400 hover:text-red-300 text-sm font-medium p-2">
                          ✕
                        </button>
                      </form>
                    </div>
                  ))}
                  {page.links.length === 0 && <p className="text-slate-500 text-sm italic">На этой странице нет ссылок.</p>}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}
