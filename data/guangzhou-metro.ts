// 广州地铁站点数据
// 站点坐标需要使用标注工具进行标注

import { MetroSystem, MetroLine, Station } from '@/types/metro';

export const metroLines: MetroLine[] = [
  {
    id: 'line_1',
    nameCn: '一号线',
    nameEn: 'Line 1',
    color: '#C0A040', // 黄色
    stations: [
      'station_guangzhou_east',  // 广州东站
      'station_tianlu',          // 天路
      'station_shipai',          // 石牌
      'station_tianhe',          // 天河
      'station_sports_center',   // 体育中心
      'station_fangrong',        // 芳村
      'station_huangsha',        // 黄沙
      'station_changshou',       // 长寿路
      'station_chenxiang',       // 陈家祠
      'station_ximen',           // 西门口
      'station_gongyuanqian',    // 公园前
      'station_jienkang',        // 纪念堂
      'station_xiaobei',         // 小北
      'station_tongji',          // 淘金
      'station_shanwang',        // 沙河
    ],
  },
];

export const stations: Record<string, Station> = {
  // 一号线站点 - 坐标待标注
  station_guangzhou_east: {
    id: 'station_guangzhou_east',
    nameCn: '广州东站',
    nameEn: 'Guangzhou East Railway Station',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: true,
  },
  station_tianlu: {
    id: 'station_tianlu',
    nameCn: '天路',
    nameEn: 'Tianlu',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_shipai: {
    id: 'station_shipai',
    nameCn: '石牌',
    nameEn: 'Shipai',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_tianhe: {
    id: 'station_tianhe',
    nameCn: '天河',
    nameEn: 'Tianhe',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_sports_center: {
    id: 'station_sports_center',
    nameCn: '体育中心',
    nameEn: 'Sports Center',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_fangrong: {
    id: 'station_fangrong',
    nameCn: '芳村',
    nameEn: 'Fangrong',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_huangsha: {
    id: 'station_huangsha',
    nameCn: '黄沙',
    nameEn: 'Huangsha',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_changshou: {
    id: 'station_changshou',
    nameCn: '长寿路',
    nameEn: 'Changshou Road',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_chenxiang: {
    id: 'station_chenxiang',
    nameCn: '陈家祠',
    nameEn: 'Chen Clan Ancestral Hall',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_ximen: {
    id: 'station_ximen',
    nameCn: '西门口',
    nameEn: 'West Gate',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_gongyuanqian: {
    id: 'station_gongyuanqian',
    nameCn: '公园前',
    nameEn: 'Gongyuanqian',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: true,
  },
  station_jienkang: {
    id: 'station_jienkang',
    nameCn: '纪念堂',
    nameEn: 'Jienkang Hall',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_xiaobei: {
    id: 'station_xiaobei',
    nameCn: '小北',
    nameEn: 'Xiaobei',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_tongji: {
    id: 'station_tongji',
    nameCn: '淘金',
    nameEn: 'Taojin',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
  station_shanwang: {
    id: 'station_shanwang',
    nameCn: '沙河',
    nameEn: 'Shahe',
    pixelX: 0,
    pixelY: 0,
    lines: ['line_1'],
    isTransfer: false,
  },
};

export const metroSystem: MetroSystem = {
  lines: metroLines,
  stations,
};
