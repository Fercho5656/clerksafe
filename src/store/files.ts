import { atom, map } from 'nanostores'
import type { File } from '@/models/file'

export const $newFile = map<File[]>([])
export const $uploadFileModal = atom(false)
