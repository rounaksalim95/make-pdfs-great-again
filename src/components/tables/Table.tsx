import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Table as TableType } from '../../types';
import { useResize } from '../../hooks/useResize';

interface TableProps {
  table: TableType;
  pageBounds: {
    width: number;
    height: number;
  };
  onResize?: (tableId: string, size: { width: number; height: number }, position: { x: number; y: number }) => void;
}

export function Table({ table, pageBounds, onResize }: TableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: table.id,
    data: table
  });

  const { handleResizeStart, isResizing, activeCorner } = useResize({
    initialSize: table.size,
    initialPosition: table.position,
    maxWidth: pageBounds.width - table.position.x,
    maxHeight: pageBounds.height - table.position.y,
    onResize: (newSize, newPosition) => {
      if (onResize) {
        onResize(table.id, newSize, newPosition);
      }
    }
  });

  // Calculate bounded position for dragging
  const boundedTransform = transform ? {
    ...transform,
    x: Math.max(0, Math.min(transform.x, pageBounds.width - table.size.width - table.position.x)),
    y: Math.max(0, Math.min(transform.y, pageBounds.height - table.size.height - table.position.y)),
  } : null;

  const style = {
    position: 'absolute' as const,
    left: table.position.x,
    top: table.position.y,
    width: table.size.width,
    height: table.size.height,
    transform: boundedTransform ? CSS.Translate.toString(boundedTransform) : undefined,
    cursor: isResizing ? 'resize' : 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isResizing ? 'select-none' : ''}`}
      {...(!isResizing ? listeners : {})}
      {...(!isResizing ? attributes : {})}
    >
      <div className="w-full h-full bg-white border border-gray-300 hover:border-blue-500">
        <div className="w-full h-full overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 border-b">Id</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 border-b">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 border-b">Age</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 border-b">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {table.data?.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{row.id}</td>
                  <td className="px-4 py-2 text-gray-900">{row.name}</td>
                  <td className="px-4 py-2 text-gray-900">{row.age}</td>
                  <td className="px-4 py-2 text-gray-900">{row.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resize handles */}
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-ne-resize ${
          activeCorner === 'top-right' ? 'opacity-100' : ''
        }`}
        onMouseDown={(e) => handleResizeStart('top-right', e)}
      />
      <div
        className={`absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize ${
          activeCorner === 'bottom-right' ? 'opacity-100' : ''
        }`}
        onMouseDown={(e) => handleResizeStart('bottom-right', e)}
      />
      <div
        className={`absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-sw-resize ${
          activeCorner === 'bottom-left' ? 'opacity-100' : ''
        }`}
        onMouseDown={(e) => handleResizeStart('bottom-left', e)}
      />
      <div
        className={`absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 cursor-nw-resize ${
          activeCorner === 'top-left' ? 'opacity-100' : ''
        }`}
        onMouseDown={(e) => handleResizeStart('top-left', e)}
      />
    </div>
  );
} 