import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ILink } from '../../../types'

export async function http<T>(request: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axios(request)
  return response.data
}

export interface ICompleteLinkModalAttributes {
  /** If null, add node as a root */
  anchor1Id: string
  anchor2Id: string
  explainer: string
  title: string
}

/** Create a new node based on the inputted attributes in the modal */
export async function completestartAnchorModal(
  attributes: ICompleteLinkModalAttributes
): Promise<ILink | null> {
  return null
}
