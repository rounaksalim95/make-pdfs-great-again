import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Table as TableType } from '../../types';
import { Table } from '../tables/Table';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../lib/constants';

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
        // Calculate new position
        const newX = table.position.x + delta.x;
        const newY = table.position.y + delta.y;

        // Constrain to page bounds
        const boundedX = Math.max(0, Math.min(newX, PAGE_WIDTH - table.size.width));
        const boundedY = Math.max(0, Math.min(newY, PAGE_HEIGHT - table.size.height));

        onTableMove(table.id, {
          x: boundedX,
          y: boundedY,
        });
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div 
          className="bg-white shadow-lg mx-auto relative"
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
          }}
        >
          {tables.map(table => (
            <Table 
              key={table.id} 
              table={table}
              pageBounds={{
                width: PAGE_WIDTH,
                height: PAGE_HEIGHT
              }}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
} 