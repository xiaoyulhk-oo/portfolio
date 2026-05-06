// 广州地铁数据类型定义

export interface Station {
  id: string;
  nameCn: string;
  nameEn: string;
  pixelX: number;
  pixelY: number;
  lines: string[]; // 所属线路 ID 列表
  isTransfer: boolean;
}

export interface MetroLine {
  id: string;
  nameCn: string;
  nameEn: string;
  color: string;
  stations: string[]; // 站点 ID 列表（按顺序）
}

export interface RouteSegment {
  line: MetroLine;
  stations: Station[];
  transferFrom?: Station;
  transferTo?: Station;
}

export interface RouteResult {
  origin: Station;
  destination: Station;
  fare: number;
  distance: number;
  segments: RouteSegment[];
  totalStations: number;
}

export interface MetroSystem {
  lines: MetroLine[];
  stations: Record<string, Station>;
}
