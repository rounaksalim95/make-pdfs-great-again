import { Page } from '../../types';

interface PagePreviewProps {
  page: Page;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  showDeleteButton: boolean;
}

export function PagePreview({ 
  page, 
  isSelected, 
  onSelect, 
  onDelete,
  showDeleteButton 
}: PagePreviewProps) {
  return (
    <div
      className={`relative w-full aspect-[8.5/11] mb-2 cursor-pointer group ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-200'
      }`}
      onClick={onSelect}
    >
      {/* Page Preview */}
      <div className="absolute inset-0 bg-white shadow-sm">
        {/* Mini Tables */}
        {page.tables.map(table => (
          <div
            key={table.id}
            style={{
              position: 'absolute',
              left: `${(table.position.x / 8.5)}%`,
              top: `${(table.position.y / 11)}%`,
              width: `${(table.size.width / 8.5)}%`,
              height: `${(table.size.height / 11)}%`,
            }}
            className="border border-gray-300 bg-gray-50"
          />
        ))}
      </div>

      {/* Page Number and Delete Button Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-1 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
        <span>Page {page.id}</span>
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-300 hover:text-red-100 text-xs"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
} 