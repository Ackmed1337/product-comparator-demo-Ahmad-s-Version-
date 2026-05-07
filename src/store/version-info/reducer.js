import {
  LOAD_VERSION_INFO,
  SAVE_VERSION_INFO,
  SET_VERSIONS_EDITABLE,
  SET_VERSIONS_READ_ONLY
} from './actions'

const DEFAULT_XV = '999'
const DEFAULT_XMINV = '1'

export default function versionInfo(state={vHeaders: {xV: DEFAULT_XV, xMinV: DEFAULT_XMINV}}, action) {
  switch (action.type) {
    case LOAD_VERSION_INFO:
      return {
        vHeaders: {
          xV: DEFAULT_XV,
          xMinV: window.localStorage.getItem('x-min-v') || DEFAULT_XMINV
        }
      }
    case SAVE_VERSION_INFO:
      const vi = action.versionInfo
      window.localStorage.setItem('x-min-v', vi.xMinV)
      return {vHeaders: vi}
    case SET_VERSIONS_EDITABLE:
      return {editable: true, vHeaders: state.vHeaders}
    case SET_VERSIONS_READ_ONLY:
      return {vHeaders: state.vHeaders}
    default:
      return state
  }
}
