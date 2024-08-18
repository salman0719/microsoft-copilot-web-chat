const subscribers = {
  // key: [[Symbol1, callback1], [Symbol2, callback2]]
  // 'isClosed': [[Symbol(), () => {}], [Symbol(), () => {}]]
}

const elements = {

}

let callbacksPending = []

const processCallbacks = () => {
  const callbackMap = new Map()

  const toBeCalled = callbacksPending.filter((callback) => {
    if (!callbackMap.has(callback)) {
      callbackMap.set(callback, 1)
      callback()
      return callback
    }

    return false
  })

  callbacksPending = callbacksPending.filter((callback) =>
    !(toBeCalled.includes(callback))
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

    subscribers[key]?.forEach(([_, callback]) => {
      callbacksPending.push(callback)
    })

    setTimeout(processCallbacks)
  }
}

export const getData = (key) => data[key]

export const subscribe = (keys, callback) => {
  const symbol = Symbol()
  for (let key of keys) {
    if (!(key in subscribers)) { subscribers[key] = [] }
    subscribers[key].push([symbol, callback])
  }

  return () => {
    for (let subscriberKey in subscribers) {
      subscribers[subscriberKey] = subscribers[subscriberKey]
        .filter((id) => (symbol === id))
    }
  }
}