import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/pages/Canvas';
import { Page, Table } from './types';
import { PAGE_WIDTH, PAGE_HEIGHT } from './lib/constants';
import { distributeTableAcrossPages } from './lib/pagination';
import './App.css';

// Dummy data for tables
const generateDummyData = () => {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mary', 'Nathan', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tom'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Mumbai', 'Singapore', 'Dubai', 'Hong Kong', 'Seoul', 'Moscow', 'Madrid', 'Rome', 'Amsterdam', 'Stockholm', 'Vienna', 'Bangkok', 'Cairo'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    age: Math.floor(Math.random() * 40) + 25, // Random age between 25-64
    location: cities[i % cities.length]
  }));
};

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
    const defaultWidth = Math.min(600, PAGE_WIDTH - 100); // Increased default width for table
    const defaultHeight = Math.min(400, PAGE_HEIGHT - 100); // Increased default height for table

    const newTable: Table = {
      id: crypto.randomUUID(),
      position: {
        x: Math.max(0, Math.min(50, PAGE_WIDTH - defaultWidth)),
        y: Math.max(0, Math.min(50, PAGE_HEIGHT - defaultHeight))
      },
      size: {
        width: defaultWidth,
        height: defaultHeight
      },
      data: generateDummyData()
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

  const handleTableResize = (
    tableId: string,
    newSize: { width: number; height: number },
    newPosition: { x: number; y: number }
  ) => {
    setPages(pages.map(page => 
      page.id === selectedPage
        ? {
            ...page,
            tables: page.tables.map(table =>
              table.id === tableId
                ? { 
                    ...table, 
                    size: newSize,
                    position: newPosition
                  }
                : table
            )
          }
        : page
    ));
  };

  const handleTableExpand = (tableId: string) => {
    const currentPageIndex = pages.findIndex(p => p.id === selectedPage);
    const table = pages[currentPageIndex].tables.find(t => t.id === tableId);
    
    if (!table) return;

    const { pages: pagedTables, expandedState } = distributeTableAcrossPages(table, selectedPage, 0);
    
    // Create new pages for the expanded table
    const updatedPages = [...pages];
    
    // Update the first page (current page)
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      tables: updatedPages[currentPageIndex].tables.map(t => 
        t.id === tableId ? pagedTables[0].table : t
      ),
      expandedTables: [
        ...(updatedPages[currentPageIndex].expandedTables || []),
        expandedState
      ]
    };

    // Insert new pages after the current page
    const newPages = pagedTables.slice(1).map(({ id, table }) => ({
      id,
      tables: [table],
      expandedTables: []
    }));

    updatedPages.splice(currentPageIndex + 1, 0, ...newPages);

    setPages(updatedPages);
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
          onTableResize={handleTableResize}
          onTableExpand={handleTableExpand}
        />
      </div>
    </div>
  );
}

export default App;
