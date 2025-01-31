export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface TodoState {
  list: Todo[];
  nextID?: number;
}
