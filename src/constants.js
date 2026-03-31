export const EMULATOR_ORDER = ['NoxPlayer', 'MEmu', 'LDPlayer9', 'BlueStacks5', 'MuMuPlayer']

export const EMULATORS = [
  { id: 'bluestacks5_rooted', name: 'BlueStacks 5 64bit (루팅)', android: '9.0',  versionKey: 'BlueStacks5' },
  { id: 'bluestacks5',        name: 'BlueStacks 5 64bit',        android: '11.0', versionKey: 'BlueStacks5' },
  { id: 'nox_rooted',         name: 'NOX 64bit (루팅)',           android: '9.0',  versionKey: 'NoxPlayer'  },
  { id: 'nox',                name: 'NOX 64bit',                 android: '12.0', versionKey: 'NoxPlayer'  },
  { id: 'ldplayer',           name: 'LDPlayer 64bit',            android: '9.0',  versionKey: 'LDPlayer9'  },
  { id: 'memu_rooted',        name: 'MEmu 64bit (루팅)',          android: '9.0',  versionKey: 'MEmu'       },
  { id: 'memu',               name: 'MEmu 64bit',                android: '12.0', versionKey: 'MEmu'       },
  { id: 'mumu',               name: 'MuMuPlayer 64bit',          android: '12.0', versionKey: 'MuMuPlayer' },
]

export const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO
export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
export const JSON_PATH = 'emulator_versions.json'
export const BRANCH = 'main'
