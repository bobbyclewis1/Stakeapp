import React from "react";
import { useParams } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import KanbanBoard from "../kanban/KanbanBoard";

const Board = () => {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Board not found</h2>
          <p className="text-gray-500">
            The requested board could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <KanbanBoard boardId={boardId} />
        </main>
      </div>
    </div>
  );
};

export default Board;
