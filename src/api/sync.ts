import { DiaryEntry } from "../diary";

interface SyncResponse {
    diaries: DiaryEntry[];
    diaries_paired: DiaryEntry[];
    read_marks: {                  // 对方阅读自己某篇日记的时间
        [diaryId: string]: number; // 键是自己的日记ID，值是时间戳
    };
    own_read_marks: {              // 自己阅读对方某篇日记的时间
        [diaryId: string]: number; // 键是对方的日记ID，值是时间戳
    };
    // ...
}

export async function sync(token: string): Promise<SyncResponse> {

  try {
    const response = await fetch('/api/v2/sync/', {
      method: 'POST',
      headers: {
        'auth': 'token ' + token,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`api返回状态码: ${response.status}`);
    }

    const data: SyncResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error('同步信息失败:', error);
    throw error;
  }
}
