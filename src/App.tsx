import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/pages/Canvas';
import { Page, Table } from './types';
import { PAGE_WIDTH, PAGE_HEIGHT } from './lib/constants';
import './App.css';

function App() {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', tables: [] }
  ]);
  const [selectedPage, setSelectedPage] = useState<string>('1');

  const addNewPage = () => {
    const newPage: Page = {
      id: (pages.length + 1).toString(),
      tables: []
    };
    setPages([...pages, newPage]);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    setPages(pages.filter(page => page.id !== pageId));
    if (selectedPage === pageId) {
      setSelectedPage(pages[0].id);
    }
  };

  const addNewTable = () => {
    const defaultWidth = Math.min(200, PAGE_WIDTH - 100); // Leave some margin
    const defaultHeight = Math.min(100, PAGE_HEIGHT - 100); // Leave some margin

    const newTable: Table = {
      id: crypto.randomUUID(),
      position: {
        x: Math.max(0, Math.min(50, PAGE_WIDTH - defaultWidth)),
        y: Math.max(0, Math.min(50, PAGE_HEIGHT - defaultHeight))
      },
      size: {
        width: defaultWidth,
        height: defaultHeight
      }
    };

    setPages(pages.map(page => 
      page.id === selectedPage
        ? { ...page, tables: [...page.tables, newTable] }
        : page
    ));
  };

  const handleTableMove = (tableId: string, newPosition: { x: number; y: number }) => {
    setPages(pages.map(page => 
      page.id === selectedPage
        ? {
            ...page,
            tables: page.tables.map(table =>
              table.id === tableId
                ? { ...table, position: newPosition }
                : table
            )
          }
        : page
    ));
  };

  const currentPage = pages.find(page => page.id === selectedPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        pages={pages}
        selectedPage={selectedPage}
        onPageSelect={setSelectedPage}
        onAddPage={addNewPage}
        onDeletePage={deletePage}
      />
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
          <button
            onClick={addNewTable}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Table
          </button>
        </div>
        <Canvas 
          tables={currentPage?.tables || []} 
          onTableMove={handleTableMove}
        />
      </div>
    </div>
  );
}

export default App;
