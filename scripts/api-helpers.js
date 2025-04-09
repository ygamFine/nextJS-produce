// 简化版 API 模块，专门用于脚本
const fs = require('fs');
const path = require('path');

// 模拟 API 函数
async function fetchProducts(locale) {
  console.log(`模拟获取产品数据，语言: ${locale}`);
  return [
    {
      id: '1',
      name: locale === 'en' ? 'Product 1' : '产品 1',
      description: locale === 'en' ? 'Description of product 1' : '产品1的描述',
      image: '/placeholder.jpg',
      price: 100
    },
    {
      id: '2',
      name: locale === 'en' ? 'Product 2' : '产品 2',
      description: locale === 'en' ? 'Description of product 2' : '产品2的描述',
      image: '/placeholder.jpg',
      price: 200
    }
  ];
}

async function fetchNewsItems(locale) {
  console.log(`模拟获取新闻数据，语言: ${locale}`);
  return [
    {
      id: '1',
      title: locale === 'en' ? 'News 1' : '新闻 1',
      content: locale === 'en' ? 'Content of news 1' : '新闻1的内容',
      image: '/placeholder.jpg',
      date: '2023-01-01'
    },
    {
      id: '2',
      title: locale === 'en' ? 'News 2' : '新闻 2',
      content: locale === 'en' ? 'Content of news 2' : '新闻2的内容',
      image: '/placeholder.jpg',
      date: '2023-01-02'
    }
  ];
}

async function fetchCases(locale) {
  console.log(`模拟获取案例数据，语言: ${locale}`);
  return [
    {
      id: '1',
      title: locale === 'en' ? 'Case 1' : '案例 1',
      content: locale === 'en' ? 'Content of case 1' : '案例1的内容',
      image: '/placeholder.jpg',
      date: '2023-01-01'
    },
    {
      id: '2',
      title: locale === 'en' ? 'Case 2' : '案例 2',
      content: locale === 'en' ? 'Content of case 2' : '案例2的内容',
      image: '/placeholder.jpg',
      date: '2023-01-02'
    }
  ];
}

module.exports = {
  fetchProducts,
  fetchNewsItems,
  fetchCases
}; 