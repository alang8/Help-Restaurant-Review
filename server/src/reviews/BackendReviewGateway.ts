import { MongoClient } from 'mongodb'
import { failureServiceResponse, IServiceResponse, isIReview, IReview } from '../types'
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
}
