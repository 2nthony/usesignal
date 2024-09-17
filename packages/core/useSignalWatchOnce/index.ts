import { useSignalWatch } from '../useSignalWatch'

export function useSignalWatchOnce(
  v: Parameters<typeof useSignalWatch>[0],
  cb: Parameters<typeof useSignalWatch>[1],
  options?: Parameters<typeof useSignalWatch>[2],
) {
  let changed = false

  const stop = useSignalWatch(v, (val, prevValue) => {
    cb(val, prevValue)

    changed = true
    if (changed) {
      stop()
    }
  }, options)
}
