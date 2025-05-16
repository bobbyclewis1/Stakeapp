import { useState } from "react";
import { useBoardStore } from "@/lib/store/board-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import KanbanCard from "./KanbanCard";
import { Skeleton } from "@/components/ui/skeleton";

type BoardListProps = {
  listId: string;
  title: string;
  cards: Array<{
    id: string;
    title: string;
    description: string | null;
    cover_color: string | null;
    cover_image: string | null;
  }>;
  onDragStart?: (e: React.DragEvent, cardId: string, listId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, listId: string) => void;
};

export default function BoardList({
  listId,
  title,
  cards,
  onDragStart,
  onDragOver,
  onDrop,
}: BoardListProps) {
  const { createCard, updateList } = useBoardStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(title);

  const handleAddCard = async () => {
    if (newCardTitle.trim()) {
      const position = cards.length
        ? Math.max(...cards.map((c) => c.position)) + 1
        : 0;
      await createCard(listId, newCardTitle, position);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (listTitle.trim() && listTitle !== title) {
      await updateList(listId, listTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      className="bg-gray-100 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-[calc(100vh-180px)]"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, listId)}
    >
      <div className="p-2 flex items-center justify-between">
        {isEditingTitle ? (
          <div className="flex w-full items-center gap-1">
            <Input
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="h-7 text-sm font-medium"
              autoFocus
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            />
          </div>
        ) : (
          <h3
            className="text-sm font-medium px-1.5 py-1 cursor-pointer hover:bg-gray-200 rounded"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h3>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            coverColor={card.cover_color}
            coverImage={card.cover_image}
            onDragStart={(e) => onDragStart && onDragStart(e, card.id, listId)}
          />
        ))}

        {isAddingCard && (
          <div className="p-2 bg-white rounded shadow-sm">
            <Input
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="mb-2 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
            />
            <div className="flex items-center gap-1">
              <Button onClick={handleAddCard} size="sm" className="h-7 text-xs">
                Add Card
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {!isAddingCard && (
        <Button
          variant="ghost"
          className="flex items-center justify-start text-sm text-gray-600 p-2 m-2 hover:bg-gray-200"
          onClick={() => setIsAddingCard(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add a card
        </Button>
      )}
    </div>
  );
}

export function BoardListSkeleton() {
  return (
    <div className="bg-gray-100 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-[calc(100vh-180px)]">
      <div className="p-2 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>

      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>

      <div className="p-2 m-2">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
