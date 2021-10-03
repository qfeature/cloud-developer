//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
//import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

//const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

// export class TodoAccess {

//     // class constructor
//     constructor(
//         private readonly docClient: DocumentClient = createDynamoDBClient(),
//         private readonly todosTable = process.env.TODOS_TABLE,
//         private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX) {
//     }

//     // get all todo items (for a user)
//     async getTodosForUser(userId: String): Promise<TodoItem[]> {
//         console.log(`Getting todo items for user ${userId}`)

//         // Get todos based on user id
//         const result = await this.docClient.query({
//             TableName: this.todosTable,
//             IndexName: this.todosTableIndex,
//             KeyConditionExpression: 'userId = :userId',
//             ExpressionAttributeValues: {
//                 ':userId': userId
//             }
//         }).promise()

//         // Get all todos
//         // const result = await this.docClient.scan({
//         //     TableName: this.todosTable
//         // }).promise()

//         const items = result.Items
//         return items as TodoItem[]
//     }

//     // create a todo item
//     async createTodo(todoItem: TodoItem): Promise<TodoItem> {
//         console.log(`Creating a todo item with id ${todoItem.todoId}`)

//         await this.docClient.put({
//             TableName: this.todosTable,
//             Item: todoItem
//         }).promise()

//         return todoItem
//     }

//     // update a todo item
//     //async updateTodo(todoId: String, updateItem: UpdateTodoRequest) {
//     //    console.log(`Updating a todo item with id ${todoId}`)
//     //}

//     // delete a todo item
//     async deleteTodo(todoId: String) {
//         console.log(`Deleting a todo item with id ${todoId}`)
//         await this.docClient.delete({
//             TableName: this.todosTable,
//             Key: {"todoId": todoId}
//         }).promise()
//     }
// }

// function createDynamoDBClient() {
//     if (process.env.IS_OFFLINE) {
//         console.log('Creating a local DynamoDB instance')
//         return new XAWS.DynamoDB.DocumentClient({
//             region: 'localhost',
//             endpoint: 'http://localhost:8000'
//         })
//     }

//     return new XAWS.DynamoDB.DocumentClient()
// }