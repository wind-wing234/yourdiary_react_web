import { DiaryEntry } from "../diary";

interface AllByIdsResponse {
    version: string;
    diaries: DiaryEntry[];
    error: number;
    // ...
}

export async function getDiaryByID(token: string, entry: DiaryEntry): Promise<DiaryEntry> {

    const formData = new FormData();
    formData.append('diary_ids', entry.id.toString());

    try {
        const response = await fetch('/api/diary/all_by_ids/' + entry.user + '/', {
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

        const data: AllByIdsResponse = await response.json();
        if (data.error !== 0) {
            throw new Error(`api返回错误码: ${data.error}`);
        }
        const full_diary = {
            ...data.diaries[0],
            entryType: entry.entryType,
            read_mark: entry.read_mark,
        };
        return full_diary;

    } catch (error) {
        console.error('getDiartByID失败:', error);
        throw error;
    }
}

interface UpdateReadMarkResponse {
    version: string;
    error: number;
}

export async function updateReadMark(token: string, diary_id: number): Promise<void> {

    const formData = new FormData();

    try {
        const response = await fetch('/api/update_read_mark/' + diary_id + '/', {
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

        const data: UpdateReadMarkResponse = await response.json();
        if (data.error !== 0) {
            throw new Error(`api返回错误码: ${data.error}`);
        }
        return;

    } catch (error) {
        console.error('updateReadMark失败:', error);
        throw error;
    }
}
