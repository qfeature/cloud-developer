import { TodoAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('Todos')
const todoAccess = new TodoAccess()

// Get all todo items (for a user)
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId)
}

// Create a group
export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
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
export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    await todoAccess.updateTodo(
        userId,
        todoId,
        {
            name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done 
        }
    )
}

// Delete todo item
export async function deleteTodo(todoId: string, userId: string) {
    todoAccess.deleteTodo(todoId, userId)
}

// Create presigned URL
export async function createAttachmentPresignedUrl(todoId: string, userId: string) {
    const todoItem = await todoAccess.findTodo(todoId, userId)

    if (!todoItem) {
        return {
            signedUrl: '',
            error: `No signed URL generated - todo item not found for todoId ${todoId} with userId ${userId}.`
        }
    }

    // save attachment URL for todo item
    await todoAccess.updateTodoUrl(todoId, userId)

    // get a presigned URL
    const attachmentUtils = new AttachmentUtils()
    const signedUrl = await attachmentUtils.getUploadUrl(todoId);

    return {signedUrl: signedUrl, error: ''}
}