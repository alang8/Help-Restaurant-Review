import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ReviewCollectionConnection } from '../../../../reviews'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: ClearReviewCollection', () => {
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

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('successfully deletes all reviews', async () => {
    const validReview1: IReview = makeIReview(
      'review1',
      'author1',
      'node1',
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const response1 = await reviewCollectionConnection.insertReview(validReview1)
    expect(response1.success).toBeTruthy()

    const validReview2: IReview = makeIReview(
      'review2',
      'author2',
      'node2',
      'content2',
      2,
      ['reply2'],
      new Date(),
      new Date()
    )
    const response2 = await reviewCollectionConnection.insertReview(validReview2)
    expect(response2.success).toBeTruthy()

    const validReview3: IReview = makeIReview(
      'review3',
      'author3',
      'node3',
      'content3',
      3,
      ['reply3'],
      new Date(),
      new Date()
    )
    const response3 = await reviewCollectionConnection.insertReview(validReview3)
    expect(response3.success).toBeTruthy()

    const deleteAllResp = await reviewCollectionConnection.clearReviewCollection()
    expect(deleteAllResp.success).toBeTruthy()

    const findReview1Resp = await reviewCollectionConnection.findReviewById('1')
    expect(findReview1Resp.success).toBeFalsy()
    const findReview2Resp = await reviewCollectionConnection.findReviewById('2')
    expect(findReview2Resp.success).toBeFalsy()
    const findReview3Resp = await reviewCollectionConnection.findReviewById('3')
    expect(findReview3Resp.success).toBeFalsy()
  })
})
