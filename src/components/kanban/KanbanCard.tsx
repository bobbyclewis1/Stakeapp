import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KanbanCardProps = {
  id: string;
  title: string;
  description: string | null;
  coverColor: string | null;
  coverImage: string | null;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: () => void;
};

export default function KanbanCard({
  id,
  title,
  description,
  coverColor,
  coverImage,
  onDragStart,
  onClick,
}: KanbanCardProps) {
  return (
    <Card
      className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      {(coverColor || coverImage) && (
        <div
          className="h-12 w-full rounded-t-lg"
          style={{
            backgroundColor: coverColor || undefined,
            backgroundImage: coverImage ? `url(${coverImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="p-3">
        <h4 className="text-sm font-medium">{title}</h4>
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
