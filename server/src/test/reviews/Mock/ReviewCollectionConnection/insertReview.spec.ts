import { IReview, makeIReview } from '../../../../types'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { ReviewCollectionConnection } from '../../../../reviews'

describe('Unit Test: InsertReview', () => {
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

  test('inserts review', async () => {
    const validReview: IReview = makeIReview(
      'review1',
      'author1',
      'node1',
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const response = await reviewCollectionConnection.insertReview(validReview)
    expect(response.success).toBeTruthy()
  })

  test('fails to insert invalid document with wrong shape', async () => {
    const invalidReview: any = { reviewId: 'id' }
    const response = await reviewCollectionConnection.insertReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  // test('fails to insert invalid document with correct shape', async () => {
  //   const doc: IReview = makeIReview(
  //     'review1',
  //     'author1',
  //     'review1',
  //     'content1',
  //     1,
  //     ['reply1'],
  //     new Date(),
  //     new Date()
  //   )
  //   const response = await reviewCollectionConnection.insertReview(doc)
  //   expect(response.success).toBeFalsy()
  // })
})
