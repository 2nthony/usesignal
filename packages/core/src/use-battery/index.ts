import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'
import { useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'
import { useSupported } from '../use-supported'

export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>
}

/**
 * Reactive Battery Status API.
 *
 * @see https://vueuse.org/useBattery
 */
export function useBattery(options: ConfigurableNavigator = {}) {
  const { navigator = defaultNavigator } = options
  const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']

  const isSupported = useSupported(() => navigator && 'getBattery' in navigator && typeof navigator.getBattery === 'function')

  const charging = useSignal(false)
  const chargingTime = useSignal(0)
  const dischargingTime = useSignal(0)
  const level = useSignal(1)

  let battery: BatteryManager | null = null

  function updateBatteryInfo(batteryManager: BatteryManager) {
    charging.value = batteryManager.charging
    chargingTime.value = batteryManager.chargingTime || 0
    dischargingTime.value = batteryManager.dischargingTime || 0
    level.value = batteryManager.level
  }

  useEventListener(
    () => isSupported.value ? battery : null,
    events,
    () => {
      (navigator as NavigatorWithBattery)
        .getBattery()
        .then((_battery) => {
          battery = _battery
          updateBatteryInfo(battery)
        })
    },
    { passive: true },
  )

  return {
    isSupported,
    charging,
    chargingTime,
    dischargingTime,
    level,
  }
}

export type UseBatteryReturn = ReturnType<typeof useBattery>
