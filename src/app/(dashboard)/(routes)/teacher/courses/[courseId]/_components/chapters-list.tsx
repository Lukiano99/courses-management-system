"use client";

import { type Chapter } from "@prisma/client";
import { useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { GripIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ReorderChaptersType } from "@/schemas/index";
interface ChaptersListProps {
  onEdit: (chapterId: string) => void;
  onReorder: (chapters: ReorderChaptersType) => void;
  items: Chapter[];
}

const ChaptersList = ({ onEdit, onReorder, items }: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (!reorderedItem) return;
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));
    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, idx) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={idx}>
                {(provided) => (
                  <div
                    className={cn(
                      "text-s mb-4 line-clamp-1 flex items-center gap-x-2 break-words rounded-md border border-muted bg-muted-foreground/10 text-muted-foreground",
                      chapter.isPublished &&
                        "border-primary/30 bg-primary/10 text-primary",
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "rounded-l-md border-r border-r-muted/80 px-2 py-3 transition hover:bg-muted-foreground/30",
                        chapter.isPublished &&
                          "border-r-primary/30 hover:bg-primary/30",
                      )}
                      {...provided.dragHandleProps}
                    >
                      <GripIcon size={18} />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        variant={chapter.isPublished ? "default" : "draft"}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <PencilIcon
                        onClick={() => onEdit(chapter.id)}
                        size={14}
                        className="cursor-pointer transition hover:opacity-75"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;
