import { allReviewFields, ReviewFields } from '.'

export interface IReviewProperty {
  fieldName: ReviewFields
  value: any
}

export function makeIReviewProperty(
  fieldName: ReviewFields,
  newValue: any
): IReviewProperty {
  return {
    fieldName: fieldName,
    value: newValue,
  }
}

export function isIReviewProperty(object: any): boolean {
  const propsDefined: boolean =
    typeof (object as IReviewProperty).fieldName !== 'undefined' &&
    typeof (object as IReviewProperty).value !== 'undefined'
  if (propsDefined && allReviewFields.includes((object as IReviewProperty).fieldName)) {
    switch ((object as IReviewProperty).fieldName) {
      case 'reviewId':
        return typeof (object as IReviewProperty).value === 'string'
      case 'author':
        return typeof (object as IReviewProperty).value === 'string'
      case 'nodeId':
        return typeof (object as IReviewProperty).value === 'string'
      case 'parentReviewId':
        return (
          typeof (object as IReviewProperty).value === 'string' ||
          object.parentReviewId === null
        )
      case 'content':
        return typeof (object as IReviewProperty).value === 'string'
      case 'rating':
        return typeof (object as IReviewProperty).value === 'number'
      default:
        return true
    }
  }
}
