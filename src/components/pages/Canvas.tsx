import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Table as TableType } from '../../types';
import { Table } from '../tables/Table';

interface CanvasProps {
  tables: TableType[];
  onTableMove?: (tableId: string, position: { x: number; y: number }) => void;
}

export function Canvas({ tables, onTableMove }: CanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (onTableMove) {
      const table = tables.find(t => t.id === active.id);
      if (table) {
        onTableMove(table.id, {
          x: table.position.x + delta.x,
          y: table.position.y + delta.y,
        });
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="bg-white shadow-lg w-[8.5in] h-[11in] mx-auto relative">
          {tables.map(table => (
            <Table key={table.id} table={table} />
          ))}
        </div>
      </DndContext>
    </div>
  );
} 