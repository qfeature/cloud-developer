// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import 'source-map-support/register'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
// import { createTodo } from '../../helpers/todos'

// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const newTodo: CreateTodoRequest = JSON.parse(event.body)
//     // TODO: Implement creating a new TODO item

//     return undefined
// )

// handler.use(
//   cors({
//     credentials: true
//   })
// )

// import 'source-map-support/register'

// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
// import { createTodo } from '../../helpers/todos'

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // TODO: Implement creating a new TODO item
//     console.log('Processing event: ', event)

//     const newTodo: CreateTodoRequest = JSON.parse(event.body)

//     const userId = getUserId(event)

//     // Get the JWT token
//     //const authorization = event.headers.Authorization
//     //const split = authorization.split(' ')
//     //const jwtToken = split[1]

//     const newItem = await createTodo(newTodo, userId)

//     return {
//         statusCode: 201,
//         headers: {
//           'Access-Control-Allow-Origin': '*'
//         },
//         body: JSON.stringify({
//           newItem
//         })
//     }
// }
