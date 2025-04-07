import Link from 'next/link'

const news = [
  {
    id: 1,
    title: '公司新闻标题一',
    date: '2024-01-01',
    summary: '新闻摘要内容...',
  },
  {
    id: 2,
    title: '行业动态新闻',
    date: '2024-01-02',
    summary: '新闻摘要内容...',
  },
  {
    id: 3,
    title: '技术创新资讯',
    date: '2024-01-03',
    summary: '新闻摘要内容...',
  },
]

export function NewsList() {
  return (
    <div className="space-y-6">
      {news.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`}>
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{item.date}</p>
            <p className="mt-2">{item.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  )
} 