"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {

  const router = useRouter();
  const { roomId } = use(params);
  const [token, setToken] = useState<string | null>(null);
  const [socket,setSocket]=useState<WebSocket|null>(null)
    useEffect(() => {
      const stored = localStorage.getItem("token") ?? null;
      if (!stored) {
        router.push("/");
        return;
      }
      setToken(stored);
      const ws = new WebSocket(`ws://localhost:3001?token=${stored}`);
      ws.onopen = () => console.log("connected to room",ws);
      ws.onmessage = (event) => {
        
      };
      setSocket(ws);
  
      return () => {
        ws.close();
      };
    }, [router]);
  
  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <h1 className="text-2xl font-bold">roomId- {roomId}</h1>
    </div>
  );
}
