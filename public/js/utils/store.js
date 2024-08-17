const elements = {

}

const data = {

}

export const setElement = (key, elem) => {
  elements[key] = elem
}

export const getElement = (key) => elements[key]

export const setData = (key, value) => {
  data[key] = value
}

export const getData = (key) => data[key]