//import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
//import { TodoItem } from '../models/TodoItem'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
//import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

// const todoAccess = new TodoAccess()

// // Get all todo items (for a user)
// export async function getTodosForUser(userId: String): Promise<TodoItem[]> {
//     return await todoAccess.getTodosForUser(userId) //Note: I probably need to provide a userId in order for this to work correctly.
// }

// // Create a group
// export async function createTodo(
//     createTodoRequest: CreateTodoRequest,
//     userId: string
// ): Promise<TodoItem> {
//     const todoId = uuid.v4() // Unique ID
    
//     return await todoAccess.createTodo({
//         userId: userId,
//         todoId: todoId,
//         createdAt: new Date().toISOString(),
//         name: createTodoRequest.name,
//         dueDate: createTodoRequest.dueDate,
//         done: false,
//         attachmentUrl: '' //QUESTION: how do i fill in this part?
//     })
// }

// Update todo item
// export async function updateTodo(updateTodoRequest: UpdateTodoRequest,
//     todoId: String)
// {
//     todoAccess.updateTodo(todoId, updateItem)
// }

// Delete todo item
// export async function deleteTodo(todoId: String) {
//     todoAccess.deleteTodo(todoId)
// }