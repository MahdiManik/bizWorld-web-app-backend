import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RNFile = { uri: string; name: string; type: string }

/* get JWT if not passed in */
const getToken = async (explicit?: string) =>
  explicit ?? (await AsyncStorage.getItem('authToken'))

/* convert {uri,name,type} to File for web  */
const uriToFile = async (f: RNFile): Promise<File> => {
  const blob = await fetch(f.uri).then((r) => r.blob())
  return new File([blob], f.name, { type: f.type })
}

export async function uploadFileToStrapi(
  file: File | RNFile,
  field = 'files',
  folder?: string,
  tokenExplicit?: string
) {
  /* ---------- build FormData ---------- */
  const fd = new FormData()

  if (Platform.OS === 'web') {
    const fileObj =
      typeof File !== 'undefined' && file instanceof File
        ? file
        : await uriToFile(file as RNFile)
    fd.append(field, fileObj)
  } else {
    const f = file as RNFile
    fd.append(field, {
      uri: f.uri,
      name: f.name,
      type: f.type,
    } as any)
  }

  if (folder) fd.append('path', folder)

  /* ---------- log what we’re sending ---------- */
  // @ts-ignore
  console.log('🧾 FormData:', (fd as any)._parts ?? fd)

  /* ---------- do the request with fetch ---------- */
  const base = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:1337'

  const res = await fetch(`${base}/api/upload`, {
    method: 'POST',
    headers: (await getToken(tokenExplicit))
      ? { Authorization: `Bearer ${await getToken(tokenExplicit)}` }
      : undefined,
    body: fd, // fetch sets multipart boundary automatically
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Upload failed ${res.status}: ${txt}`)
  }

  const arr = (await res.json()) as any[] // Strapi returns an array
  return arr[0] // first (and only) uploaded file
}

/* helpers stay unchanged */
export const getFileId = (f: any) => f?.id ?? 0
export const attachFileToEntity = (e: any, k: string, id: number) =>
  id ? { ...e, [k]: id } : e
export const attachFilesToEntity = (e: any, k: string, ids: number[]) =>
  ids?.length ? { ...e, [k]: ids } : e
