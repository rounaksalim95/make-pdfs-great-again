import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Table as TableType } from '../../types';

interface TableProps {
  table: TableType;
}

export function Table({ table }: TableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: table.id,
    data: table
  });

  const style = {
    position: 'absolute' as const,
    left: table.position.x,
    top: table.position.y,
    width: table.size.width,
    height: table.size.height,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-300 bg-white cursor-move hover:border-blue-500 group"
      {...listeners}
      {...attributes}
    >
      {/* Resize handles */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-nw-resize" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-sw-resize" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize" />
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-ne-resize" />
    </div>
  );
} 