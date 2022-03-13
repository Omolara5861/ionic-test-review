export enum TodoStatus {
  completed = 'completed',
  inProgress = 'in-progress'
}

export interface Todos {
    title: string;
    completed: boolean;
    status: TodoStatus;
}
