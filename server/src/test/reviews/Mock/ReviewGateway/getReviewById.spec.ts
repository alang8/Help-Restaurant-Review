import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { BackendReviewGateway } from '../../../../reviews'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: getReviewById', () => {
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

  test('gets review when given valid id', async () => {
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
    const createResponse = await backendReviewGateway.createReview(validReview)
    expect(createResponse.success).toBeTruthy()
    const getReviewByIdResp = await backendReviewGateway.getReviewById('review1')
    expect(getReviewByIdResp.success).toBeTruthy()
  })

  test('fails to get review when given invalid id', async () => {
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
    const createResponse = await backendReviewGateway.createReview(validReview)
    expect(createResponse.success).toBeTruthy()
    const getReviewByIdResp = await backendReviewGateway.getReviewById('review2')
    expect(getReviewByIdResp.success).toBeFalsy()
  })
})
