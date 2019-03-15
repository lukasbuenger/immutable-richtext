import { Record } from 'immutable'
import R from 'ramda'
import I from './utils/I'

import BlockText from './BlockText'
import Span from './Span'
import SpanList from './SpanList'

const getBlockText = I.get('text')

const getSpanList = I.get('spans')

const create = Record(
  {
    text: BlockText.create(),
    spans: SpanList.create()
  },
  'Block'
)

const createWithText = text =>
  create({
    text,
    spans: SpanList.create([
      Span.create({
        end: BlockText.getLength(text)
      })
    ])
  })

const getLength = R.compose(
  BlockText.getLength,
  getBlockText
)

const isEmpty = block =>
  BlockText.isEmpty(getBlockText(block)) &&
  SpanList.isEmpty(getSpanList(block))

const insertTextAfterRange = R.curry(
  (newText, range, block) =>
    I.update(
      'text',
      BlockText.insertAfterRange(newText, range),
      I.update(
        'spans',
        SpanList.offsetAfterRange(
          BlockText.getLength(newText),
          range
        ),
        block
      )
    )
)

const copyRange = R.curry((range, block) =>
  create({
    text: BlockText.copyRange(
      range,
      getBlockText(block)
    ),
    spans: SpanList.normalize(
      SpanList.copyRange(
        range,
        getSpanList(block)
      )
    )
  })
)

const removeRange = R.curry((range, block) =>
  create({
    text: BlockText.removeRange(
      range,
      getBlockText(block)
    ),
    spans: SpanList.normalize(
      SpanList.removeRange(
        range,
        getSpanList(block)
      )
    )
  })
)

const append = R.curry((blockToAppend, block) =>
  create({
    text: BlockText.append(
      getBlockText(blockToAppend),
      getBlockText(block)
    ),
    spans: SpanList.normalize(
      SpanList.append(
        getSpanList(blockToAppend),
        getSpanList(block)
      )
    )
  })
)

const prepend = R.flip(append)

const fromJS = R.compose(
  create,
  R.evolve({
    text: BlockText.fromJS,
    spans: SpanList.fromJS
  })
)

export default {
  getBlockText,
  getSpanList,
  create,
  createWithText,
  getLength,
  isEmpty,
  insertTextAfterRange,
  copyRange,
  removeRange,
  append,
  prepend,
  fromJS
}
