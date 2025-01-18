export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  createdAt: number;
  tags: Tag[];
  subTasks: SubTask[];
}
