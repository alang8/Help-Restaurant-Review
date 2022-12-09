import { failureServiceResponse, IReview, IServiceResponse } from '../types'
import { endpoint, get, post } from '../global'

/** In development mode (locally) the server is at localhost:5000*/
const baseEndpoint = endpoint

/** This is the path to the link microservice */
const servicePath = 'review/'

/**
 * [FRONTEND REVIEW GATEWAY]
 * FrontendReviewGateway handles HTTP requests to the host, which is located on
 * the server. This FrontendReviewGateway object uses the baseEndpoint, and
 * additional server information to access the requested information.
 *
 * These methods use the get, post, put and remove http requests from request.ts
 * helper methods to make requests to the server.
 */
export const FrontendReviewGateway = {
  createReview: async (review: IReview): Promise<IServiceResponse<IReview>> => {
    try {
      return await post<IServiceResponse<IReview>>(
        baseEndpoint + servicePath + 'create',
        {
          review: review,
        }
      )
    } catch (exception) {
      return failureServiceResponse('[createReview] Unable to access backend')
    }
  },

  getReviewById: async (reviewId: string): Promise<IServiceResponse<IReview>> => {
    try {
      return await get<IServiceResponse<IReview>>(
        baseEndpoint + servicePath + 'getReviewById/' + reviewId
      )
    } catch (exception) {
      return failureServiceResponse('[getReviewById] Unable to access backend')
    }
  },

  getReviewsByNodeId: async (nodeId: string): Promise<IServiceResponse<IReview[]>> => {
    try {
      return await get<IServiceResponse<IReview[]>>(
        baseEndpoint + servicePath + 'getByNodeId/' + nodeId
      )
    } catch (exception) {
      return failureServiceResponse('[getReviewsByNodeId] Unable to access backend')
    }
  },
}
