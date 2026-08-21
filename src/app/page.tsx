import prisma from '@/lib/prisma'
import Image from 'next/image'

export const dynamic = 'force-dynamic' // Ensure it's not statically cached so DB updates reflect immediately

export default async function Home() {
  const links = await prisma.link.findMany({
    orderBy: { order: 'asc' },
    take: 5 // limit to 5 buttons as requested
  })

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-16 px-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 flex items-center justify-center overflow-hidden">
          {/* Using a generic placeholder for the avatar */}
          <span className="text-3xl font-bold">💎</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">@CryptoChannel</h1>
        <p className="text-slate-400 text-center max-w-sm">
          Сигналы, аналитика и автоматизация трейдинга. Присоединяйтесь к приватному клубу.
        </p>
      </div>

      {/* Links Section */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {links.length > 0 ? (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-800 hover:bg-slate-700 transition-colors py-4 px-6 rounded-xl text-center font-semibold text-lg border border-slate-700 hover:border-slate-500 shadow-sm"
            >
              {link.title}
            </a>
          ))
        ) : (
          <p className="text-slate-500 text-center italic">Нет активных ссылок.</p>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-16 text-slate-500 text-sm">
        Powered by Taplink Clone
      </div>
    </main>
  )
}
