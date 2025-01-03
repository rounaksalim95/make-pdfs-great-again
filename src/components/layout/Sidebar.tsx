import { Page } from '../../types';
import { PagePreview } from '../pages/PagePreview';

interface SidebarProps {
  pages: Page[];
  selectedPage: string;
  onPageSelect: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
}

export function Sidebar({
  pages,
  selectedPage,
  onPageSelect,
  onAddPage,
  onDeletePage,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pages</h2>
          <button
            onClick={onAddPage}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Page
          </button>
        </div>
      </div>

      {/* Page Previews */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pages.map((page) => (
          <PagePreview
            key={page.id}
            page={page}
            isSelected={selectedPage === page.id}
            onSelect={() => onPageSelect(page.id)}
            onDelete={() => onDeletePage(page.id)}
            showDeleteButton={pages.length > 1}
          />
        ))}
      </div>
    </div>
  );
} 