'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { z } from 'zod';
import { stations } from '@/data/guangzhou-metro';

// JSON validation schema
const AnnotatedStationSchema = z.object({
  stationId: z.string(),
  nameCn: z.string(),
  pixelX: z.number(),
  pixelY: z.number(),
});

interface AnnotatedStation {
  stationId: string;
  nameCn: string;
  pixelX: number;
  pixelY: number;
}

export default function AnnotatePage() {
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [annotatedStations, setAnnotatedStations] = useState<AnnotatedStation[]>([]);
  const [currentStation, setCurrentStation] = useState<string>('');
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化 OpenSeadragon
  useEffect(() => {
    if (!containerRef.current) return;

    import('openseadragon').then((OpenSeadragon) => {
      if (!containerRef.current) return;

      const viewer = OpenSeadragon.default({
        id: containerRef.current.id,
        prefixUrl: '/assets/img/openseadragon/',
        tileSources: {
          type: 'image',
          url: '/assets/img/metro/map/routemap_gz_cn.png',
        },
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        showNavigationControl: true,
      });

      viewerRef.current = viewer;

      // 获取地图尺寸
      viewer.addHandler('open', () => {
        const imageInfo = viewer.world.getItemAt(0)?.getContentSize();
        if (imageInfo) {
          setMapSize({ width: imageInfo.x, height: imageInfo.y });
        }
        setIsLoaded(true);
      });

      viewer.addHandler('canvas-click', (event: any) => {
        if (!event.quick) return;

        const viewportPoint = viewer.viewport.pointFromPixel(event.position);
        const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

        if (currentStation) {
          const station = stations[currentStation];
          if (station) {
            setAnnotatedStations((prev) => {
              // 更新或添加
              const existing = prev.findIndex((s) => s.stationId === currentStation);
              const newEntry = {
                stationId: currentStation,
                nameCn: station.nameCn,
                pixelX: Math.round(imagePoint.x),
                pixelY: Math.round(imagePoint.y),
              };

              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = newEntry;
                return updated;
              }
              return [...prev, newEntry];
            });
          }
        }
      });
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [currentStation]);

  // 导出标注数据
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(annotatedStations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'station-coordinates.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [annotatedStations]);

  // 复制到剪贴板
  const handleCopyToClipboard = useCallback(async () => {
    const code = annotatedStations
      .map(
        (s) =>
          `  ${s.stationId}: {\n    id: '${s.stationId}',\n    nameCn: '${s.nameCn}',\n    pixelX: ${s.pixelX},\n    pixelY: ${s.pixelY},\n    lines: stations['${s.stationId}']?.lines || [],\n    isTransfer: stations['${s.stationId}']?.isTransfer || false,\n  }`
      )
      .join(',\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        alert('已复制到剪贴板！');
      } else {
        alert('剪贴板功能在当前环境下不可用');
      }
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  }, [annotatedStations]);

  // 导入 JSON
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const result = AnnotatedStationSchema.array().safeParse(data);
        if (result.success) {
          setAnnotatedStations(result.data);
          alert('导入成功！');
        } else {
          alert('无效的数据格式，请检查 JSON 结构');
        }
      } catch {
        alert('无效的 JSON 文件');
      }
    };
    reader.readAsText(file);
  }, []);

  // 获取未标注的站点列表
  const unannotatedStations = Object.values(stations).filter(
    (s) => !annotatedStations.find((a) => a.stationId === s.id) && (s.pixelX === 0 || s.pixelY === 0)
  );

  // 获取已标注的站点列表
  const annotatedStationList = Object.values(stations).filter((s) =>
    annotatedStations.find((a) => a.stationId === s.id)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">站点坐标标注工具</h1>
              <p className="text-sm text-gray-500">
                {isLoaded ? `地图尺寸: ${mapSize.width} x ${mapSize.height} px` : '加载中...'}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="/metro"
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                返回购票页面
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 选择站点 */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3">选择站点</h3>
              <select
                value={currentStation}
                onChange={(e) => setCurrentStation(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3"
              >
                <option value="">-- 选择要标注的站点 --</option>
                {unannotatedStations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameCn}
                  </option>
                ))}
              </select>
              {currentStation && (
                <p className="text-sm text-blue-600">
                  选中: {stations[currentStation]?.nameCn}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {unannotatedStations.length} 个站点待标注
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3">导出数据</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCopyToClipboard}
                  disabled={annotatedStations.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  复制代码
                </button>
                <button
                  onClick={handleExport}
                  disabled={annotatedStations.length === 0}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  导出 JSON
                </button>
                <label className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer text-center">
                  导入 JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 统计 */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-3">标注进度</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>已标注</span>
                  <span className="text-green-600 font-medium">{annotatedStations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>待标注</span>
                  <span className="text-orange-600 font-medium">{unannotatedStations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>总计</span>
                  <span className="font-medium">{Object.keys(stations).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 地图区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div
                ref={containerRef}
                id="annotate-viewer"
                className="w-full h-[700px]"
              />
            </div>

            {/* 已标注站点列表 */}
            {annotatedStations.length > 0 && (
              <div className="mt-4 bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-3">已标注站点</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {annotatedStationList.map((s) => {
                    const coord = annotatedStations.find((a) => a.stationId === s.id);
                    return (
                      <div
                        key={s.id}
                        className="p-2 bg-green-50 rounded-lg text-sm cursor-pointer hover:bg-green-100"
                        onClick={() => setCurrentStation(s.id)}
                      >
                        <span className="font-medium text-green-700">{s.nameCn}</span>
                        <span className="text-gray-400 ml-2">
                          ({coord?.pixelX}, {coord?.pixelY})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
