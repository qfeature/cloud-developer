import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('Todos')

// TODO: Implement businessLogic

const todoAccess = new TodoAccess()

// Get all todo items (for a user)
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId)
}

// Create a group
export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Creating a todo item.', createTodoRequest)

    const todoId = uuid.v4() // Unique ID
    
    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: '' //QUESTION: how do i fill in this part?
    })
}

// Update todo item
export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest)
{
    //Note: Should i pass in the userId and match that as well as the todoId?
    await todoAccess.updateTodo(
        todoId,
        userId,
        {
            name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done 
        }
    )
}

// Delete todo item
// export async function deleteTodo(todoId: String) {
//     todoAccess.deleteTodo(todoId)
// }