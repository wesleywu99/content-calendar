import type { PlatformClient } from './index'

export const mockPlatform: PlatformClient = {
  async triggerFlow() {
    return { ok: true, runRef: `mock_${Math.floor(Math.random() * 1e6)}` }
  },
}
