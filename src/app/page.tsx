'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        // POSTリクエストで認証トークンを生成
        const response = await fetch('/api/getAuthToken', {
          method: 'POST',
          body: JSON.stringify({
            langChat01: 'example-channel',
            testMember01: 'example-member',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          // 認証トークンを取得
          setAuthToken(data.authToken);
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchAuthToken();
  }, []);

  if (!authToken) {
    return <div>Loading...</div>;
  }

  return <div>取得した認証トークン: {authToken}</div>;
}