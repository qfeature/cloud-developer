// import 'source-map-support/register'

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'

// import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
// import { getUserId } from '../utils';

// // TODO: Get all TODO items for a current user
// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // Write your code here
//     const userId = getUserId(event)

//     const todos = '...'

//     return undefined

// handler.use(
//   cors({
//     credentials: true
//   })
// )

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const result = await docClient.scan({
    TableName: todosTable
  }).promise()

  const items = result.Items
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}