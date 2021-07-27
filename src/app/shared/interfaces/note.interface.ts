export interface Note{
    id: number;
    title: string;
    description: string;
    date: Date;
    tags: Array<string>;
    color: string;
  }