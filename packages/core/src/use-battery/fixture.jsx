import { useBattery } from '.'
import { useSignals } from '../signals'

export default function DemoUseBattery() {
  useSignals()

  const battery = useBattery()

  return (
    <div>
      <p>
        {JSON.stringify(battery, null, 2)}
      </p>
    </div>
  )
}
