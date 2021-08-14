export interface Todo {
  id: number
  title: string
  completed: boolean
}

export type VisibilityType = "all" | "active" | "completed"
