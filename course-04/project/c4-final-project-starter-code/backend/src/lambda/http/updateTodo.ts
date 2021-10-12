import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo, findTodo, timeInMs, setLatencyMetric } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const startTime = timeInMs() // Record time start
    try {
      logger.info('Processing UpdateTodo event', event)

      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

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
            error: 'Todo not updated. Todo item is not owned by user.'
          })
        }
      }

      await updateTodo(userId, todoId, updatedTodo)
      logger.info(`Todo item updated for todoId ${todoId} with userId ${userId}`, updatedTodo)

      return {
          statusCode: 201,
          body: JSON.stringify({})
      }
    } catch (e) {
      logger.error('Update todo item error', { error: e.message })
      throw new Error(e)
    } finally {
      const endTime = timeInMs(); // Record time finished
      const totalTime = endTime - startTime;
      await setLatencyMetric('updateTodoMetric', totalTime)
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )