import { Record } from 'immutable'
import R from 'ramda'

import I from './utils/I'

import BlockList from './BlockList'
import Block from './Block'

const innerCreate = Record(
  {
    target: null,
    startIndex: 0,
    endIndex: 0,
    startOffset: 0,
    endOffset: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  },
  'Selection'
)

const getTarget = I.get('target')

const setTarget = I.set('target')

const getStartIndex = I.get('startIndex')

const setStartIndex = I.set('startIndex')

const getStartOffset = I.get('startOffset')

const setStartOffset = I.set('startOffset')

const setStart = R.curry(
  (index, offset, selection) =>
    setStartIndex(
      index,
      setStartOffset(offset, selection)
    )
)

const getEndIndex = I.get('endIndex')

const setEndIndex = I.set('endIndex')

const getEndOffset = I.get('endOffset')

const setEndOffset = I.set('endOffset')

const setEnd = R.curry(
  (index, offset, selection) =>
    setEndIndex(
      index,
      setEndOffset(offset, selection)
    )
)

const setBothIndexes = R.curry(
  (index, selection) =>
    setStartIndex(
      index,
      setEndIndex(index, selection)
    )
)

const setBothOffsets = R.curry(
  (offset, selection) =>
    setStartOffset(
      offset,
      setEndOffset(offset, selection)
    )
)

const isValid = selection =>
  getStartIndex(selection) <=
    getEndIndex(selection) &&
  (getStartIndex(selection) !==
    getEndIndex(selection) ||
    getStartOffset(selection) <=
      getEndOffset(selection))

const create = (props = {}) => {
  const selection = innerCreate(props)
  if (!isValid(selection)) {
    throw new Error('Invalid Selection detected!')
  }
  return selection
}

const isCollapsed = selection =>
  getStartIndex(selection) ===
    getEndIndex(selection) &&
  getStartOffset(selection) ===
    getEndOffset(selection)

const isCollapsedAt = R.curry(
  (index, offset, selection) =>
    isCollapsed(selection) &&
    getStartIndex(selection) === index &&
    getStartOffset(selection) === offset
)

const collapseTo = R.curry(
  (index, offset, selection) =>
    setStartIndex(
      index,
      setEndIndex(
        index,
        setStartOffset(
          offset,
          setEndOffset(offset, selection)
        )
      )
    )
)

const collapseToStart = selection =>
  collapseTo(
    getStartIndex(selection),
    getStartOffset(selection),
    selection
  )

const collapseToEnd = selection =>
  collapseTo(
    getEndIndex(selection),
    getEndOffset(selection),
    selection
  )

const isCollapsedAtBlockListStart = R.curry(
  (blockList, selection) =>
    isCollapsedAt(0, 0, selection)
)

const collapseToBlockListStart = R.curry(
  (blockList, selection) =>
    collapseTo(0, 0, selection)
)

const isCollapsedAtBlockListEnd = R.curry(
  (blockList, selection) =>
    isCollapsedAt(
      BlockList.getLastIndex(blockList),
      Block.getLength(
        BlockList.getLast(blockList)
      ),
      selection
    )
)

const collapseToBlockListEnd = R.curry(
  (blockList, selection) =>
    collapseTo(
      BlockList.getLastIndex(blockList),
      Block.getLength(
        BlockList.getLast(blockList)
      ),
      selection
    )
)

const isCollapsedAtBlockStart = R.curry(
  (blockList, selection) =>
    isCollapsedAt(
      getStartIndex(selection),
      0,
      selection
    )
)

const collapseToBlockStart = R.curry(
  (blockList, selection) =>
    collapseTo(
      getStartIndex(selection),
      0,
      selection
    )
)

const isCollapsedAtBlockEnd = R.curry(
  (blockList, selection) =>
    isCollapsedAt(
      getEndIndex(selection),
      Block.getLength(
        BlockList.getAtIndex(
          getEndIndex(selection),
          blockList
        )
      ),
      selection
    )
)

const collapseToBlockEnd = R.curry(
  (blockList, selection) =>
    collapseTo(
      getEndIndex(selection),
      Block.getLength(
        BlockList.getAtIndex(
          getEndIndex(selection),
          blockList
        )
      ),
      selection
    )
)

export default {
  getTarget,
  setTarget,
  getStartIndex,
  setStartIndex,
  getStartOffset,
  setStartOffset,
  setStart,
  getEndIndex,
  setEndIndex,
  getEndOffset,
  setEndOffset,
  setEnd,
  setBothIndexes,
  setBothOffsets,
  create,
  isCollapsed,
  isCollapsedAt,
  collapseTo,
  collapseToStart,
  collapseToEnd,
  isCollapsedAtBlockListStart,
  collapseToBlockListStart,
  isCollapsedAtBlockListEnd,
  collapseToBlockListEnd,
  isCollapsedAtBlockStart,
  collapseToBlockStart,
  isCollapsedAtBlockEnd,
  collapseToBlockEnd
}
