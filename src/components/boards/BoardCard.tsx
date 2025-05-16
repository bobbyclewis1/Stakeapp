import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

type BoardCardProps = {
  id: string;
  title: string;
  description?: string | null;
  background?: string | null;
};

export default function BoardCard({
  id,
  title,
  description,
  background,
}: BoardCardProps) {
  return (
    <Link to={`/board/${id}`} className="block">
      <Card className="h-40 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
        <div
          className="h-24 w-full"
          style={{
            backgroundColor: background || "#4299e1",
            backgroundImage: background?.startsWith("http")
              ? `url(${background})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          {description && (
            <p className="text-xs text-gray-500 truncate mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
