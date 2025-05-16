import { useState, useEffect } from "react";
import { useBoardStore, Board, List, Card } from "@/lib/store/board-store";
import BoardList, { BoardListSkeleton } from "./BoardList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type KanbanBoardProps = {
  boardId: string;
};

export default function KanbanBoard({ boardId }: KanbanBoardProps) {
  const { currentBoard, lists, cards, loading, fetchBoardDetails, createList } =
    useBoardStore();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sourceListId, setSourceListId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBoardDetails(boardId);

    // Add sample data if this is a demo board
    if (
      boardId === "sample-1" ||
      boardId === "sample-2" ||
      boardId === "sample-3" ||
      boardId === "sample-4" ||
      boardId === "sample-5"
    ) {
      // Sample lists
      const sampleLists = [
        { id: "sample-list-1", title: "To Do", position: 0, board_id: boardId },
        {
          id: "sample-list-2",
          title: "In Progress",
          position: 1,
          board_id: boardId,
        },
        {
          id: "sample-list-3",
          title: "Review",
          position: 2,
          board_id: boardId,
        },
        { id: "sample-list-4", title: "Done", position: 3, board_id: boardId },
      ];

      // Sample cards
      const sampleCards = [
        {
          id: "sample-card-1",
          title: "Research competitors",
          description: "Analyze top 5 competitors in the market",
          position: 0,
          list_id: "sample-list-1",
        },
        {
          id: "sample-card-2",
          title: "Create wireframes",
          description: "Design initial wireframes for homepage",
          position: 1,
          list_id: "sample-list-1",
        },
        {
          id: "sample-card-3",
          title: "User interviews",
          description: "Schedule and conduct user interviews",
          position: 2,
          list_id: "sample-list-1",
        },
        {
          id: "sample-card-4",
          title: "API documentation",
          description: "Update API docs with new endpoints",
          position: 0,
          list_id: "sample-list-2",
        },
        {
          id: "sample-card-5",
          title: "Fix navigation bug",
          description: "Address issues with mobile navigation",
          position: 1,
          list_id: "sample-list-2",
        },
        {
          id: "sample-card-6",
          title: "Implement authentication",
          description: "Add OAuth integration",
          position: 0,
          list_id: "sample-list-3",
        },
        {
          id: "sample-card-7",
          title: "Design system update",
          description: "Update component library with new tokens",
          position: 1,
          list_id: "sample-list-3",
        },
        {
          id: "sample-card-8",
          title: "Landing page copy",
          description: "Finalize copy for landing page",
          position: 0,
          list_id: "sample-list-4",
        },
        {
          id: "sample-card-9",
          title: "Analytics setup",
          description: "Configure Google Analytics",
          position: 1,
          list_id: "sample-list-4",
        },
        {
          id: "sample-card-10",
          title: "Onboarding flow",
          description: "Implement new user onboarding",
          position: 2,
          list_id: "sample-list-4",
        },
      ];

      // Set sample data in store
      useBoardStore.setState({
        currentBoard: {
          id: boardId,
          title:
            boardId === "sample-1"
              ? "Product Development"
              : boardId === "sample-2"
                ? "Marketing Campaigns"
                : boardId === "sample-3"
                  ? "Design Projects"
                  : boardId === "sample-4"
                    ? "Content Calendar"
                    : "Bug Tracking",
          description: "Sample board with demo data",
          owner_id: "demo-user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          background:
            boardId === "sample-1"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500"
              : boardId === "sample-2"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : boardId === "sample-3"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : boardId === "sample-4"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-red-500 to-rose-500",
        },
        lists: sampleLists,
        cards: sampleCards,
        loading: false,
      });
    }
  }, [boardId, fetchBoardDetails]);

  const handleAddList = async () => {
    if (newListTitle.trim()) {
      const position = lists.length
        ? Math.max(...lists.map((l) => l.position)) + 1
        : 0;
      await createList(boardId, newListTitle, position);
      setNewListTitle("");
      setIsAddingList(false);
      toast({
        title: "List created",
        description: `"${newListTitle}" has been added to the board`,
      });
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    listId: string,
  ) => {
    setDraggedCardId(cardId);
    setSourceListId(listId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();

    if (!draggedCardId || !sourceListId) return;

    // Get the card being dragged
    const draggedCard = cards.find((card) => card.id === draggedCardId);
    if (!draggedCard) return;

    // Get cards in the target list to calculate new position
    const targetListCards = cards.filter(
      (card) => card.list_id === targetListId,
    );
    const newPosition =
      targetListCards.length > 0
        ? Math.max(...targetListCards.map((c) => c.position)) + 1
        : 0;

    // Update the card's list and position
    useBoardStore.getState().moveCard(draggedCardId, targetListId, newPosition);

    // Reset drag state
    setDraggedCardId(null);
    setSourceListId(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <BoardListSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Board not found</h2>
        <p className="text-gray-500">
          The requested board could not be found or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{currentBoard.title}</h1>
        {currentBoard.description && (
          <p className="text-gray-600">{currentBoard.description}</p>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => {
          const listCards = cards.filter((card) => card.list_id === list.id);
          return (
            <BoardList
              key={list.id}
              listId={list.id}
              title={list.title}
              cards={listCards}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          );
        })}

        {isAddingList ? (
          <div className="bg-gray-100 rounded-lg w-72 p-2 h-min">
            <Input
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              className="mb-2"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddList()}
            />
            <div className="flex items-center gap-1">
              <Button onClick={handleAddList} size="sm">
                Add List
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAddingList(false);
                  setNewListTitle("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-12 flex items-center gap-1 bg-gray-50/80 hover:bg-gray-100 border-dashed border-gray-300 w-72"
            onClick={() => setIsAddingList(true)}
          >
            <Plus className="h-5 w-5" />
            Add another list
          </Button>
        )}
      </div>
    </div>
  );
}
