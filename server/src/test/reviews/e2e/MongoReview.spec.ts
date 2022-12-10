import { MongoClient } from 'mongodb'
import { BackendReviewGateway } from '../../../reviews'
import { IReview, IServiceResponse, makeIReview, NodeType } from '../../../types'
import uniqid from 'uniqid'

jest.setTimeout(50000)

describe('E2E Test: Review CRUD', () => {
  let mongoClient: MongoClient
  let backendReviewGateway: BackendReviewGateway
  let uri: string
  let collectionName: string

  function generateReviewId() {
    return uniqid('review.')
  }

  function generateNodeId(type: NodeType) {
    return uniqid(type + '.')
  }

  const testReviewId = generateReviewId()
  const testNodeId = generateNodeId('text')
  const testReview: IReview = {
    reviewId: testReviewId,
    author: 'test.author',
    nodeId: testNodeId,
    parentReviewId: null,
    content: 'test.content',
    rating: 5,
    replies: [],
  }

  beforeAll(async () => {
    uri = process.env.DB_URI
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    collectionName = 'e2e-test-reviews'
    backendReviewGateway = new BackendReviewGateway(mongoClient, collectionName)
    await mongoClient.connect()

    const getResponse = await backendReviewGateway.getReviewById(testReview.reviewId)
    expect(getResponse.success).toBeFalsy()
  })

  afterAll(async () => {
    await mongoClient.db().collection(collectionName).drop()
    const getResponse = await backendReviewGateway.getReviewById(testReview.reviewId)
    expect(getResponse.success).toBeFalsy()
    await mongoClient.close()
  })

  test('creates review', async () => {
    const response = await backendReviewGateway.createReview(testReview)
    expect(response.success).toBeTruthy()
  })

  test('retrieves review', async () => {
    const response = await backendReviewGateway.getReviewById(testReview.reviewId)
    expect(response.success).toBeTruthy()
    expect(response.payload.reviewId).toEqual(testReview.reviewId)
    expect(response.payload.content).toEqual(testReview.content)
  })

  // test('updates review', async () => {
  //   const updateResp = await backendReviewGateway.updateReview(testReview.reviewId, {
  //     makeIReviewProperty('content', 'new.content'),
  //   })
  //   expect(updateResp.success).toBeTruthy()
  // })
})
