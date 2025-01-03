export interface Page {
  id: string;
  tables: Table[];
}

export interface Table {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
} 