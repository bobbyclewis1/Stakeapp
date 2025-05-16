import { useState, useEffect } from "react";
import { useBoardStore } from "@/lib/store/board-store";
import BoardCard from "./BoardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function BoardsList() {
  const {
    boards: fetchedBoards,
    loading,
    fetchBoards,
    createBoard,
  } = useBoardStore();

  // Sample boards for demonstration
  const sampleBoards = [
    {
      id: "sample-1",
      title: "Product Development",
      description: "Track product features and development tasks",
      background: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      id: "sample-2",
      title: "Marketing Campaigns",
      description: "Plan and execute marketing initiatives",
      background: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      id: "sample-3",
      title: "Design Projects",
      description: "UI/UX design tasks and feedback",
      background: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
    {
      id: "sample-4",
      title: "Content Calendar",
      description: "Blog posts and social media planning",
      background: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      id: "sample-5",
      title: "Bug Tracking",
      description: "Track and fix software issues",
      background: "bg-gradient-to-r from-red-500 to-rose-500",
    },
  ];

  // Combine fetched boards with sample boards
  const boards = [...fetchedBoards, ...sampleBoards];
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async () => {
    if (newBoardTitle.trim()) {
      const boardId = await createBoard(newBoardTitle, newBoardDescription);
      if (boardId) {
        toast({
          title: "Board created",
          description: `"${newBoardTitle}" has been created successfully`,
        });
        setIsCreateDialogOpen(false);
        setNewBoardTitle("");
        setNewBoardDescription("");
      }
    }
  };

  if (loading && boards.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40">
            <Skeleton className="h-24 w-full" />
            <div className="mt-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Boards</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Create Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first board to get started
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Create Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              id={board.id}
              title={board.title}
              description={board.description}
              background={board.background}
            />
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Board Title
              </label>
              <Input
                id="title"
                placeholder="Enter board title"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Enter board description"
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
