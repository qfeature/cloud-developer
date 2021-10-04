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
        private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX) {
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

        // Get all todos
        // const result = await this.docClient.scan({
        //     TableName: this.todosTable
        // }).promise()

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
        logger.info(`Updating a todo item ${todoId} with userId ${userId}`, JSON.stringify(updateItem))

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
    // async deleteTodo(todoId: String) {
    //     console.log(`Deleting a todo item with id ${todoId}`)
    //     await this.docClient.delete({
    //         TableName: this.todosTable,
    //         Key: {"todoId": todoId}
    //     }).promise()
    // }
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