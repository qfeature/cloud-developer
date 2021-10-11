import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('Processing GetTodos event', event)

    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)
    logger.info('Todo list found', todos)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )