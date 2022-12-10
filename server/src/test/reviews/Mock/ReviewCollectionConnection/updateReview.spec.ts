import { IReview, makeIReview } from '../../../../types'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ReviewCollectionConnection } from '../../../../reviews'

describe('Unit Test: updateReview', () => {
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

  test('successfully updates review', async () => {
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
    const insertResp = await reviewCollectionConnection.insertReview(validReview)
    expect(insertResp.success).toBeTruthy()
    const updateResp = await reviewCollectionConnection.updateReview('review1', {
      title: 'new title',
      content: 'new content',
    })
    expect(updateResp.success).toBeTruthy()
  })

  test('fails to update review if given wrong id', async () => {
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
    const insertResp = await reviewCollectionConnection.insertReview(validReview)
    expect(insertResp.success).toBeTruthy()
    const updateResp = await reviewCollectionConnection.updateReview('review2', {
      title: 'new title',
      content: 'new content',
    })
    expect(updateResp.success).toBeFalsy()
  })
})
