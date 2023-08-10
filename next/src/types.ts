export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  message?: string
  _id?: string
  token?: string
  email?: string
}

export type User = {
  _id: string
  email: string
  password?: string
}

export type Task = {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'in_review' | 'done'
  user: User
}
