import { createLogger } from '../utils/logger'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')


// TODO: Implement the dataLayer logic

export class TodoAccess {

    // class constructor
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }

    //get all todo items (for a user)
    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        console.log(`Getting todo items for user ${userId}`)

        // Get todos based on user id
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosTableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    // create a todo item
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating a todo item', todoItem.todoId)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    // update a todo item
    async updateTodo(todoId: string, userId: string, updateItem: TodoUpdate) {
        logger.info(`Updating a todo item with todoId ${todoId} and userId ${userId}`, JSON.stringify(updateItem))

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {"todoId": todoId, "userId": userId},
            UpdateExpression: "SET #todoName = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": updateItem.name,
                ":dueDate": updateItem.dueDate,
                ":done": updateItem.done
            },
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ReturnValues: "UPDATED_NEW" //"NONE"
        }).promise()

        logger.info('The updated result UPDATED_NEW', JSON.stringify(result))
        //return undefined
    }

    // delete a todo item
    async deleteTodo(todoId: string, userId: string) {
        logger.info(`Deleting a todo item with todoId ${todoId} and userId ${userId}`)
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {"todoId": todoId, "userId": userId}
        }).promise()
    }

    // update a todo item URL
    async updateTodoUrl(todoId: string, userId: string) {
        logger.info(`Updating a todo item URL for todoId ${todoId} with userId ${userId}`)

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {"todoId": todoId, "userId": userId},
            UpdateExpression: "SET attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
            },
            ReturnValues: "UPDATED_NEW" //"NONE"
        }).promise()

        logger.info('The updated URL result UPDATED_NEW', JSON.stringify(result))
    }

    // find a todo item (given todo id and user id)
    async findTodo(todoId: string, userId: string): Promise<TodoItem> {
        logger.info(`Looking for a todo item with todoId ${todoId} and userId ${userId}`)

        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()

        logger.info('Found a todo item', JSON.stringify(result))
        
        return result.Item as TodoItem
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}