'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Station, RouteResult } from '@/types/metro';
import { stations } from '@/data/guangzhou-metro';
import { findRoute, estimateDistanceInKm } from '@/utils/routeCalculator';
import { calculateFare, getFareDescription } from '@/utils/fareCalculator';

// 动态导入地图组件（避免 SSR 问题）
const MetroMap = dynamic(() => import('@/components/MetroMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">加载地图中...</p>
    </div>
  ),
});

type SelectionMode = 'origin' | 'destination' | null;

export default function MetroTicketPage() {
  const [origin, setOrigin] = useState<Station | null>(null);
  const [destination, setDestination] = useState<Station | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleStationClick = useCallback((station: Station) => {
    if (station.pixelX === 0 && station.pixelY === 0) {
      setMessage(`⚠️ ${station.nameCn} 的坐标尚未标注，请先使用标注工具`);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (selectionMode === 'origin') {
      setOrigin(station);
      setSelectionMode(null);
      setRouteResult(null);
    } else if (selectionMode === 'destination') {
      setDestination(station);
      setSelectionMode(null);
    } else {
      // 默认先设置起点，再设置终点
      if (!origin) {
        setOrigin(station);
        setSelectionMode('destination');
      } else if (!destination) {
        setDestination(station);
      } else {
        // 重置选择
        setOrigin(station);
        setDestination(null);
        setRouteResult(null);
        setSelectionMode('destination');
      }
    }
  }, [selectionMode, origin, destination]);

  const handleFindRoute = useCallback(() => {
    if (!origin || !destination) {
      setMessage('请先选择起点和终点');
      return;
    }

    const result = findRoute(origin.id, destination.id);
    if (!result) {
      setMessage('未找到可行路线');
      return;
    }

    const distanceKm = estimateDistanceInKm(result.distance);
    const fare = calculateFare(distanceKm);

    setRouteResult({
      ...result,
      fare,
    });
    setMessage(null);
  }, [origin, destination]);

  const handleReset = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setRouteResult(null);
    setSelectionMode(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">广州地铁购票</h1>
              <p className="text-sm text-gray-500">点击地图选择站点</p>
            </div>
            <div className="flex gap-2">
              <a
                href="/metro/annotate"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                标注工具
              </a>
              <a
                href="/"
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 站点选择面板 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 起点选择 */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">起点</label>
              <div
                className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                  selectionMode === 'origin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${origin ? 'bg-green-50 border-green-300' : ''}`}
                onClick={() => setSelectionMode('origin')}
              >
                {origin ? (
                  <span className="text-green-700 font-medium">{origin.nameCn}</span>
                ) : (
                  <span className="text-gray-400">点击地图选择起点</span>
                )}
              </div>
            </div>

            {/* 交换按钮 */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  const temp = origin;
                  setOrigin(destination);
                  setDestination(temp);
                }}
                disabled={!origin || !destination}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            {/* 终点选择 */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">终点</label>
              <div
                className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                  selectionMode === 'destination' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${destination ? 'bg-red-50 border-red-300' : ''}`}
                onClick={() => setSelectionMode('destination')}
              >
                {destination ? (
                  <span className="text-red-700 font-medium">{destination.nameCn}</span>
                ) : (
                  <span className="text-gray-400">点击地图选择终点</span>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={handleFindRoute}
                disabled={!origin || !destination}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                查询路线
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                重置
              </button>
            </div>
          </div>

          {/* 提示信息 */}
          {message && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              {message}
            </div>
          )}

          {/* 选择模式指示 */}
          {selectionMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              {selectionMode === 'origin' ? '🖱️ 请在地图上点击选择起点' : '🖱️ 请在地图上点击选择终点'}
            </div>
          )}
        </div>

        {/* 地图区域 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-[600px]">
            <MetroMap
              onStationClick={handleStationClick}
              selectedOrigin={origin}
              selectedDestination={destination}
            />
          </div>
        </div>

        {/* 路线结果 */}
        {routeResult && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">路线信息</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">起点</p>
                <p className="text-lg font-bold text-green-700">{routeResult.origin.nameCn}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-500">终点</p>
                <p className="text-lg font-bold text-red-700">{routeResult.destination.nameCn}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">票价</p>
                <p className="text-lg font-bold text-blue-700">
                  {routeResult.fare} 元
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({getFareDescription(routeResult.fare)})
                  </span>
                </p>
              </div>
            </div>

            {/* 路线详情 */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">换乘方案</h3>
              {routeResult.segments.map((segment, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-1 text-white text-sm rounded"
                      style={{ backgroundColor: segment.line.color }}
                    >
                      {segment.line.nameCn}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {segment.stations[0]?.nameCn} → {segment.stations[segment.stations.length - 1]?.nameCn}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    途经站点：
                    {segment.stations.map((s) => s.nameCn).join(' → ')}
                  </div>
                  {index < routeResult.segments.length - 1 && (
                    <div className="mt-2 text-sm text-orange-600">
                      ⚠️ 在 {segment.transferTo?.nameCn} 换乘
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 统计信息 */}
            <div className="mt-4 flex gap-6 text-sm text-gray-500">
              <span>总站数：{routeResult.totalStations} 站</span>
              <span>换乘次数：{routeResult.segments.length - 1} 次</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
