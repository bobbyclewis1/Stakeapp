import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  X,
  Clock,
  Tag,
  CheckSquare,
  Paperclip,
  MessageSquare,
  User,
} from "lucide-react";
import { useBoardStore, Card } from "@/lib/store/board-store";

type CardDetailModalProps = {
  cardId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CardDetailModal({
  cardId,
  isOpen,
  onClose,
}: CardDetailModalProps) {
  const { cards, updateCard } = useBoardStore();
  const [card, setCard] = useState<Card | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (cardId) {
      const foundCard = cards.find((c) => c.id === cardId);
      if (foundCard) {
        setCard(foundCard);
        setTitle(foundCard.title);
        setDescription(foundCard.description || "");
        setDate(foundCard.due_date ? new Date(foundCard.due_date) : undefined);
      }
    }
  }, [cardId, cards]);

  const handleSaveTitle = async () => {
    if (cardId && title.trim() && title !== card?.title) {
      await updateCard(cardId, { title });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (cardId) {
      await updateCard(cardId, { description });
    }
    setIsEditingDescription(false);
  };

  const handleDateChange = async (newDate: Date | undefined) => {
    setDate(newDate);
    if (cardId) {
      await updateCard(cardId, {
        due_date: newDate ? newDate.toISOString() : null,
      });
    }
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="mb-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold"
                    autoFocus
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                  />
                </div>
              ) : (
                <DialogTitle
                  className="text-lg cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {card.title}
                </DialogTitle>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Due Date
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>No due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Labels
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-7">
                  + Add Label
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" /> Members
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-7">
                  + Add Member
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Description
              </h3>
              {isEditingDescription ? (
                <div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Add a more detailed description..."
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={handleSaveDescription}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDescription(card.description || "");
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 min-h-[60px]"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description ? (
                    <p className="text-sm whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Add a more detailed description...
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" /> Checklist
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                + Add Checklist
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Paperclip className="h-4 w-4 mr-2" /> Attachments
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                + Add Attachment
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  Move
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
