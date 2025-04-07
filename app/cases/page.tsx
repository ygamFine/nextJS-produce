// @ts-nocheck
import { redirect } from 'next/navigation';

// 这些案例数据可以保留，但不应该在这个文件中使用
const cases = [
  {
    id: 1,
    title: '案例一',
    description: '案例描述...',
    image: '/images/case1.jpg',
  },
  {
    id: 2,
    title: '案例二',
    description: '案例描述...',
    image: '/images/case2.jpg',
  },
  {
    id: 3,
    title: '案例三',
    description: '案例描述...',
    image: '/images/case3.jpg',
  },
];

export default function CasesPage() {
  // 重定向到带有默认语言的路径
  redirect('/zh/cases');
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [];
}

// 删除这个命名导出，它不是 Next.js 页面组件的有效导出字段
// export function Cases() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">案例展示</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cases.map((item) => (
//           <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-lg font-semibold">{item.title}</h3>
//               <p className="mt-2 text-gray-600">{item.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// } 