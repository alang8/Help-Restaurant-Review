/** A comment for a restaurant node. */
export interface IReview {
  reviewId: string
  author: string
  nodeId: string
  content: string
  rating: number
  replies: string[]
  dateCreated?: Date
  dateUpdated?: Date
}

export function isIReview(object: any): object is IReview {
  return (
    typeof (object as IReview).reviewId === 'string' &&
    typeof (object as IReview).author === 'string' &&
    typeof (object as IReview).nodeId === 'string' &&
    typeof (object as IReview).content === 'string' &&
    typeof (object as IReview).rating === 'number'
  )
}

export function makeIReview(
  reviewId: string,
  author: string,
  nodeId: string,
  content: string,
  rating: number,
  replies: string[],
  dateCreated: Date,
  dateUpdated: Date
): IReview {
  return {
    reviewId: reviewId,
    author: author,
    nodeId: nodeId,
    content: content ?? '',
    rating: rating,
    replies: replies ?? [],
    dateCreated: dateCreated ?? new Date(),
    dateUpdated: dateUpdated ?? new Date(),
  }
}

export function isSameReview(r1: IReview, r2: IReview): boolean {
  return (
    r1.reviewId === r2.reviewId &&
    r1.author === r2.author &&
    r1.nodeId === r2.nodeId &&
    r1.content === r2.content &&
    r1.rating === r2.rating &&
    r1.replies === r2.replies
  )
}
