// src/components/dashboard/RevenueChart.tsx

import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { dashboardAPI } from '@/lib/api';

// Definisikan tipe data untuk chart (lebih sederhana)
interface ChartData {
  months: string[];
  revenue: number[];
}

export const RevenueChart = () => {
  const chartRef = useRef<any>(null);
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getRevenueChart();
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Opsi untuk ECharts, sekarang hanya untuk pendapatan
  const option = {
    title: {
      text: 'Analisis Pendapatan Bulanan',
      left: 'center',
      textStyle: { fontSize: 18, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params: any[]) {
        // Karena hanya ada satu seri, kita bisa akses params[0] langsung
        const param = params[0];
        return `<strong>${param.axisValue}</strong><br/>${param.marker} Pendapatan: <strong>${formatRupiah(param.value)}</strong>`;
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false, title: 'Lihat Data', lang: ['Lihat Data', 'Tutup', 'Segarkan'] },
        magicType: { show: true, type: ['line', 'bar'], title: { line: 'Grafik Garis', bar: 'Grafik Batang' } },
        restore: { show: true, title: 'Reset' },
        saveAsImage: { show: true, title: 'Simpan Gambar' },
      },
    },
    // Legend tidak lagi diperlukan karena hanya ada satu seri
    // legend: { data: ['Pendapatan'], top: '30px' },
    grid: { right: '10%', left: '10%', bottom: '10%', top: '80px', containLabel: true },
    xAxis: {
      type: 'category',
      data: data ? data.months : [],
      axisTick: { alignWithLabel: true },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Pendapatan (IDR)',
        axisLabel: { formatter: (value: number) => `${(value / 1000000).toFixed(0)}jt` },
        splitLine: { show: true, lineStyle: { type: 'dashed' } },
      },
    ],
    series: [
      {
        name: 'Pendapatan',
        type: 'bar',
        data: data ? data.revenue : [],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-center" style={{ height: '400px' }}>
        <p>Memuat data chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <ReactECharts ref={chartRef} option={option} style={{ height: '400px' }} opts={{ renderer: 'svg' }} />
    </div>
  );
};
