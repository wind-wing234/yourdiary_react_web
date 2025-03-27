import { DiaryEntry } from "../diary";

interface WriteResponse {
    version: string;
    diary: DiaryEntry;
    error: number;
    // ...
}

export async function writeDiary(token: string, diary_entry: DiaryEntry): Promise<DiaryEntry> {

    const formData = new FormData();
    formData.append('title', diary_entry.title);
    formData.append('content', diary_entry.content);
    formData.append('date', diary_entry.createddate);
    formData.append('mood', diary_entry.mood);
    formData.append('weather', diary_entry.weather);

    try {
        const response = await fetch('/api/write/', {
            method: 'POST',
            headers: {
                'auth': 'token ' + token,
                'Accept': 'application/json'
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`api返回状态码: ${response.status}`);
        }

        const data: WriteResponse = await response.json();
        if (data.error !== 0) {
            throw new Error(`api返回错误码: ${data.error}`);
        }
        return data.diary;

    } catch (error) {
        console.error('writeDiary失败:', error);
        throw error;
    }
}