import { SkyWayAuthToken, SkyWayContext } from '@skyway-sdk/room';

async function fetchAuthToken(channelName: string, memberName: string): Promise<string> {
    const response = await fetch('/api/getAuthToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName, memberName }),
    });

    if (!response.ok) {
        throw new Error('認証トークンの取得に失敗しました');
    }

    const data = await response.json();
    return data.authToken;
}

export const createSkyWayContext = async (channelName: string, memberName: string) => {
    const authTokenString = await fetchAuthToken(channelName, memberName);

    return await SkyWayContext.Create(authTokenString);
};
