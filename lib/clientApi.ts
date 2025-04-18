import { submitInquiry } from './api';

/**
 * 提交联系表单数据到服务器
 */
export async function submitContactForm(formData: any) {
  try {
    // 直接调用 api.ts 中的 submitInquiry 函数
    return await submitInquiry(formData);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
} 