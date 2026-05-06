// 广州地铁票价计算器
// 参考：广州地铁采用里程计价制

/**
 * 广州地铁票价规则：
 * - 0-4 km: 2 元
 * - 4-12 km: 每 4 km 加 1 元
 * - 12-24 km: 每 6 km 加 1 元
 * - 24 km 以上: 每 8 km 加 1 元
 * - 最高票价: 14 元
 */

const BASE_FARE = 2;
const MAX_FARE = 14;

export function calculateFare(distanceKm: number): number {
  if (distanceKm <= 0) return 0;

  let fare = BASE_FARE;

  if (distanceKm <= 4) {
    return fare;
  }

  if (distanceKm <= 12) {
    fare = 2 + Math.ceil((distanceKm - 4) / 4);
    return Math.min(fare, MAX_FARE);
  }

  if (distanceKm <= 24) {
    fare = 4 + Math.ceil((distanceKm - 12) / 6);
    return Math.min(fare, MAX_FARE);
  }

  fare = 6 + Math.ceil((distanceKm - 24) / 8);
  return Math.min(fare, MAX_FARE);
}

// 简化的站点数票价估算（当没有实际距离时使用）
export function estimateFareByStations(stationCount: number): number {
  const estimatedDistance = stationCount * 1.5; // km
  return calculateFare(estimatedDistance);
}

// 获取票价说明
export function getFareDescription(fare: number): string {
  if (fare === 2) return '2 元（4公里以内）';
  if (fare === 3) return '3 元（4-8公里）';
  if (fare === 4) return '4 元（8-12公里）';
  if (fare === 5) return '5 元（12-18公里）';
  if (fare === 6) return '6 元（18-24公里）';
  if (fare === 7) return '7 元（24-32公里）';
  if (fare === 8) return '8 元（32-40公里）';
  if (fare === 9) return '9 元（40-48公里）';
  if (fare === 10) return '10 元（48-56公里）';
  if (fare === 11) return '11 元（56-64公里）';
  if (fare === 12) return '12 元（64-72公里）';
  if (fare === 13) return '13 元（72-80公里）';
  if (fare === 14) return '14 元（80公里以上）';
  return `${fare} 元`;
}
