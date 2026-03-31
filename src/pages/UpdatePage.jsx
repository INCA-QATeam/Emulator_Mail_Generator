import { useState, useEffect } from 'react'
import { EMULATOR_ORDER } from '../constants'
import { updateVersions } from '../github'

function parseVersionsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const versions = {}
  EMULATOR_ORDER.forEach(name => {
    const v = params.get(name)
    if (v) versions[name] = { name, version: v }
  })
  return versions
}

export default function UpdatePage() {
  const [newVersions] = useState(parseVersionsFromUrl)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const hasVersions = Object.keys(newVersions).length > 0

  const handleUpdate = async () => {
    setStatus('loading')
    try {
      await updateVersions(newVersions)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 py-10"
      style={{
        backgroundImage: 'linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}>
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-accent/20">✅</div>
          <h1 className="text-xl font-bold tracking-tight mb-1.5">버전 최신화</h1>
          <p className="text-xs text-text-muted font-mono">emulator_versions.json 업데이트</p>
        </div>

        {/* 카드 */}
        <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border-dark flex items-center gap-2">
            <span className="text-sm">📋</span>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">업데이트할 버전 목록</span>
          </div>

          {/* 버전 리스트 */}
          {!hasVersions ? (
            <div className="px-6 py-10 text-center text-text-muted text-sm font-mono">
              URL에 버전 정보가 없어요.<br />
              <span className="text-xs opacity-60">main.py에서 생성된 링크를 사용해주세요.</span>
            </div>
          ) : (
            <div>
              {EMULATOR_ORDER.filter(name => newVersions[name]).map(name => (
                <div key={name} className="flex items-center px-6 py-3.5 border-b border-border-dark last:border-0 hover:bg-white/[0.02] transition-colors">
                  <span className="text-sm mr-3">⬆️</span>
                  <span className="text-sm font-medium flex-1">{name}</span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-green-emu/10 text-green-emu border border-green-emu/25">
                    {newVersions[name].version}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 로딩 */}
          {status === 'loading' && (
            <div className="px-6 py-4 border-t border-border-dark flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-border-dark border-t-accent rounded-full animate-spin shrink-0" />
              <span className="text-xs font-mono text-text-muted">GitHub에 업데이트 중...</span>
            </div>
          )}

          {/* 결과 */}
          {(status === 'success' || status === 'error') && (
            <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
              <span className="text-5xl">{status === 'success' ? '✅' : '❌'}</span>
              <span className="text-base font-bold">{status === 'success' ? '최신화 완료!' : '업데이트 실패'}</span>
              <span className="text-xs text-text-muted font-mono">
                {status === 'success' ? 'emulator_versions.json이 업데이트 됐어요' : errorMsg}
              </span>
            </div>
          )}

          {/* 액션 버튼 */}
          {status === 'idle' && (
            <div className="px-6 py-5 border-t border-border-dark flex flex-col gap-3">
              <button
                onClick={handleUpdate}
                disabled={!hasVersions}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-green-emu to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-green-emu/20 hover:-translate-y-0.5 hover:shadow-green-emu/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all">
                <span>✅</span> 최신화 완료 확인
              </button>
              <button
                onClick={() => window.close()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface2 border border-border-dark text-text-muted text-sm font-semibold hover:border-red-emu hover:text-red-emu transition-all">
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
