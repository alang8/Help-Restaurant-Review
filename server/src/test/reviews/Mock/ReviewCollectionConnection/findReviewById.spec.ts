import { IReview, makeIReview } from '../../../../types'
import { ReviewCollectionConnection } from '../../../../reviews'

import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Unit Test: findReviewById', () => {
  let uri
  let mongoClient
  let reviewCollectionConnection
  let mongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create()
    uri = mongoMemoryServer.getUri()
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    reviewCollectionConnection = new ReviewCollectionConnection(mongoClient)
    mongoClient.connect()
  })

  beforeEach(async () => {
    const response = await reviewCollectionConnection.clearReviewCollection()
    expect(response.success).toBeTruthy()
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('gets review when given valid id', async () => {
    const validReview: IReview = makeIReview(
      'review1',
      'author1',
      'node1',
      null,
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const createResponse = await reviewCollectionConnection.insertReview(validReview)
    expect(createResponse.success).toBeTruthy()
    const findReviewByIdResp = await reviewCollectionConnection.findReviewById('review1')
    expect(findReviewByIdResp.success).toBeTruthy()
  })

  test('fails to get review when given invalid id', async () => {
    const validReview: IReview = makeIReview(
      'review1',
      'author1',
      'node1',
      null,
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const createResponse = await reviewCollectionConnection.insertReview(validReview)
    expect(createResponse.success).toBeTruthy()
    const findReviewByIdResp = await reviewCollectionConnection.findReviewById('review2')
    expect(findReviewByIdResp.success).toBeFalsy()
  })
})
