"use client";

import { use } from "react";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <h1 className="text-2xl font-bold">roomId- {roomId}</h1>
    </div>
  );
}
