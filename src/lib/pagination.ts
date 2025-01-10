import { Table, PageCapacity } from '../types';
import { PAGE_HEIGHT } from './constants';

const ROW_HEIGHT = 36; // Height of each table row in pixels
const HEADER_HEIGHT = 40; // Height of table header in pixels
const PAGE_MARGINS = 40; // Total vertical margins (top + bottom)

export function calculatePageCapacity(pageHeight: number = PAGE_HEIGHT): PageCapacity {
  const availableHeight = pageHeight - PAGE_MARGINS;
  const effectiveHeight = availableHeight - HEADER_HEIGHT;
  const rowsPerPage = Math.floor(effectiveHeight / ROW_HEIGHT);

  return {
    availableHeight,
    rowsPerPage,
    headerHeight: HEADER_HEIGHT,
    effectiveHeight
  };
}

export function distributeTableAcrossPages(
  table: Table,
  currentPageId: string,
  rowsPerPage: number
): { pages: { id: string; table: Table }[]; expandedState: { originalTableId: string; pageIds: string[]; currentPage: number; totalPages: number; } } {
  const totalRows = table.data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pages: { id: string; table: Table }[] = [];
  const pageIds: string[] = [];

  for (let i = 0; i < totalPages; i++) {
    const startRow = i * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, totalRows);
    const pageId = i === 0 ? currentPageId : crypto.randomUUID();
    pageIds.push(pageId);

    const pagedTable: Table = {
      ...table,
      id: i === 0 ? table.id : crypto.randomUUID(),
      originalTableId: table.id,
      isExpanded: true,
      pageNumber: i + 1,
      totalPages,
      startRow,
      endRow,
      data: table.data.slice(startRow, endRow),
      position: i === 0 ? table.position : { x: 50, y: 50 }, // Position subsequent tables at the top of new pages
    };

    pages.push({
      id: pageId,
      table: pagedTable
    });
  }

  const expandedState = {
    originalTableId: table.id,
    pageIds,
    currentPage: 1,
    totalPages
  };

  return { pages, expandedState };
}

export function calculateTableHeight(rowCount: number): number {
  return HEADER_HEIGHT + (rowCount * ROW_HEIGHT);
}

export function isTableOverflowing(table: Table, pageHeight: number = PAGE_HEIGHT): boolean {
  const tableHeight = calculateTableHeight(table.data.length);
  const availableHeight = pageHeight - PAGE_MARGINS;
  return tableHeight > availableHeight;
} 