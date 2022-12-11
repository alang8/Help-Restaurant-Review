import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { BackendReviewGateway } from '../../../../reviews'
import { IReview, makeIReview } from '../../../../types'

describe('Unit Test: Delete All', () => {
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

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('successfully deletes all root reviews', async () => {
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
    const response1 = await backendReviewGateway.createReview(validReview1)
    expect(response1.success).toBeTruthy()

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
    const response2 = await backendReviewGateway.createReview(validReview2)
    expect(response2.success).toBeTruthy()

    const validReview3: IReview = makeIReview(
      'review3',
      'author3',
      'node3',
      'review2',
      'content3',
      3,
      ['reply3'],
      new Date(),
      new Date()
    )
    const response3 = await backendReviewGateway.createReview(validReview3)
    expect(response3.success).toBeTruthy()

    const deleteAllResp = await backendReviewGateway.deleteAll()
    expect(deleteAllResp.success).toBeTruthy()

    const findReview1Resp = await backendReviewGateway.getReviewById('review1')
    expect(findReview1Resp.success).toBeFalsy()
    const findReview2Resp = await backendReviewGateway.getReviewById('review2')
    expect(findReview2Resp.success).toBeFalsy()
    const findReview3Resp = await backendReviewGateway.getReviewById('review3')
    expect(findReview3Resp.success).toBeFalsy()
  })

  test('successfully deletes all nested reviews', async () => {
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
    const response1 = await backendReviewGateway.createReview(validReview1)
    expect(response1.success).toBeTruthy()

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
    const response2 = await backendReviewGateway.createReview(validReview2)
    expect(response2.success).toBeTruthy()

    const validReview3: IReview = makeIReview(
      'review3',
      'author3',
      'node3',
      'review2',
      'content3',
      3,
      ['reply3'],
      new Date(),
      new Date()
    )
    const response3 = await backendReviewGateway.createReview(validReview3)
    expect(response3.success).toBeTruthy()

    const deleteAllResp = await backendReviewGateway.deleteAll()
    expect(deleteAllResp.success).toBeTruthy()

    const findReview1Resp = await backendReviewGateway.getReviewById('review1')
    expect(findReview1Resp.success).toBeFalsy()
    const findReview2Resp = await backendReviewGateway.getReviewById('review2')
    expect(findReview2Resp.success).toBeFalsy()
    const findReview3Resp = await backendReviewGateway.getReviewById('review3')
    expect(findReview3Resp.success).toBeFalsy()
  })

  test('successfully deletes nested and root reviews', async () => {
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
    const response1 = await backendReviewGateway.createReview(validReview1)
    expect(response1.success).toBeTruthy()

    const validReview2: IReview = makeIReview(
      'review2',
      'author2',
      'node2',
      null,
      'content2',
      2,
      ['reply2'],
      new Date(),
      new Date()
    )
    const response2 = await backendReviewGateway.createReview(validReview2)
    expect(response2.success).toBeTruthy()

    const validReview3: IReview = makeIReview(
      'review3',
      'author3',
      'node3',
      null,
      'content3',
      3,
      ['reply3'],
      new Date(),
      new Date()
    )
    const response3 = await backendReviewGateway.createReview(validReview3)
    expect(response3.success).toBeTruthy()

    const deleteAllResp = await backendReviewGateway.deleteAll()
    expect(deleteAllResp.success).toBeTruthy()

    const findReview1Resp = await backendReviewGateway.getReviewById('review1')
    expect(findReview1Resp.success).toBeFalsy()
    const findReview2Resp = await backendReviewGateway.getReviewById('review2')
    expect(findReview2Resp.success).toBeFalsy()
    const findReview3Resp = await backendReviewGateway.getReviewById('review3')
    expect(findReview3Resp.success).toBeFalsy()
  })
})
