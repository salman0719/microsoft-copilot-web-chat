import { postMessageToParent } from "./actions.ts"

const isWindowEmbedded = window.top !== window.self

const data: Record<string, unknown> = {}
const subscribers: Record<string, Function[]> = {}
const elements: Record<string, Element> = {}
let callbacksPending: [Function, unknown, unknown][] = []

const processCallbacks = () => {
  const callbackMap = new Map<Function, 1>()

  callbacksPending.forEach(([callback, value, oldValue]) => {
    if (!callbackMap.has(callback)) {
      callbackMap.set(callback, 1)
      callback(value, oldValue)
    }
  })

  callbacksPending = callbacksPending.filter(([callback]) =>
    !(callbackMap.has(callback))
  )
}

export const setElement = (key: string, elem: Element) => {
  elements[key] = elem
}

export const getElement = (key: string): Element | undefined => elements[key]

export const setData = (key: string, value: unknown) => {
  const oldValue = data[key]
  if (oldValue !== value) {
    data[key] = value

    subscribers[key]?.forEach((callback) => {
      callbacksPending.push([callback, value, oldValue])
    })

    // @ts-expect-error
    if (__IS_EMBED_CHILD__) {
      pushSetData(key, value, oldValue)
    }

    setTimeout(processCallbacks)
  }
}

export const getData = (key: string) => data[key]

export const subscribe = (keys: string[], callback: Function) => {
  for (let key of keys) {
    if (!(key in subscribers)) { subscribers[key] = [] }
    subscribers[key].push(callback)
  }

  return () => {
    for (let subscriberKey in subscribers) {
      subscribers[subscriberKey] = subscribers[subscriberKey]
        .filter((fn) => (callback !== fn))
    }
  }
}

export const pushSetData = (key: string, value: unknown, oldValue: unknown) => {
  if (!isWindowEmbedded) { return }

  if (!['string', 'number', 'boolean'].includes(typeof value)) {
    return
  }

  const data = {
    key,
    oldValue,
    value,
    type: 'setData'
  };

  postMessageToParent(data)
}