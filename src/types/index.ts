export interface Page {
  id: string;
  tables: Table[];
  expandedTables?: ExpandedTableState[];
}

interface TableRow {
  id: string;
  name: string;
  age: number;
  location: string;
}

export interface Table {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: TableRow[];
  isExpanded?: boolean;
  originalTableId?: string;
  pageNumber?: number;
  totalPages?: number;
  startRow?: number;
  endRow?: number;
}

export interface ExpandedTableState {
  originalTableId: string;
  pageIds: string[];
  currentPage: number;
  totalPages: number;
}

export interface PageCapacity {
  availableHeight: number;
  rowsPerPage: number;
  headerHeight: number;
  effectiveHeight: number;
} 