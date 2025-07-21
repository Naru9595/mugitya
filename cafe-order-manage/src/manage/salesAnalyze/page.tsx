// src/manage/salesAnalyze/page.tsx

"use client"
import React, { useState, useEffect } from 'react';
import ManageSidebar from '../component/manageSidebar';
import apiClient from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- 型定義 ---
interface SalesAnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  salesByDate: { date: string; sales: number }[];
  topSellingItems: { name: string; quantity: number }[];
}

// --- メインコンポーネント ---
function SalesAnalyze() {
  const [data, setData] = useState<SalesAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<SalesAnalyticsData>('/orders/analytics');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('売上データの取得に失敗しました。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen"><ManageSidebar /><div className="flex-1 p-6">読み込み中...</div></div>;
  }
  if (error) {
    return <div className="flex h-screen"><ManageSidebar /><div className="flex-1 p-6 text-red-500">{error}</div></div>;
  }
  if (!data) {
    return <div className="flex h-screen"><ManageSidebar /><div className="flex-1 p-6">データがありません。</div></div>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ManageSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">売上分析</h1>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold">総売上</h3>
            <p className="text-3xl font-bold">{data.totalRevenue.toLocaleString()}円</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold">総注文数</h3>
            <p className="text-3xl font-bold">{data.totalOrders}件</p>
          </div>
        </div>

        {/* グラフセクション */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* 日別売上グラフ */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">日別売上</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.salesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="売上" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 人気商品ランキング */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">人気商品ランキング (TOP 5)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topSellingItems} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value: number) => `${value}点`} />
                <Legend />
                <Bar dataKey="quantity" name="販売数" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SalesAnalyze;
