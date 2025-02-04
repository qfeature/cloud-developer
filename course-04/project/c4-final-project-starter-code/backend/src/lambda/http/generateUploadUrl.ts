import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl, findTodo, timeInMs, setLatencyMetric } from '../../helpers/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const startTime = timeInMs() // Record time start
    try {
      logger.info('Processing GenerateUploadUrl event', event)

      const todoId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

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
            error: 'No presigned URL created. Todo item is not owned by user.'
          })
        }
      }

      const presignedUrl = await createAttachmentPresignedUrl(userId, todoId)
      logger.info('Created presigned URL', presignedUrl)

      return {
          statusCode: 200,
          body: JSON.stringify({
              uploadUrl: presignedUrl
          })
      }
    } catch (e) {
      logger.error('Create presigned URL error', { error: e.message })
      throw new Error(e)
    } finally {
      const endTime = timeInMs(); // Record time finished
      const totalTime = endTime - startTime;
      await setLatencyMetric('generateUploadUrlMetric', totalTime)
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