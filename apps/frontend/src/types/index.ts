export type AsyncResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string; status?: number };