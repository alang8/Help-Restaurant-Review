import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { BackendReviewGateway } from '../../../../reviews'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: getReviewsByNodeId', () => {
  let uri
  let mongoClient
  let backendReviewGateway
  let mongoMemoryServer

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
    const createResponse1 = await backendReviewGateway.createReview(validReview1)
    expect(createResponse1.success).toBeTruthy()
    const createResponse2 = await backendReviewGateway.createReview(validReview2)
    expect(createResponse2.success).toBeTruthy()
    const getReviewsByIdResp = await backendReviewGateway.getReviewsByNodeId('node1')
    expect(getReviewsByIdResp.success).toBeTruthy()
    expect(getReviewsByIdResp.payload.length).toBe(2)
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
    const createResponse = await backendReviewGateway.createReview(validReview)
    expect(createResponse.success).toBeTruthy()
    const getReviewByIdResp = await backendReviewGateway.getReviewById('1')
    expect(getReviewByIdResp.success).toBeFalsy()
  })
})
