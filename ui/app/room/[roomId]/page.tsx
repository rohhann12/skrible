"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const router = useRouter();
  const { roomId } = use(params);
  const [token, setToken] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const currentStroke = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("token") ?? null;
    if (!stored) {
      router.push("/");
      return;
    }
    setToken(stored);
    const ws = new WebSocket(`ws://localhost:3001?token=${stored}`);
    ws.onopen = () => console.log("connected to room", ws);
    ws.onmessage = (event) => {
      // draw incoming strokes from other users
      // @ts-ignore
      console.log("event",event.data)
      const data = JSON.parse(event.data);
      if (data.type === "STROKE"){
        drawStroke(data.points)
      };
    };
    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [router]);

  function drawStroke(points: { x: number; y: number }[]) {
    console.log("hi")
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    const rect = canvasRef.current!.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    lastPos.current = point;
    currentStroke.current = [point];
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
    currentStroke.current.push({ x, y });
  }

  function handleMouseUp() {
    isDrawing.current = false;
    lastPos.current = null;
    // send the full stroke to the server
    if (currentStroke.current.length > 0) {
      socketRef.current?.send(JSON.stringify({
        type: "STROKE",
        points: currentStroke.current,
        token:token,
        roomId:roomId
      }));
    }
    // console.log("hi",{ points: currentStroke.current,}) 
    currentStroke.current = [];
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 gap-4">
      <h1 className="text-2xl font-bold">roomId- {roomId}</h1>
      <canvas
        ref={canvasRef}
        width={600}
        height={800}
        className="bg-red-300"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
