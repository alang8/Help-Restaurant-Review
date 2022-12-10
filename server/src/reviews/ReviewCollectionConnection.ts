import {
  IServiceResponse,
  failureServiceResponse,
  successfulServiceResponse,
  IReview,
  isIReview,
} from '../types'
import { MongoClient } from 'mongodb'

/**
 * ReviewCollectionConnection acts as an in-between communicator between
 * the MongoDB database and BackendReviewGateway. ReviewCollectionConnection
 * defines methods that interact directly with MongoDB. That said, it does not
 * include any of the complex logic that BackendReviewGateway has.
 *
 * @param {MongoClient} client
 * @param {string} collectionName
 */
export class ReviewCollectionConnection {
  client: MongoClient
  collectionName: string

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.client = mongoClient
    this.collectionName = collectionName ?? 'reviews'
  }

  /**
   * Inserts a new review into the database
   * Returns successfulServiceResponse with IReview that was inserted as the payload
   *
   * @param {IReview} review
   * @return successfulServiceResponse<IReview>
   */
  async insertReview(review: IReview): Promise<IServiceResponse<IReview>> {
    if (!isIReview(review)) {
      return failureServiceResponse(
        'Failed to insert review due to improper input ' +
          'to reviewCollectionConnection.insertReview'
      )
    }
    // Insert review into database
    const insertResp = await this.client
      .db()
      .collection(this.collectionName)
      .insertOne(review)
    // Update parent review (if it exists) with this reviewId as a child
    if (review.parentReviewId) {
      const parentReview = await this.findReviewById(review.parentReviewId)
      if (!parentReview.success) {
        return failureServiceResponse(
          'Failed to find parent review with this reviewId: ' + review.parentReviewId
        )
      }
      const parent = parentReview.payload
      parent.replies.push(review.reviewId)
      const updateResp = await this.updateReview(review.parentReviewId, {
        replies: parent.replies,
      })
      if (!updateResp.success) {
        return failureServiceResponse(
          'Failed to update parent review with this reviewId: ' + review.parentReviewId
        )
      }
    }
    if (insertResp.insertedCount) {
      return successfulServiceResponse(insertResp.ops[0])
    }
    return failureServiceResponse(
      'Failed to insert review, reviewCount: ' + insertResp.insertedCount
    )
  }

  /**
   * Clears the entire review collection in the database.
   *
   * @return successfulServiceResponse<{}> on success,
   * failureServiceResponse on failure
   */
  async clearReviewCollection(): Promise<IServiceResponse<{}>> {
    const response = await this.client.db().collection(this.collectionName).deleteMany({})
    if (response.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to clear review collection.')
  }

  /**
   * Finds review by its unique reviewId
   *
   * @param {string} reviewId
   * @return successfulServiceResponse<IReview> on success
   * failureServiceResponse on failure
   */
  async findReviewById(reviewId: string): Promise<IServiceResponse<IReview>> {
    const findResp = await this.client
      .db()
      .collection(this.collectionName)
      .findOne({ reviewId: reviewId })
    if (findResp == null) {
      return failureServiceResponse(
        'Failed to find review with this reviewId: ' + reviewId
      )
    } else {
      return successfulServiceResponse(findResp)
    }
  }

  /**
   * Finds and returns all reviews attached to a given node.
   *
   * @param {string} nodeId
   * @return successfulServiceResponse<IReview[]> on success
   * failureServiceResponse on failure
   */
  async findReviewsByNodeId(nodeId: string): Promise<IServiceResponse<IReview[]>> {
    const foundReviews = []
    await this.client
      .db()
      .collection(this.collectionName)
      .find({ nodeId: nodeId })
      .forEach((review) => {
        foundReviews.push(review)
      })
    return successfulServiceResponse(foundReviews)
  }

  /**
   * Updates review when given a reviewId and a set of properties to update.
   *
   * @param {string} reviewId
   * @param {Object} properties to update in MongoDB
   * @return successfulServiceResponse<INode> on success
   *         failureServiceResponse on failure
   */
  async updateReview(
    reviewId: string,
    updatedProperties: Object
  ): Promise<IServiceResponse<IReview>> {
    const updateResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOneAndUpdate(
        { reviewId: reviewId },
        { $set: updatedProperties },
        { returnDocument: 'after' }
      )
    if (updateResponse.ok && updateResponse.lastErrorObject.n) {
      return successfulServiceResponse(updateResponse.value)
    }
    return failureServiceResponse(
      'Failed to update review, lastErrorObject: ' +
        updateResponse.lastErrorObject.toString()
    )
  }
}
