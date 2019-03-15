import R from 'ramda'

const create = text => {
  const newText = text || ''
  if (typeof newText !== 'string') {
    throw new Error('Invalid BlockText detected')
  }
  return newText
}

const removeRange = R.curry(
  ([start, end], text) =>
    text
      .substring(0, start)
      .concat(text.substring(end))
)

const copyRange = R.curry(([start, end], text) =>
  text.substring(start, end)
)

const insertAfterRange = R.curry(
  (newText, [start, end], text) =>
    text
      .substring(0, end)
      .concat(newText, text.substring(end))
)

const append = R.curry((textB, textA) =>
  textA.concat(textB)
)

const prepend = R.flip(append)

const getLength = R.prop('length')

const isEmpty = text => getLength(text) === 0

const fromJS = create

export default {
  create,
  removeRange,
  copyRange,
  insertAfterRange,
  append,
  prepend,
  getLength,
  isEmpty,
  fromJS
}
