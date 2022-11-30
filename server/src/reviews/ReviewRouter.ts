import express, { Request, Response, Router } from 'express'
import { MongoClient } from 'mongodb'
import { IServiceResponse, isIReview, IReview } from '../types'
import { BackendReviewGateway } from './BackendReviewGateway'

// eslint-disable-next-line new-cap
export const ReviewExpressRouter = express.Router()

/**
 * ReviewRouter uses ReviewExpressRouter (an express router) to define responses
 * for specific HTTP requests at routes starting with '/review'.
 * E.g. a post request to '/review/create' would create a review.
 * The ReviewRouter contains a BackendReviewGateway so that when an HTTP request
 * is received, the ReviewRouter can call specific methods on BackendReviewGateway
 * to trigger the appropriate response. See server/src/app.ts to see how
 * we set up ReviewRouter.
 */
export class ReviewRouter {
  backendReviewGateway: BackendReviewGateway

  constructor(mongoClient: MongoClient) {
    this.backendReviewGateway = new BackendReviewGateway(mongoClient)

    /**
     * Request to create a review
     * @param req request object coming from client
     * @param res response object to send to client
     */
    ReviewExpressRouter.post('/create', async (req: Request, res: Response) => {
      try {
        const review = req.body.review
        if (!isIReview(review)) {
          res.status(400).send('not valid IReview!')
        } else {
          const response = await this.backendReviewGateway.createReview(review)
          res.status(200).send(response)
        }
      } catch (e) {
        res.status(500).send(e.message)
      }
    })

    /**
     * Request to retrieve reviews by reviewId
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    ReviewExpressRouter.get(
      '/getByReviewId/:reviewId',
      async (req: Request, res: Response) => {
        try {
          const reviewId = req.params.reviewId
          const resp: IServiceResponse<IReview> =
            await this.backendReviewGateway.getReviewById(reviewId)
          res.status(200).send(resp)
        } catch (e) {
          res.status(500).send(e.message)
        }
      }
    )

    /**
     * Request to retrieve all the reviews by nodeId
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    ReviewExpressRouter.get(
      '/getByNodeId/:nodeId',
      async (req: Request, res: Response) => {
        try {
          const nodeId = req.params.nodeId
          const resp: IServiceResponse<IReview[]> =
            await this.backendReviewGateway.getReviewsByNodeId(nodeId)
          res.status(200).send(resp)
        } catch (e) {
          res.status(500).send(e.message)
        }
      }
    )
  }

  /**
   * @returns ReviewRouter class
   */
  getExpressRouter = (): Router => {
    return ReviewExpressRouter
  }
}
