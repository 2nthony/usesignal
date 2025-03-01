import { useDateFormat } from '.'
import { useSignal, useSignals } from '../signals'
import { useNow } from '../use-now'

export default function DemoUseDateFormat() {
  useSignals()
  const formatter = useSignal('dddd YYYY-MM-DD HH:mm:ss')
  const lang = useSignal('en-US')
  const formatted = useDateFormat(useNow(), formatter, { locales: lang })

  return (
    <div>
      <p>
        { formatted }
      </p>

      <div>
        <div>Formatter editor:</div>
        <div>
          <input
            style={{ width: 300 }}
            type="text"
            value={formatter}
            onChange={(e) => {
              formatter.value = e.target.value
            }}
          />
        </div>

        <div>
          <label>
            <input
              onChange={(e) => {
                lang.value = e.target.value
              }}
              value="en-US"
              checked={lang.value === 'en-US'}
              type="radio"
            />
            <span>English (US)</span>
          </label>
          <label>
            <input
              onChange={(e) => {
                lang.value = e.target.value
              }}
              value="fr"
              checked={lang.value === 'fr'}
              type="radio"
            />
            <span>French</span>
          </label>
          <label>
            <input
              onChange={(e) => {
                lang.value = e.target.value
              }}
              value="de"
              checked={lang.value === 'de'}
              type="radio"
            />
            <span>German</span>
          </label>
        </div>
      </div>
    </div>
  )
}
