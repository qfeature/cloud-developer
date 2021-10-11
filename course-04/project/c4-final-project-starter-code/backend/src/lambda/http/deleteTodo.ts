import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing DeleteTodo event', event)

    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    if (!todoId) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: 'TodoId not provided'
          })
        }
    }

    const userId = getUserId(event)
    await deleteTodo(userId, todoId)
    logger.info('Todo item deleted', {"userId": userId, "todoId": todoId})

    return {
        statusCode: 200,
        body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )