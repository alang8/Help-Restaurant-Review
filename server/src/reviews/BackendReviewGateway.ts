import { MongoClient } from 'mongodb'
import { failureServiceResponse, IServiceResponse, isIReview, IReview } from '../types'
import { IReviewProperty, isIReviewProperty } from '../types/IReviewProperty'
import { ReviewCollectionConnection } from './ReviewCollectionConnection'

/**
 * BackendReviewGateway handles requests from ReviewRouter, and calls on methods
 * in ReviewCollectionConnection to interact with the database. It contains the complex
 * logic to check whether the request is valid, before modifying the database.
 */

export class BackendReviewGateway {
  reviewCollectionConnection: ReviewCollectionConnection

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.reviewCollectionConnection = new ReviewCollectionConnection(
      mongoClient,
      collectionName ?? 'reviews'
    )
  }

  /**
   * Method to create a review and insert it into the database.
   *
   * @param review - The review to be created and inserted into the database.
   * @returns IServiceResponse<IReview> where IReview is the review that has just been
   * created
   */
  async createReview(review: any): Promise<IServiceResponse<IReview>> {
    // check if the review is valid
    const isValidReview = isIReview(review)
    if (!isValidReview) {
      return failureServiceResponse('Not a valid review.')
    }
    // check if the review is already in database
    const reviewResp = await this.getReviewById(review.reviewId)
    if (reviewResp.success) {
      return failureServiceResponse('Review with duplicate ID already exist in database.')
    }
    // check if the parent of the review exists
    if (review.parentReviewId) {
      const parentResp = await this.getReviewById(review.parentReviewId)
      if (!parentResp.success) {
        return failureServiceResponse(
          'Parent review does not exist in database. Unable to reply.'
        )
      }
    }
    // if everything checks out, insert review
    const insertResp = await this.reviewCollectionConnection.insertReview(review)
    return insertResp
  }

  /**
   * Method to retrieve review with a given reviewId.
   *
   * @param reviewId - the reviewId of the review to be retrieved.
   * @returns IServiceResponse<IReview>
   */
  async getReviewById(reviewId: string): Promise<IServiceResponse<IReview>> {
    return this.reviewCollectionConnection.findReviewById(reviewId)
  }

  /**
   * Method that gets all reviews attached to a given node.
   *
   * @param nodeId - the nodeId of the node to retrieve reviews for.
   * @returns IServiceResponse<IReview[]>
   */
  async getReviewsByNodeId(nodeId: string): Promise<IServiceResponse<IReview[]>> {
    return this.reviewCollectionConnection.findReviewsByNodeId(nodeId)
  }

  /**
   * Method to delete all reviews in the database.
   *
   * @returns IServiceResponse<{}>
   */
  async deleteAll(): Promise<IServiceResponse<{}>> {
    return await this.reviewCollectionConnection.clearReviewCollection()
  }

  /**
   * Method to update the review with the given reviewId.
   * @param reviewId the reviewId of the node
   * @param toUpdate an array of IReviewProperty
   *
   * @returns IServiceResponse<INode>
   */
  async updateReview(
    reviewId: string,
    toUpdate: IReviewProperty[]
  ): Promise<IServiceResponse<IReview>> {
    const properties: any = {}
    for (let i = 0; i < toUpdate.length; i++) {
      if (!isIReviewProperty(toUpdate[i])) {
        return failureServiceResponse('toUpdate parameters invalid')
      }
      const fieldName = toUpdate[i].fieldName
      const value = toUpdate[i].value
      properties[fieldName] = value
    }
    const reviewResponse = await this.reviewCollectionConnection.updateReview(
      reviewId,
      properties
    )
    if (!reviewResponse.success) {
      return failureServiceResponse('This review does not exist in the database!')
    }
    return reviewResponse
  }
}
