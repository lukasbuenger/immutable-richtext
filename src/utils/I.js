import { invoker, curry } from 'ramda'
import { is, Seq } from 'immutable'

const has = invoker(1, 'has')
const hasIn = invoker(1, 'hasIn')
const every = invoker(1, 'every')
const keySeq = invoker(0, 'keySeq')
const valueSeq = invoker(0, 'valueSeq')

const get = invoker(1, 'get')
const getIn = invoker(1, 'getIn')
const remove = invoker(1, 'remove')
const removeIn = invoker(1, 'removeIn')
const set = invoker(2, 'set')
const setIn = invoker(2, 'setIn')
const update = invoker(2, 'update')
const updateIn = invoker(2, 'updateIn')
const merge = invoker(1, 'merge')
const last = invoker(0, 'last')
const first = invoker(0, 'first')
const indexOf = invoker(1, 'indexOf')
const push = invoker(1, 'push')
const unshift = invoker(1, 'unshift')
const concat = invoker(1, 'concat')
const reduce = invoker(2, 'reduce')
const map = invoker(1, 'map')
const find = invoker(1, 'find')
const findLast = invoker(1, 'findLast')
const skip = invoker(1, 'skip')
const seqOf = (...args) => Seq(args)
const isSeq = Seq.isSeq
const findKey = invoker(1, 'findKey')
const insert = invoker(2, 'insert')

const removeIndex = curry((index, list) =>
  list.splice(index, 1)
)

const removeValue = curry((value, list) =>
  list.filter(v => v !== value)
)

export default {
  has,
  hasIn,
  every,
  keySeq,
  valueSeq,
  get,
  getIn,
  remove,
  removeIn,
  set,
  setIn,
  update,
  updateIn,
  is,
  merge,
  last,
  first,
  indexOf,
  push,
  unshift,
  reduce,
  map,
  concat,
  seqOf,
  isSeq,
  find,
  findLast,
  skip,
  insert,
  removeIndex,
  removeValue,
  findKey
}
