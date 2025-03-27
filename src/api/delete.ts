interface DeleteResponse {
    version: string;
    error: number;
    // ...
}

export async function deleteDiary(token: string, diary_id: number): Promise<void> {

    try {
        const response = await fetch('/api/diary/delete/' + diary_id + '/', {
            method: 'GET',
            headers: {
                'auth': 'token ' + token,
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`api返回状态码: ${response.status}`);
        }

        const data: DeleteResponse = await response.json();
        if (data.error !== 0) {
            throw new Error(`api返回错误码: ${data.error}`);
        }
        return;

    } catch (error) {
        console.error('deleteDiary失败:', error);
        throw error;
    }
}