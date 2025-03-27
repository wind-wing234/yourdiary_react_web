import { Dayjs } from "dayjs";

// 单个日记条目的接口定义
export interface OriginaDiaryEntry {
  id: number;
  title: string;
  content: string;      // 中文采用unicode编码
  createddate: string;  // 创建日期，格式: "YYYY-MM-DD"
  createdtime: number | null;  // 创建具体时间，Unix timestamp
  ts: number;           // 修改时间，Unix timestamp
  msg_count: number;    
  mood: string;
  space: 'boy' | 'girl' | '';
  weather: string;
  user: number;
}

export interface DiaryEntry extends OriginaDiaryEntry {
  entryType: 'self' | 'paired';  // 自己写的还是对方写的
  read_mark?: number;    // 阅读时间戳，Unix timestamp
}

// 按月份分组的日记列表
export interface DiaryListMonthly {
  [month: string]: DiaryEntry[];
}

interface DiaryListMonthlyProps {
    month: string;
    entries: DiaryEntry[];
    onDateSelect: (entry: DiaryEntry) => void;
  }
