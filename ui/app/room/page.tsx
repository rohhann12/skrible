"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function RoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [socket,setSocket]=useState<WebSocket|null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("token") ?? null;
    if (!stored) {
      router.push("/");
      return;
    }
    setToken(stored);
    const ws = new WebSocket(`ws://localhost:3001?token=${stored}`);
    ws.onopen = () => console.log("connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data",data)
      if (data.type === "ROOM_CREATED") {
        router.push(`/room/${data.roomId}`);
        localStorage.setItem("room",data.roomId)
      } else if (data.type === "JOIN_SUCCESS") {
        router.push(`/room/${data.roomId}`);
        localStorage.setItem("room",data.roomId)
      } else if (data.type === "ROOM_NOT_FOUND") {
        setError("Room not found. Check the ID and try again.");
      }
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [router]);

  function handleJoin(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    setError(null);
    socket.send(JSON.stringify({ type: "JOIN_ROOM", roomId }));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }
  function handleCreate(e: { preventDefault(): void }){
    e.preventDefault()
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    console.log("hi")
    const data=JSON.stringify({ type:"CREATE_ROOM" })
    socket.send(data)
  }
  if (!token) return null;

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Join Room</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium mb-1">
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Join
          </button>
        </form>
    <br/>
        <form onSubmit={handleCreate} className="space-y-4">
          <h1>
            or
            <br/></h1>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
