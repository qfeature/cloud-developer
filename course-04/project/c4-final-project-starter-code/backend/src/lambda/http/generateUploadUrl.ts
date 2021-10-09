import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    
    const rsult = await createAttachmentPresignedUrl(todoId, userId)
    if (!rsult.signedUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: rsult.error
        })
      }
    }

    const presignedUrl = rsult.signedUrl

    return {
        statusCode: 200,
        body: JSON.stringify({
            uploadUrl: presignedUrl
        })
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
