import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { MetricUtils } from './metricUtils';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('todos')
const todosAccess = new TodosAccess()

// Get all todo items (for a user)
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Getting todo list for user', userId)
    return await todosAccess.getTodosForUser(userId)
}

// Create a group
export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    logger.info(`Creating a todo item for user ${userId}`, createTodoRequest)

    const todoId = uuid.v4() // Unique ID
    logger.info('Creating new todo with todoId', todoId)

    return await todosAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: ''
    })
}

// Update todo item
export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Updating todo with todoId ${todoId} for userId ${userId}`, updateTodoRequest)
    await todosAccess.updateTodo(
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
export async function deleteTodo(userId: string, todoId: string) {
    logger.info('Deleting todo', {"userId": userId, "todoId": todoId})
    await todosAccess.deleteTodo(userId, todoId)
}

// Create presigned URL
export async function createAttachmentPresignedUrl(userId: string, todoId: string) {
    logger.info('Creating attachment presigned URL', {"userId": userId, "todoId": todoId})
    const todoItem = await todosAccess.findTodo(userId, todoId)

    if (!todoItem) {
        return {
            signedUrl: '',
            error: 'No signed URL generated - todo item not found for todoId and userId combination.'
        }
    }

    // save attachment URL for todo item
    await todosAccess.updateTodoUrl(userId, todoId)

    // get a presigned URL
    const attachmentUtils = new AttachmentUtils()
    const signedUrl = await attachmentUtils.getUploadUrl(todoId);

    return {signedUrl: signedUrl, error: ''}
}

// Metric: Set latency metric
export async function setLatencyMetric(totalTime: number) {
    const metricUtils = new MetricUtils()
    await metricUtils.setLatencyMetric(totalTime)
}

// Metric: Get current time
export function timeInMs() {
    return new Date().getTime()
}