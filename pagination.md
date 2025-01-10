# Table Pagination Across Pages

## Overview
The goal is to implement a feature that allows tables to expand across multiple pages when their content exceeds a single page's capacity. Each page should display complete rows with headers, and no row should be cut off midway.

## Technical Requirements

### 1. Table Expansion Mode
- Add an `isExpanded` property to the Table type
- Add a toggle button in the table header to switch between normal and expanded modes
- When expanded, calculate and create necessary pages automatically

### 2. Row Height Calculation
- Calculate fixed height for table header
- Calculate fixed height for each row
- Account for borders and padding
- Formula: `rowHeight = fontSize + verticalPadding + borderWidth`

### 3. Page Capacity Calculation
```typescript
interface PageCapacity {
  availableHeight: number;      // Page height minus margins
  rowsPerPage: number;         // How many rows fit on one page
  headerHeight: number;        // Height of the table header
  effectiveHeight: number;     // Height available for table content
}

// Calculate how many complete rows can fit on a page
function calculatePageCapacity(pageHeight: number): PageCapacity {
  const margins = 40;          // 20px top + 20px bottom
  const headerHeight = 40;     // Table header height
  const rowHeight = 36;        // Height of each row
  
  const availableHeight = pageHeight - margins;
  const effectiveHeight = availableHeight - headerHeight;
  const rowsPerPage = Math.floor(effectiveHeight / rowHeight);
  
  return {
    availableHeight,
    rowsPerPage,
    headerHeight,
    effectiveHeight
  };
}
```

### 4. Page Distribution Algorithm
1. Calculate total pages needed:
```typescript
const totalPages = Math.ceil(table.data.length / rowsPerPage);
```

2. Distribute rows across pages:
```typescript
interface PagedTable extends Table {
  startRow: number;
  endRow: number;
  pageNumber: number;
  totalPages: number;
}

function distributeRows(table: Table, rowsPerPage: number): PagedTable[] {
  const pages: PagedTable[] = [];
  const totalRows = table.data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  for (let i = 0; i < totalPages; i++) {
    const startRow = i * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, totalRows);
    
    pages.push({
      ...table,
      startRow,
      endRow,
      pageNumber: i + 1,
      totalPages,
      data: table.data.slice(startRow, endRow)
    });
  }
  
  return pages;
}
```

### 5. Page Management
- When a table is expanded:
  1. Calculate required pages
  2. Insert new pages after current page
  3. Distribute table data across pages
  4. Update page navigation
- When a table is collapsed:
  1. Remove additional pages
  2. Return to single page view
  3. Restore original table state

### 6. Visual Indicators
- Add page numbers to expanded tables
- Show expansion status in table header
- Add visual connection between related tables
- Display total pages for expanded tables

### 7. State Management
```typescript
interface ExpandedTableState {
  originalTableId: string;
  pageIds: string[];          // IDs of pages containing table parts
  currentPage: number;
  totalPages: number;
}

interface PageState {
  id: string;
  tables: Table[];
  expandedTables: ExpandedTableState[];
}
```

## Implementation Steps

1. Update Table Type:
   - Add expansion-related properties
   - Add pagination metadata

2. Create Pagination Components:
   - Table expansion toggle
   - Page capacity calculator
   - Row distribution manager

3. Update Page Management:
   - Handle table expansion
   - Manage page creation/deletion
   - Update navigation

4. Add Visual Elements:
   - Expansion toggle button
   - Page indicators
   - Table connection indicators

5. Implement State Management:
   - Track expanded tables
   - Manage page relationships
   - Handle table collapse

6. Add User Interactions:
   - Toggle table expansion
   - Navigate expanded tables
   - Collapse expanded tables

## Edge Cases to Handle

1. Table Position:
   - Ensure tables start at top of new pages
   - Maintain consistent margins

2. Page Breaks:
   - Never split rows across pages
   - Always include headers on new pages

3. Resizing:
   - Recalculate pagination when table is resized
   - Update row distribution

4. Multiple Tables:
   - Handle multiple expanded tables
   - Manage page order
   - Track relationships between split tables 