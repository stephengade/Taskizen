export interface Lead {
    id: string;
    name: string;
    company: string;
    amount: number;
    date: string;
    avatar: string;
  }
  
  export type ColumnId = 'new' | 'inProgress' | 'backlogs' | 'closed';
  
  export interface KanbanData {
    [key: string]: Lead[];
  }
  
  