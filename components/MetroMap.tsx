'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Station } from '@/types/metro';
import { stations } from '@/data/guangzhou-metro';

interface MetroMapProps {
  onStationClick: (station: Station) => void;
  mapImageUrl?: string;
}

// OpenSeadragon viewer type
interface OpenSeadragonViewer {
  open: (url: string) => void;
  addHandler: (event: string, handler: () => void) => void;
  removeHandler: (event: string, handler: () => void) => void;
  destroy: () => void;
}

// 站点点击检测半径（像素）
const STATION_CLICK_RADIUS = 25;

export default function MetroMap({
  onStationClick,
  mapImageUrl = '/assets/img/metro/map/routemap_gz_cn.png',
}: MetroMapProps) {
  const viewerRef = useRef<OpenSeadragonViewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 查找最近的站点
  const findNearestStation = useCallback((x: number, y: number): Station | null => {
    let nearest: Station | null = null;
    let minDistance = Infinity;

    for (const station of Object.values(stations)) {
      // 跳过坐标为 0,0 的未标注站点
      if (station.pixelX === 0 && station.pixelY === 0) continue;

      const dx = x - station.pixelX;
      const dy = y - station.pixelY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < STATION_CLICK_RADIUS && distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    }

    return nearest;
  }, []);

  // 初始化 OpenSeadragon
  useEffect(() => {
    if (!containerRef.current) return;

    // 动态导入 OpenSeadragon（客户端 only）
    import('openseadragon').then((OpenSeadragon) => {
      if (!containerRef.current || viewerRef.current) return;

      const viewer = OpenSeadragon.default({
        id: containerRef.current.id,
        prefixUrl: '/assets/img/openseadragon/',
        tileSources: {
          type: 'image',
          url: mapImageUrl,
        },
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        showNavigationControl: true,
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
      });

      viewerRef.current = viewer;

      // 点击事件处理
      viewer.addHandler('canvas-click', (event: any) => {
        if (!event.quick) return;

        // 获取点击位置的图像坐标
        const viewportPoint = viewer.viewport.pointFromPixel(event.position);
        const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

        const station = findNearestStation(imagePoint.x, imagePoint.y);
        if (station) {
          onStationClick(station);
        }
      });
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [mapImageUrl, findNearestStation, onStationClick]);

  return (
    <div
      ref={containerRef}
      id="metro-viewer"
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '500px' }}
    />
  );
}
