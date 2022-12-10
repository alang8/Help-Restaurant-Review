/** A comment for a restaurant node. */
export interface IReview {
  reviewId: string
  author: string
  nodeId: string
  parentReviewId: string | null
  content: string
  rating: number
  replies: string[]
  dateCreated?: Date
  dateModified?: Date
}

export type ReviewFields = keyof IReview

export const allReviewFields: string[] = [
  'reviewId',
  'author',
  'nodeId',
  'parentReviewId',
  'content',
  'rating',
  'replies',
  'dateCreated',
  'dateModified',
]

export function isIReview(object: any): object is IReview {
  return (
    typeof (object as IReview).reviewId === 'string' &&
    typeof (object as IReview).author === 'string' &&
    (typeof (object as IReview).parentReviewId === 'string' ||
      object.parentReviewId === null) &&
    typeof (object as IReview).content === 'string' &&
    typeof (object as IReview).rating === 'number'
  )
}

export function makeIReview(
  reviewId: string,
  author: string,
  nodeId: string,
  parentReviewId: string,
  content: string,
  rating: number,
  replies: string[],
  dateCreated: Date,
  dateModified: Date
): IReview {
  return {
    reviewId: reviewId,
    author: author,
    nodeId: nodeId,
    parentReviewId: parentReviewId,
    content: content ?? '',
    rating: rating,
    replies: replies ?? [],
    dateCreated: dateCreated ?? new Date(),
    dateModified: dateModified ?? new Date(),
  }
}

export function isSameReview(r1: IReview, r2: IReview): boolean {
  return (
    r1.reviewId === r2.reviewId &&
    r1.author === r2.author &&
    r1.nodeId === r2.nodeId &&
    r1.parentReviewId === r2.parentReviewId &&
    r1.content === r2.content &&
    r1.rating === r2.rating &&
    r1.replies === r2.replies
  )
}
