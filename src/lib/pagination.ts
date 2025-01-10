import { Table, PageCapacity } from '../types';
import { PAGE_HEIGHT } from './constants';

// Create a measurement div to calculate actual row heights
function getMeasuredRowHeight(): number {
  // Create a temporary table with a single row
  const tempTable = document.createElement('table');
  tempTable.style.visibility = 'hidden';
  tempTable.style.position = 'absolute';
  tempTable.style.top = '-9999px';
  tempTable.className = 'w-full';

  const thead = document.createElement('thead');
  thead.className = 'bg-gray-50';
  thead.innerHTML = `
    <tr>
      <th class="px-4 py-2 text-left font-medium text-gray-500 border-b">Test</th>
    </tr>
  `;

  const tbody = document.createElement('tbody');
  tbody.className = 'divide-y divide-gray-200';
  tbody.innerHTML = `
    <tr>
      <td class="px-4 py-2 text-gray-900">Test Data</td>
    </tr>
  `;

  tempTable.appendChild(thead);
  tempTable.appendChild(tbody);
  document.body.appendChild(tempTable);

  // Measure heights
  const rowHeight = tbody.getBoundingClientRect().height;

  // Cleanup
  document.body.removeChild(tempTable);

  return rowHeight;
}

// Cache for measured heights
let cachedRowHeight: number | null = null;
let cachedHeaderHeight: number | null = null;

const PAGE_MARGINS = 40; // Total vertical margins (top + bottom)
const TOP_MARGIN_SUBSEQUENT_PAGES = 50; // Margin for tables on subsequent pages

function getRowHeight(): number {
  if (cachedRowHeight === null) {
    cachedRowHeight = getMeasuredRowHeight();
  }
  return cachedRowHeight;
}

function getHeaderHeight(): number {
  if (cachedHeaderHeight === null) {
    // Create a temporary header to measure
    const tempHeader = document.createElement('div');
    tempHeader.style.visibility = 'hidden';
    tempHeader.style.position = 'absolute';
    tempHeader.style.top = '-9999px';
    tempHeader.innerHTML = `
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th colspan="4" class="px-4 py-2 text-left font-medium text-gray-500 border-b">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <span>Table Header</span>
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th class="px-4 py-2 text-left font-medium text-gray-500 border-b">Column</th>
          </tr>
        </thead>
      </table>
    `;

    document.body.appendChild(tempHeader);
    cachedHeaderHeight = tempHeader.getBoundingClientRect().height;
    document.body.removeChild(tempHeader);
  }
  return cachedHeaderHeight;
}

export function calculatePageCapacity(pageHeight: number = PAGE_HEIGHT, isFirstPage: boolean = true, tableY: number = 0): PageCapacity {
  const PAGE_MARGINS = 40; // Total vertical margins (top + bottom)
  const TOP_MARGIN_SUBSEQUENT_PAGES = 50; // Margin for tables on subsequent pages
  
  // For first page, account for table's Y position
  // For subsequent pages, use a fixed top margin
  const topOffset = isFirstPage ? tableY : TOP_MARGIN_SUBSEQUENT_PAGES;
  
  const availableHeight = pageHeight - PAGE_MARGINS - topOffset;
  const headerHeight = getHeaderHeight();
  const effectiveHeight = availableHeight - headerHeight;
  const rowHeight = getRowHeight();
  const rowsPerPage = Math.floor(effectiveHeight / rowHeight);

  return {
    availableHeight,
    rowsPerPage,
    headerHeight,
    effectiveHeight
  };
}

export function distributeTableAcrossPages(
  table: Table,
  currentPageId: string,
  _rowsPerPage: number
): { pages: { id: string; table: Table }[]; expandedState: { originalTableId: string; pageIds: string[]; currentPage: number; totalPages: number; } } {
  const totalRows = table.data.length;
  
  // Calculate capacity for first page considering table's position
  const firstPageCapacity = calculatePageCapacity(PAGE_HEIGHT, true, table.position.y);
  // Calculate capacity for subsequent pages
  const subsequentPageCapacity = calculatePageCapacity(PAGE_HEIGHT, false);
  
  // First page can hold fewer rows due to table position
  let remainingRows = totalRows;
  let currentRow = 0;
  const pages: { id: string; table: Table }[] = [];
  const pageIds: string[] = [];
  let pageNumber = 1;
  
  while (remainingRows > 0) {
    const isFirstPage = pageNumber === 1;
    const capacity = isFirstPage ? firstPageCapacity : subsequentPageCapacity;
    const rowsForThisPage = Math.min(capacity.rowsPerPage, remainingRows);
    const pageId = isFirstPage ? currentPageId : crypto.randomUUID();
    pageIds.push(pageId);
    
    const pagedTable: Table = {
      ...table,
      id: isFirstPage ? table.id : crypto.randomUUID(),
      originalTableId: table.id,
      isExpanded: true,
      pageNumber,
      totalPages: Math.ceil((totalRows - firstPageCapacity.rowsPerPage) / subsequentPageCapacity.rowsPerPage) + 1,
      startRow: currentRow,
      endRow: currentRow + rowsForThisPage,
      data: table.data.slice(currentRow, currentRow + rowsForThisPage),
      position: isFirstPage ? table.position : { x: 50, y: TOP_MARGIN_SUBSEQUENT_PAGES },
    };
    
    pages.push({
      id: pageId,
      table: pagedTable
    });
    
    remainingRows -= rowsForThisPage;
    currentRow += rowsForThisPage;
    pageNumber++;
  }

  const expandedState = {
    originalTableId: table.id,
    pageIds,
    currentPage: 1,
    totalPages: pages.length
  };

  return { pages, expandedState };
}

export function calculateTableHeight(rowCount: number): number {
  return getHeaderHeight() + (rowCount * getRowHeight());
}

export function isTableOverflowing(table: Table, pageHeight: number = PAGE_HEIGHT): boolean {
  const tableHeight = calculateTableHeight(table.data.length);
  const availableHeight = pageHeight - PAGE_MARGINS;
  return tableHeight > availableHeight;
}

// Function to reset cached measurements (useful if styles change)
export function resetMeasurements(): void {
  cachedRowHeight = null;
  cachedHeaderHeight = null;
} 