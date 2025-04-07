// @ts-nocheck
import { redirect } from 'next/navigation';
// import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  // 重定向到带有默认语言的路径
  redirect('/zh/contact');
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [];
}

// 删除这个命名导出，它不是 Next.js 页面组件的有效导出字段
// export function Contact() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">联系我们</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-xl font-semibold mb-4">联系方式</h2>
//           <ul className="space-y-3">
//             <li>地址：某某省某某市某某区某某街道</li>
//             <li>电话：123-456-7890</li>
//             <li>邮箱：contact@example.com</li>
//           </ul>
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold mb-4">在线留言</h2>
//           <ContactForm />
//         </div>
//       </div>
//     </div>
//   );
// } 