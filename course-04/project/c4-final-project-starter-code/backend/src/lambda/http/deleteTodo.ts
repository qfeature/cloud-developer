import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo, findTodo, timeInMs, setLatencyMetric } from '../../helpers/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const startTime = timeInMs() // Record time start
    try {
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

      // Check if todo item belongs to user
      const todoItem = await findTodo(userId, todoId)
      if (!todoItem) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: 'Todo not deleted. Todo item is not owned by user.'
          })
        }
      }

      await deleteTodo(userId, todoId)
      logger.info('Todo item deleted', {"userId": userId, "todoId": todoId})

      return {
          statusCode: 200,
          body: JSON.stringify({})
      }
    } catch (e) {
      logger.error('Delete todo item error', { error: e.message })
      throw new Error(e)
    } finally {
      const endTime = timeInMs(); // Record time finished
      const totalTime = endTime - startTime;
      await setLatencyMetric('deleteTodoMetric', totalTime)
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