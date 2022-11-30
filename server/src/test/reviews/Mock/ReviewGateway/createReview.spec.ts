import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { BackendReviewGateway } from '../../../../reviews'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: Create Review', () => {
  let uri: string
  let mongoClient: MongoClient
  let backendReviewGateway: BackendReviewGateway
  let mongoMemoryServer: MongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create()
    uri = mongoMemoryServer.getUri()
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    backendReviewGateway = new BackendReviewGateway(mongoClient)
    mongoClient.connect()
  })

  beforeEach(async () => {
    const response = await backendReviewGateway.deleteAll()
    expect(response.success).toBeTruthy()
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('inserts valid review', async () => {
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
    const response = await backendReviewGateway.createReview(validReview)
    expect(response.success).toBeTruthy()
    expect(response.payload).toStrictEqual(validReview)
  })

  test('fails to insert review with duplicate id', async () => {
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
    const validResponse = await backendReviewGateway.createReview(validReview)
    expect(validResponse.success).toBeTruthy()
    const invalidReview: IReview = makeIReview(
      'review1',
      'author1',
      'node1',
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const invalidResponse = await backendReviewGateway.createReview(invalidReview)
    expect(invalidResponse.success).toBeFalsy()
  })

  // test('fails to insert review with the same review and node id', async () => {
  //   const invalidReview: IReview = makeIReview(
  //     'review1',
  //     'author1',
  //     'review1',
  //     'content1',
  //     1,
  //     ['reply1'],
  //     new Date(),
  //     new Date()
  //   )
  //   const invalidResponse = await backendReviewGateway.createReview(invalidReview)
  //   expect(invalidResponse.success).toBeFalsy()
  // })

  test('fails to insert review when review is of invalid type', async () => {
    const invalidReview = {
      reviewId: 1,
      author: 'author1',
      nodeId: 'node1',
      content: 'content1',
      rating: 'rating1',
      replies: ['reply1'],
      dateCreated: new Date(),
      dateUpdated: new Date(),
    }
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when node is of invalid type', async () => {
    const invalidReview = {
      reviewId: 'review1',
      author: 'author1',
      nodeId: 1,
      content: 'content1',
      rating: 'rating1',
      replies: ['reply1'],
      dateCreated: new Date(),
      dateUpdated: new Date(),
    }
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when rating is of invalid type', async () => {
    const invalidReview = {
      reviewId: 'review1',
      author: 'author1',
      nodeId: 'node1',
      content: 'content1',
      rating: 'rating1',
      replies: ['reply1'],
      dateCreated: new Date(),
      dateUpdated: new Date(),
    }
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when reviewId is not defined', async () => {
    const invalidReview = makeIReview(
      undefined,
      'author1',
      'review1',
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when nodeId is not defined', async () => {
    const invalidReview = makeIReview(
      'review1',
      'author1',
      undefined,
      'content1',
      1,
      ['reply1'],
      new Date(),
      new Date()
    )
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when rating is not defined', async () => {
    const invalidReview = makeIReview(
      'review1',
      'author1',
      'node1',
      'content1',
      undefined,
      ['reply1'],
      new Date(),
      new Date()
    )
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  test('fails to insert review when fieldName is missing', async () => {
    const invalidReview = {
      reviewId: 'review1',
      nodeId: 'node1',
      content: 'content1',
      rating: 1,
      replies: ['reply1'],
      dateCreated: new Date(),
      dateUpdated: new Date(),
    }
    const response = await backendReviewGateway.createReview(invalidReview)
    expect(response.success).toBeFalsy()
  })

  // test('fails to insert review with wrong shape', async () => {
  //   const invalidReview = {
  //     reviewId: 'review1',
  //     author: 'author1',
  //     nodeId: 'node1',
  //     content: 'content1',
  //     rating: 1,
  //     replies: ['reply1'],
  //     dateCreated: new Date(),
  //     dateUpdated: new Date(),
  //   }
  //   const response = await backendReviewGateway.createReview(invalidReview)
  //   expect(response.success).toBeFalsy()
  // })
})
