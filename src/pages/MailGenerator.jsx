import { useState, useEffect, useCallback } from 'react'
import { EMULATORS, EMULATOR_ORDER } from '../constants'

const DEFAULT_GAMES = [
  { name: 'xGame', version: '1.25.2.7' },
  { name: 'HeirofLight', version: '1.25.2.4' },
]

function parseQueryParams() {
  const params = new URLSearchParams(window.location.search)
  const versionData = {}
  EMULATORS.forEach(emu => {
    const prev = params.get(`${emu.versionKey}_prev`)
    const latest = params.get(`${emu.versionKey}_latest`)
    if (prev || latest) {
      versionData[emu.versionKey] = { prev: prev || '', latest: latest || '' }
    }
  })
  return versionData
}

function getToday() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return yy + mm + dd
}

function getVersionInfo(versionData, versionKey) {
  const data = versionData[versionKey] || {}
  const hasUpdate = data.prev && data.latest && data.prev !== data.latest
  let prevVersion = '', latestVersion = '-'
  if (hasUpdate) { prevVersion = data.prev; latestVersion = data.latest }
  else if (data.latest) prevVersion = data.latest
  else if (data.prev) prevVersion = data.prev
  return { hasUpdate, prevVersion, latestVersion }
}

export default function MailGenerator() {
  const [testDate, setTestDate] = useState(getToday())
  const [games, setGames] = useState(DEFAULT_GAMES)
  const [results, setResults] = useState({})
  const [notes, setNotes] = useState('')
  const [versionData] = useState(parseQueryParams)
  const [preview, setPreview] = useState('')
  const [toast, setToast] = useState(null)

  const updateCount = EMULATOR_ORDER.filter(name => {
    const emu = EMULATORS.find(e => e.versionKey === name)
    if (!emu) return false
    const { hasUpdate } = getVersionInfo(versionData, name)
    return hasUpdate
  }).length

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const setResult = (emuId, gameIdx, value) => {
    setResults(prev => ({ ...prev, [`${emuId}_${gameIdx}`]: value }))
  }

  const generateHTML = useCallback(() => {
    const colW = { name: 183.5, android: 110.18, prev: 256.81, latest: 183.5, game: 183.5 }
    const totalW = colW.name + colW.android + colW.prev + colW.latest + games.length * colW.game
    const cell = `direction:ltr;text-align:center;border:1px solid rgb(171,171,171);vertical-align:middle;box-sizing:border-box;`
    const div = `direction:ltr;text-align:center;margin:0;font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;color:rgb(0,0,0);`
    const hl = `background-color:rgb(255,255,0);`

    let html = `<div style="direction:ltr;text-align:left;margin:0;font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;color:rgb(0,0,0);">안녕하세요 글로벌사업부 QA팀 정가연입니다.</div>
<div style="direction:ltr;text-align:left;margin:0;font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;color:rgb(0,0,0);"><br>${testDate} 날짜 기준 최신 테스트 에뮬레이터 환경 및 결과 공유드립니다.</div>
<div style="font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;"><br></div>`

    html += `<table style="direction:ltr;border-collapse:collapse;width:${totalW}px;"><tbody><tr>`
    ;[
      { label: '제품명', w: colW.name, bg: 'rgb(204,204,204)' },
      { label: 'Android 버전', w: colW.android, bg: 'rgb(204,204,204)' },
      { label: '이전 버전', w: colW.prev, bg: 'rgb(204,204,204)' },
      { label: '최신 버전', w: colW.latest, bg: 'rgb(204,204,204)' },
    ].forEach(h => {
      html += `<td style="${cell}background:${h.bg};width:${h.w}px;min-width:${h.w}px;max-width:${h.w}px;height:32.24px;"><div style="${div}">${h.label}</div></td>`
    })
    games.forEach(g => {
      html += `<td style="${cell}background:rgb(245,212,39);width:${colW.game}px;min-width:${colW.game}px;max-width:${colW.game}px;height:32.24px;"><div style="${div}">${g.name}[${g.version}]</div></td>`
    })
    html += `</tr>`

    EMULATORS.forEach(emu => {
      const { hasUpdate, prevVersion, latestVersion } = getVersionInfo(versionData, emu.versionKey)
      html += `<tr>`
      html += `<td style="${cell}width:${colW.name}px;min-width:${colW.name}px;max-width:${colW.name}px;height:27.46px;"><div style="${div}">${hasUpdate ? `<span style="${hl}">${emu.name}</span>` : emu.name}</div></td>`
      html += `<td style="${cell}width:${colW.android}px;min-width:${colW.android}px;max-width:${colW.android}px;height:27.46px;"><div style="${div}">${emu.android}</div></td>`
      html += `<td style="${cell}width:${colW.prev}px;min-width:${colW.prev}px;max-width:${colW.prev}px;height:27.46px;"><div style="${div}">${hasUpdate ? `<span style="${hl}">${prevVersion}</span>` : prevVersion}</div></td>`
      html += `<td style="${cell}width:${colW.latest}px;min-width:${colW.latest}px;max-width:${colW.latest}px;height:27.46px;"><div style="${div}">${hasUpdate ? `<span style="${hl}">${latestVersion}</span>` : latestVersion}</div></td>`
      games.forEach((g, gi) => {
        const result = results[`${emu.id}_${gi}`] || 'N/T'
        let style = 'color:rgb(0,0,0);', text = result
        if (result === 'PASS') { style = 'color:rgb(12,100,192);'; text = '<b>PASS</b>' }
        else if (result === 'FAIL') { style = 'color:rgb(200,38,19);'; text = '<b>FAIL</b>' }
        html += `<td style="${cell}width:${colW.game}px;min-width:${colW.game}px;max-width:${colW.game}px;height:27.46px;"><div style="${div}${style}">${text}</div></td>`
      })
      html += `</tr>`
    })
    html += `</tbody></table>`

    if (notes.trim()) {
      html += `<div style="font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;"><br></div><ul style="direction:ltr;margin:0;" data-editing-info="{&quot;applyListStyleFromLevel&quot;:false,&quot;unorderedStyleType&quot;:5}">`
      let inItem = false
      notes.split('\n').filter(l => l.trim()).forEach(line => {
        const t = line.trim()
        const isUrl = t.startsWith('http://') || t.startsWith('https://')
        if (isUrl && inItem) {
          html += `<div style="direction:ltr;margin:0;" role="presentation"><a href="${t}">${t}</a></div></li>`
          inItem = false
        } else if (!isUrl) {
          if (inItem) html += `</li>`
          html += `<li style="font-family:Aptos,Calibri,Helvetica,sans-serif;font-size:12pt;color:rgb(0,0,0);direction:ltr;list-style-type:'➔ ';"><div style="direction:ltr;margin:0;" role="presentation">${t.replace(/^➔\s*/, '')}</div>`
          inItem = true
        }
      })
      if (inItem) html += `</li>`
      html += `</ul>`
    }
    return html
  }, [testDate, games, results, notes, versionData])

  const handlePreview = () => setPreview(generateHTML())

  const handleCopy = async () => {
    const html = generateHTML()
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })])
      showToast('HTML 복사 완료! Outlook에서 Ctrl+V')
    } catch {
      await navigator.clipboard.writeText(html)
      showToast('HTML 코드 복사 완료')
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-16">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-dark px-10 py-5 flex items-center gap-4 backdrop-blur">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-lg shadow-lg shadow-accent/20 shrink-0">📧</div>
        <div>
          <div className="text-base font-bold tracking-tight">QA 에뮬레이터 테스트 메일 생성기</div>
          <div className="text-xs text-text-muted font-mono mt-0.5">Emulator Mail Generator · inca QA Team</div>
        </div>
      </header>

      <div className="max-w-[1300px] mx-auto px-10 pt-8 grid grid-cols-[280px_1fr] gap-6 items-start">
        {/* 사이드바 */}
        <aside className="flex flex-col gap-4 sticky top-24">
          {/* 날짜 */}
          <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-dark flex items-center gap-2">
              <span className="text-sm">📅</span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">테스트 날짜</span>
            </div>
            <div className="p-5">
              <div className="text-[11px] text-text-muted font-mono mb-2">DATE (YYMMDD)</div>
              <input
                className="w-full bg-surface2 border border-border-dark rounded-lg px-3 py-2 text-sm font-mono font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                value={testDate}
                onChange={e => setTestDate(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          {/* 게임 */}
          <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-dark flex items-center gap-2">
              <span className="text-sm">🎮</span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">테스트 게임</span>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-2 mb-3">
                {games.map((game, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface2 border border-border-dark rounded-lg px-3 py-2 hover:border-border-bright transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-emu shrink-0" />
                    <input className="bg-transparent flex-1 text-sm font-medium focus:outline-none min-w-0" value={game.name}
                      onChange={e => setGames(g => g.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <input className="bg-transparent w-16 text-xs font-mono text-text-muted text-right focus:outline-none" value={game.version}
                      onChange={e => setGames(g => g.map((x, j) => j === i ? { ...x, version: e.target.value } : x))} />
                    <button onClick={() => games.length > 1 && setGames(g => g.filter((_, j) => j !== i))}
                      className="text-text-muted hover:text-red-emu text-base leading-none transition-colors">×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setGames(g => [...g, { name: '새게임', version: '1.0.0' }])}
                className="w-full flex items-center gap-2 border border-dashed border-border-dark rounded-lg px-3 py-2 text-xs text-text-muted hover:border-accent hover:text-accent transition-all">
                <span>＋</span><span>게임 추가</span>
              </button>
            </div>
          </div>

          {/* 비고 */}
          <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-dark flex items-center gap-2">
              <span className="text-sm">📝</span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">비고</span>
            </div>
            <div className="p-5">
              <textarea className="w-full bg-surface2 border border-border-dark rounded-lg px-3 py-2.5 text-xs font-mono leading-relaxed min-h-[110px] resize-y focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="➔ 내용을 입력하세요&#10;https://example.com" value={notes} onChange={e => setNotes(e.target.value)} />
              <p className="text-[10px] text-text-muted font-mono mt-2">* 줄바꿈으로 구분 · URL 자동 링크 변환</p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-2.5">
            <button onClick={handlePreview}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-accent/40 transition-all">
              <span>👁</span> 미리보기 생성
            </button>
            <button onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface2 border border-border-dark text-text-dim text-sm font-semibold hover:border-green-emu hover:text-green-emu transition-all">
              <span>📋</span> HTML 복사
            </button>
          </div>
        </aside>

        {/* 메인 */}
        <div className="flex flex-col gap-6">
          {/* 테이블 */}
          <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">📊</span>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">테스트 결과 입력</span>
              </div>
              {updateCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-yellow-emu/10 text-yellow-emu text-[11px] font-mono px-2.5 py-1 rounded-full border border-yellow-emu/25">
                  ⬆ {updateCount}개 업데이트
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[700px]">
                <thead>
                  <tr>
                    <th className="bg-surface2 text-text-muted text-[10px] font-semibold tracking-widest uppercase px-5 py-3 text-left border-b border-border-dark">제품명</th>
                    <th className="bg-surface2 text-text-muted text-[10px] font-semibold tracking-widest uppercase px-4 py-3 text-center border-b border-border-dark">Android</th>
                    <th className="bg-surface2 text-text-muted text-[10px] font-semibold tracking-widest uppercase px-4 py-3 text-center border-b border-border-dark">이전 버전</th>
                    <th className="bg-surface2 text-text-muted text-[10px] font-semibold tracking-widest uppercase px-4 py-3 text-center border-b border-border-dark">최신 버전</th>
                    {games.map((g, i) => (
                      <th key={i} className="bg-surface2 text-yellow-emu text-[10px] font-semibold tracking-widest uppercase px-4 py-3 text-center border-b border-border-dark whitespace-nowrap">
                        {g.name}<br /><span className="opacity-60 font-normal normal-case">{g.version}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMULATORS.map(emu => {
                    const { hasUpdate, prevVersion, latestVersion } = getVersionInfo(versionData, emu.versionKey)
                    return (
                      <tr key={emu.id} className="border-b border-border-dark last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <span className={`text-sm font-medium ${hasUpdate ? 'text-yellow-emu' : ''}`}>{emu.name}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-text-muted">{emu.android}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block font-mono text-[11px] px-2 py-1 rounded-md ${hasUpdate ? 'bg-yellow-emu/10 text-yellow-emu border border-yellow-emu/25' : 'bg-surface2 text-text-dim border border-border-dark'}`}>
                            {prevVersion || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block font-mono text-[11px] px-2 py-1 rounded-md ${hasUpdate ? 'bg-yellow-emu/10 text-yellow-emu border border-yellow-emu/25' : 'bg-surface2 text-text-muted border border-border-dark'}`}>
                            {latestVersion}
                          </span>
                        </td>
                        {games.map((_, gi) => {
                          const val = results[`${emu.id}_${gi}`] || 'N/T'
                          return (
                            <td key={gi} className="px-4 py-3 text-center">
                              <select
                                value={val}
                                onChange={e => setResult(emu.id, gi, e.target.value)}
                                className={`appearance-none rounded-md px-3 py-1.5 text-xs font-mono font-semibold border cursor-pointer focus:outline-none transition-all
                                  ${val === 'PASS' ? 'bg-green-emu/10 text-green-emu border-green-emu/30' :
                                    val === 'FAIL' ? 'bg-red-emu/10 text-red-emu border-red-emu/30' :
                                    'bg-surface2 text-text-muted border-border-dark'}`}>
                                <option value="N/T">N/T</option>
                                <option value="PASS">PASS</option>
                                <option value="FAIL">FAIL</option>
                              </select>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="bg-surface border border-border-dark rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-dark flex items-center gap-2">
              <span className="text-sm">👀</span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">미리보기</span>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-xl p-8 min-h-[160px]">
                {preview
                  ? <div dangerouslySetInnerHTML={{ __html: preview }} />
                  : <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-gray-300">
                      <span className="text-4xl opacity-30">✉</span>
                      <span className="text-sm font-sans">미리보기 버튼을 눌러주세요</span>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-surface border border-border-bright rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm shadow-2xl animate-bounce-in z-50">
          <span>{toast.ok ? '✅' : '❌'}</span>
          <span className="text-text-dim">{toast.msg}</span>
        </div>
      )}
    </div>
  )
}
