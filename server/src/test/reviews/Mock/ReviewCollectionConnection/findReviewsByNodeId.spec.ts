import { ReviewCollectionConnection } from '../../../../reviews'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: findReviewsById', () => {
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

  test('gets reviews when given valid ids', async () => {
    const validReview1: IReview = makeIReview(
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
    const validReview2: IReview = makeIReview(
      'review2',
      'author2',
      'node1',
      'review1',
      'content2',
      2,
      ['reply2'],
      new Date(),
      new Date()
    )
    const createResponse1 = await reviewCollectionConnection.insertReview(validReview1)
    const createResponse2 = await reviewCollectionConnection.insertReview(validReview2)
    expect(createResponse1.success).toBeTruthy()
    expect(createResponse2.success).toBeTruthy()
    const findReviewsByIdResp = await reviewCollectionConnection.findReviewsByNodeId(
      'node1'
    )
    expect(findReviewsByIdResp.success).toBeTruthy()
    expect(findReviewsByIdResp.payload.length).toBe(2)
  })

  test('success when some reviews are not found', async () => {
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
    const validReview2: IReview = makeIReview(
      'review2',
      'author2',
      'node2',
      'review1',
      'content2',
      2,
      ['reply2'],
      new Date(),
      new Date()
    )
    const createResponse = await reviewCollectionConnection.insertReview(validReview)
    const createResponse2 = await reviewCollectionConnection.insertReview(validReview2)
    expect(createResponse.success).toBeTruthy()
    expect(createResponse2.success).toBeTruthy()
    const findReviewsByIdResp = await reviewCollectionConnection.findReviewsByNodeId(
      'node1'
    )
    expect(findReviewsByIdResp.success).toBeTruthy()
    expect(findReviewsByIdResp.payload.length).toBe(1)
  })

  test('success when reviews are not found', async () => {
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
    const findReviewsByIdResp = await reviewCollectionConnection.findReviewsByNodeId('1')
    expect(findReviewsByIdResp.success).toBeTruthy()
    expect(findReviewsByIdResp.payload.length).toBe(0)
  })
})
