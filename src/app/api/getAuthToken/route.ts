import { SkyWayAuthToken } from '@skyway-sdk/room';
import { NextResponse } from 'next/server';

let storedAuthToken: string | null = null; // トークンを一時的に保存する変数

// POSTリクエストで認証トークンを生成
export async function POST(request: Request) {
    const { langChat01, testMember01 } = await request.json();

    // トークンペイロードの定義
    const tokenPayload = {
        jti: 'token-12345',
        iat: Math.floor(Date.now() / 1000), // 発行時刻（UNIXタイムスタンプ）
        exp: Math.floor(Date.now() / 1000) + 3600, // 有効期限（UNIXタイムスタンプ、例：1時間後）
        scope: {
            app: {
                id: '81dfc968-3ba5-49f6-8d88-422cf7d50664', // SkyWayポータルで発行されたアプリID
                turn: true,        // TURNサーバーの有効化
            },
            channel: {
                id: langChat01,   // 使用するチャンネルID
                name: langChat01, // チャンネル名
                actions: ['write'], // 許可されたアクション
                members: [
                    {
                        id: testMember01,       // メンバーID
                        name: testMember01,     // メンバー名
                        actions: ['write'],   // 許可されたアクション
                    },
                ],
            },
        },
    };

    try {
        // SkyWay認証トークンを生成
        const authToken = new SkyWayAuthToken(tokenPayload);

        // 秘密鍵でトークンをエンコード
        const secretKey = 'RcOxAbbXgA8YqDREHvuKDQ9CBTYqemMMoJDSYAnbT6U=';
        storedAuthToken = authToken.encode(secretKey);  // トークンを保存

        // クライアントにトークンを返す
        return NextResponse.json({ authToken: storedAuthToken });
    } catch (error) {
        let errorMessage = 'An unexpected error occurred';

        // 型ガードでエラーメッセージを取得
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// GETリクエストで保存された認証トークンを返す
export async function GET() {
    try {
        // 保存された認証トークンが存在するか確認
        if (!storedAuthToken) {
            return NextResponse.json({ error: 'トークンがまだ生成されていません' }, { status: 400 });
        }

        // トークンを返す
        return NextResponse.json({ authToken: storedAuthToken });
    } catch (error) {
        console.error('Token retrieval failed:', error);

        // 型ガードでエラーメッセージを取得
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
