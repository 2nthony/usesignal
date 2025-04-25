import { useBattery } from '.'
import { useSignals } from '../signals'

export default function DemoUseBattery() {
  useSignals()

  const battery = useBattery()

  return (
    <div>
      <p>
        isSupport:
        {battery.isSupported.toString()}
      </p>
      <p>
        charging:
        {battery.charging.toString()}
      </p>
      <p>
        chargingTime:
        {battery.chargingTime.toString()}
      </p>
      <p>
        dischargingTime:
        {battery.dischargingTime.toString()}
      </p>
      <p>
        level:
        {battery.level.toString()}
      </p>
    </div>
  )
}
