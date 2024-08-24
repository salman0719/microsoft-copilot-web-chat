import { postMessageToParent } from "./actions"

const isWindowEmbedded = window.top !== window.self

const subscribers = {
  // key: [callback1, callback2]
  // 'isClosed': [() => {}, () => {}]
}

const elements = {

}

let callbacksPending = []

const processCallbacks = () => {
  const callbackMap = new Map()

  callbacksPending.forEach((callback) => {
    if (!callbackMap.has(callback)) {
      callbackMap.set(callback, 1)
      callback()
    }
  })

  callbacksPending = callbacksPending.filter((callback) =>
    !(callbackMap.has(callback))
  )
}

const data = {

}

export const setElement = (key, elem) => {
  elements[key] = elem
}

export const getElement = (key) => elements[key]

export const setData = (key, value) => {
  const oldValue = data[key]
  if (oldValue !== value) {
    data[key] = value

    subscribers[key]?.forEach((callback) => {
      callbacksPending.push(callback)
    })

    if (__IS_EMBED_CHILD__) {
      pushSetData(key, value)
    }

    setTimeout(processCallbacks)
  }
}

export const getData = (key) => data[key]

export const subscribe = (keys, callback) => {
  const symbol = Symbol()
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

export const pushSetData = (key, value) => {
  if (!isWindowEmbedded) { return }

  if (!['string', 'number', 'boolean'].includes(typeof value)) {
    return
  }

  const data = {
    key,
    value,
    type: 'setData'
  };

  postMessageToParent(data)
}