import prisma from '@/lib/prisma'
import { addLink, updateLink, deleteLink } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const links = await prisma.link.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span>⚙️</span> Админ Панель
        </h1>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">Добавить новую ссылку (Макс 5)</h2>
          {links.length >= 5 ? (
            <div className="bg-orange-500/10 text-orange-400 p-4 rounded-lg border border-orange-500/20">
              Достигнут лимит в 5 ссылок. Удалите одну, чтобы добавить новую.
            </div>
          ) : (
            <form action={addLink} className="flex gap-4">
              <input 
                name="title" 
                type="text" 
                placeholder="Текст кнопки (напр. VIP Канал)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input 
                name="url" 
                type="url" 
                placeholder="URL (напр. https://t.me/...)" 
                required 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-colors">
                Добавить
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-300">Существующие ссылки</h2>
          {links.length === 0 && <p className="text-slate-500">Пока нет ссылок.</p>}
          
          <div className="flex flex-col gap-4">
            {links.map((link) => (
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
                    type="url" 
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
    </div>
  )
}
