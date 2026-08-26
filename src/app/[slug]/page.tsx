import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Props = {
  params: { slug: string }
}

export default async function SubPage({ params }: Props) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: {
      links: { orderBy: { order: 'asc' } }
    }
  })

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-16 px-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 relative w-full max-w-md">
        <div className="absolute left-0 top-0">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium text-sm">
            ← Назад
          </Link>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 flex items-center justify-center overflow-hidden mt-2">
          <span className="text-2xl font-bold">💎</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{page.title}</h1>
      </div>

      {/* Links Section */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {page.links.length > 0 ? (
          page.links.map((link) => (
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
          <p className="text-slate-500 text-center italic">На этой странице пока нет ссылок.</p>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-16 text-slate-500 text-sm">
        Powered by Taplink
      </div>
    </main>
  )
}
