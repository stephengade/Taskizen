"use client";

import Navigation from "@/components/Navigation";
import KanbanBoard from "@/components/KanbanBoard";
import { useState } from "react";

export default function KanbanPage() {
  const [showInfo, setShowInfo] = useState(true);
  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        {showInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-black py-1 px-4 flex flex-row justify-between items-center">
            <p className="text-white text-xs">
              Your data stays private - everything is stored locally in your
              browser. Just note: clearing your browser data or using incognito
              mode will start you fresh!
            </p>

            <button onClick={() => setShowInfo(false)} className="text-white">
              x
            </button>
          </div>
        )}

        <KanbanBoard />
      </div>
    </main>
  );
}
