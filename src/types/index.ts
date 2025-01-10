export interface Page {
  id: string;
  tables: Table[];
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
} 