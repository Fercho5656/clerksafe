import { atom, map } from 'nanostores'

export interface ShareFile {
  fileId: string
  fileName: string
}
export const $shareModal = atom(false)
export const $shareFile = map<ShareFile>({
  fileId: '',
  fileName: '',
})
