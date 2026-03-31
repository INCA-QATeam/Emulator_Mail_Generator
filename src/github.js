import { GITHUB_REPO, GITHUB_TOKEN, JSON_PATH, BRANCH } from './constants'

const BASE = 'https://api.github.com'
const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
}

export async function fetchVersions() {
  const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}/${JSON_PATH}?t=${Date.now()}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`버전 파일 로드 실패: ${resp.status}`)
  return resp.json()
}

export async function updateVersions(newVersions) {
  // 1. 현재 파일 SHA 조회
  const getResp = await fetch(
    `${BASE}/repos/${GITHUB_REPO}/contents/${JSON_PATH}?ref=${BRANCH}`,
    { headers: HEADERS }
  )
  if (!getResp.ok) throw new Error(`파일 조회 실패: ${getResp.status}`)
  const fileData = await getResp.json()

  // 2. PUT으로 업데이트
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(newVersions, null, 2))))
  const putResp = await fetch(
    `${BASE}/repos/${GITHUB_REPO}/contents/${JSON_PATH}`,
    {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({
        message: `auto: update emulator versions [${new Date().toISOString().slice(0, 10)}]`,
        content,
        sha: fileData.sha,
        branch: BRANCH,
      }),
    }
  )
  if (!putResp.ok) {
    const err = await putResp.json()
    throw new Error(err.message || `업데이트 실패: ${putResp.status}`)
  }
  return true
}
