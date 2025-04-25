import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'
import { useSignal } from '../signals'
import { useEventListener } from '../use-event-listener'
import { useSupported } from '../use-supported'
import { useWatch } from '../use-watch'

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

  const battery = useSignal<BatteryManager | null>(null)

  function updateBatteryInfo(this: BatteryManager) {
    charging.value = this.charging
    chargingTime.value = this.chargingTime || 0
    dischargingTime.value = this.dischargingTime || 0
    level.value = this.level
  }

  useWatch(isSupported, (val) => {
    if (val) {
      (navigator as NavigatorWithBattery)
        .getBattery()
        .then((_battery) => {
          battery.value = _battery
          updateBatteryInfo.call(_battery)
        })
    }
  }, { once: true })

  useEventListener(battery, events, updateBatteryInfo, { passive: true })

  return {
    isSupported,
    charging,
    chargingTime,
    dischargingTime,
    level,
  }
}

export type UseBatteryReturn = ReturnType<typeof useBattery>
