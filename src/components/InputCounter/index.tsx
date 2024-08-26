import { FunctionalComponent } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { getData, subscribe } from "../../utils/store"
import { INPUT_CHAR_LIMIT } from "../../utils/constants"

const InputCounter: FunctionalComponent = () => {
  const [value, setValue] = useState<string>(() => (getData('sendBoxValue') || '') as string)
  const [hasError, setHasError] = useState<boolean>(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      const parent = container.parentNode
      parent && parent.insertBefore(container, parent.lastElementChild)
    }

    const unlistenArr = [
      subscribe(['sendBoxValue'], (value: string) => {
        setValue(value)
      }),
      subscribe(['charLimitExceeded'], (hasError: boolean) => {
        setHasError(hasError)
      })
    ]

    return () => {
      unlistenArr.forEach((unlisten) => { unlisten() })
    }
  }, [])

  return (
    <span
      ref={containerRef}
      className={'webchat__send-box-text-box-counter' +
        (hasError ? ' webchat__send-box-text-box-counter--error' : '')
      }>
      {value.length} / {INPUT_CHAR_LIMIT}
    </span>
  )
}

export default InputCounter