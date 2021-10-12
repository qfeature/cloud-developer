import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo, timeInMs, setLatencyMetric } from '../../helpers/todos'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const startTime = timeInMs() // Record time start
    try {
      logger.info('Processing CreateTodo event', event)

      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      // TODO: Implement creating a new TODO item

      const userId = getUserId(event)

      const newItem = await createTodo(userId, newTodo)
      logger.info('New todo item created', newItem)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch (e) {
      logger.error('Create todo item error', { error: e.message })
      throw new Error(e)
    } finally {
      const endTime = timeInMs(); // Record time finished
      const totalTime = endTime - startTime;
      await setLatencyMetric('createTodoMetric', totalTime)
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )