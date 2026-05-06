// Dijkstra 最短路径算法 - 计算地铁换乘路线

import { Station, MetroLine, RouteResult, RouteSegment } from '@/types/metro';
import { metroLines, stations } from '@/data/guangzhou-metro';

// 计算两点之间的像素距离
function calculateDistance(station1: Station, station2: Station): number {
  const dx = station1.pixelX - station2.pixelX;
  const dy = station1.pixelY - station2.pixelY;
  return Math.sqrt(dx * dx + dy * dy);
}

// 构建邻接表
function buildAdjacencyList(): Map<string, Array<{ stationId: string; line: MetroLine; distance: number }>> {
  const adjacency = new Map<string, Array<{ stationId: string; line: MetroLine; distance: number }>>();

  // 初始化所有站点
  for (const stationId of Object.keys(stations)) {
    adjacency.set(stationId, []);
  }

  // 对于每条线路，连接相邻站点
  for (const line of metroLines) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const currentId = line.stations[i];
      const nextId = line.stations[i + 1];
      const current = stations[currentId];
      const next = stations[nextId];

      if (!current || !next) continue;

      const distance = calculateDistance(current, next);

      // 双向添加边
      adjacency.get(currentId)!.push({ stationId: nextId, line, distance });
      adjacency.get(nextId)!.push({ stationId: currentId, line, distance });
    }
  }

  return adjacency;
}

// Dijkstra 算法查找最短路径
function dijkstra(originId: string, destId: string): { distance: number; previous: Map<string, { stationId: string; line: MetroLine }> } | null {
  if (!stations[originId] || !stations[destId]) {
    return null;
  }

  const adjacency = buildAdjacencyList();
  const distances = new Map<string, number>();
  const previous = new Map<string, { stationId: string; line: MetroLine }>();
  const visited = new Set<string>();

  // 初始化距离
  for (const stationId of Object.keys(stations)) {
    distances.set(stationId, stationId === originId ? 0 : Infinity);
  }

  while (visited.size < Object.keys(stations).length) {
    // 找到未访问的最小距离站点
    let minStation: string | null = null;
    let minDistance = Infinity;

    for (const [stationId, distance] of distances) {
      if (!visited.has(stationId) && distance < minDistance) {
        minDistance = distance;
        minStation = stationId;
      }
    }

    if (!minStation) break;
    if (minStation === destId) break;

    visited.add(minStation);

    // 遍历邻居
    for (const neighbor of adjacency.get(minStation) || []) {
      if (visited.has(neighbor.stationId)) continue;

      const alt = distances.get(minStation)! + neighbor.distance;
      if (alt < distances.get(neighbor.stationId)!) {
        distances.set(neighbor.stationId, alt);
        previous.set(neighbor.stationId, { stationId: minStation, line: neighbor.line });
      }
    }
  }

  if (distances.get(destId) === Infinity) {
    return null;
  }

  return { distance: distances.get(destId)!, previous };
}

// 构建路线结果
export function findRoute(originId: string, destId: string): RouteResult | null {
  const result = dijkstra(originId, destId);
  if (!result) return null;

  const origin = stations[originId];
  const dest = stations[destId];

  // 重建路径
  const path: string[] = [];
  const lineChanges: Array<{ stationId: string; line: MetroLine }> = [];

  let current = destId;
  while (current !== originId) {
    const prev = result.previous.get(current);
    if (!prev) break;
    path.unshift(current);
    lineChanges.unshift({ stationId: current, line: prev.line });
    current = prev.stationId;
  }
  path.unshift(originId);

  // 构建路线段
  const segments: RouteSegment[] = [];
  let currentLine = lineChanges[0]?.line;
  let currentStations: Station[] = [origin];

  for (let i = 0; i < lineChanges.length; i++) {
    const change = lineChanges[i];
    const station = stations[change.stationId];

    if (change.line.id === currentLine?.id) {
      // 同一线路，继续
      currentStations.push(station);
    } else {
      // 换乘
      if (currentStations.length > 1) {
        segments.push({
          line: currentLine!,
          stations: [...currentStations],
          transferTo: station,
        });
      }
      currentLine = change.line;
      currentStations = [
        stations[lineChanges[i - 1]?.stationId || originId],
        station,
      ];
    }
  }

  // 添加最后一段
  if (currentStations.length > 1) {
    segments.push({
      line: currentLine!,
      stations: [...currentStations],
    });
  }

  return {
    origin,
    destination: dest,
    fare: 0,
    distance: result.distance,
    segments,
    totalStations: path.length,
  };
}

// 估计实际距离（公里）
// 由于我们只有像素坐标，需要估算
const PIXELS_TO_KM_RATIO = 0.001; // 假设 1 像素 = 0.001 公里

export function estimateDistanceInKm(pixelDistance: number): number {
  return pixelDistance * PIXELS_TO_KM_RATIO;
}
