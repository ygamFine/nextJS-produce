'use client';
import { useState } from 'react';
import { submitContactForm } from '@/lib/clientApi';
import { useLocale } from '@/contexts/LocaleContext';

export function ContactForm() {
  const { locale } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // 简单的翻译函数
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.submit': 'Submit',
        'contact.submitSuccess': 'Message sent successfully!',
        'contact.submitError': 'Failed to send message. Please try again later.',
      },
      zh: {
        'contact.name': '姓名',
        'contact.email': '邮箱',
        'contact.message': '留言',
        'contact.submit': '提交',
        'contact.submitSuccess': '消息发送成功！',
        'contact.submitError': '提交失败，请稍后再试',
      }
    };
    
    return translations[locale]?.[key] || key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // 模拟 API 调用
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitting contact form', name, email, message);
      await submitContactForm({
        name: name,
        email: email,
        message: message,
      })
      
      // 清空表单
      setName('');
      setEmail('');
      setMessage('');
      setSubmitSuccess(true);
      
      // 5秒后隐藏成功消息
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      // 修复：setError 只接受一个参数
      setError(t('contact.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.name')}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.email')}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.message')}
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {submitSuccess && (
        <div className="text-green-500 text-sm">{t('contact.submitSuccess')}</div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? '...' : t('contact.submit')}
      </button>
    </form>
  );
} 