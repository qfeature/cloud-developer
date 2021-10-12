import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosForUser, timeInMs, setLatencyMetric } from '../../helpers/todos'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    
    const startTime = timeInMs() // Record time start
    try { 
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
    } catch (e) {
      logger.error('Todo list error', { error: e.message })
      throw new Error(e)
    } finally {
      const endTime = timeInMs(); // Record time finished
      const totalTime = endTime - startTime;
      await setLatencyMetric(totalTime)
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )