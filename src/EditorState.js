import { Record, Set } from 'immutable'
import R from 'ramda'
import I from './utils/I'
import Selection from './Selection'
import BlockList from './BlockList'
import Block from './Block'
import Span from './Span'

const innerCreate = Record(
  {
    selection: null,
    blocks: null
  },
  'EditorState'
)

const create = (selection, blocks) => {
  if (!selection || !blocks) {
    throw new Error(
      'Invalid EditorState detected!'
    )
  }
  return innerCreate({ selection, blocks })
}

const getSelection = I.get('selection')

const setSelection = I.set('selection')

const getBlockList = I.get('blocks')

const setBlockList = I.set('blocks')

const removeSelection = editorState => {
  const selection = getSelection(editorState)
  const blockList = getBlockList(editorState)
  return create(
    Selection.collapseToStart(selection),
    BlockList.removeSelection(
      selection,
      blockList
    )
  )
}

const copySelection = editorState =>
  create(
    Selection.create(),
    BlockList.copySelection(
      getSelection(editorState),
      getBlockList(editorState)
    )
  )

const pasteAfterSelection = R.curry(
  (editorStateToPaste, editorState) =>
    R.compose(
      state =>
        setBlockList(
          BlockList.append(
            true,
            BlockList.copySelection(
              Selection.setEnd(
                BlockList.getLastIndex(
                  getBlockList(editorState)
                ),
                BlockList.getLength(
                  getBlockList(editorState)
                ),
                getSelection(editorState)
              ),
              getBlockList(editorState)
            ),
            getBlockList(state)
          ),
          state
        ),
      state =>
        setSelection(
          Selection.collapseTo(
            BlockList.getLastIndex(
              getBlockList(state)
            ),
            Block.getLength(
              BlockList.getLast(
                getBlockList(state)
              )
            ),
            getSelection(editorState)
          ),
          state
        ),
      state =>
        setBlockList(
          BlockList.append(
            true,
            getBlockList(editorStateToPaste),
            getBlockList(state)
          ),
          state
        ),
      state =>
        setBlockList(
          BlockList.copySelection(
            Selection.setStart(
              0,
              0,
              getSelection(editorState)
            ),
            getBlockList(editorState)
          ),
          state
        )
    )(editorState)
)

const insertOrSplitBlockAfterSelection = editorState => {
  const selection = getSelection(editorState)
  const blockList = getBlockList(editorState)
  return create(
    Selection.collapseTo(
      Selection.getEndIndex(selection) + 1,
      0,
      selection
    ),
    R.cond([
      [
        R.flip(Selection.isCollapsedAtBlockEnd),
        BlockList.insertEmptyBlockAfterSelection
      ],
      [
        R.flip(Selection.isCollapsedAtBlockStart),
        BlockList.insertEmptyBlockBeforeSelection
      ],
      [R.T, BlockList.splitBlockAfterSelection]
    ])(selection, blockList)
  )
}

const insertTextAfterSelection = R.curry(
  (text, editorState) => {
    const selection = getSelection(editorState)
    const blockList = getBlockList(editorState)
    return create(
      Selection.collapseTo(
        Selection.getEndIndex(selection),
        Selection.getEndOffset(selection) +
          text.length,
        selection
      ),
      BlockList.insertTextAfterSelection(
        text,
        selection,
        blockList
      )
    )
  }
)

const removeCharBeforeSelection = editorState => {
  const selection = getSelection(editorState)
  const blockList = getBlockList(editorState)
  return create(
    R.cond([
      [
        R.flip(
          Selection.isCollapsedAtBlockListStart
        ),
        R.always(selection)
      ],
      [
        R.flip(Selection.isCollapsedAtBlockStart),
        R.compose(
          Selection.collapseToBlockEnd(blockList),
          Selection.setBothIndexes(
            Selection.getStartIndex(selection) - 1
          )
        )
      ],
      [
        R.T,
        Selection.setBothOffsets(
          Selection.getStartOffset(selection) - 1
        )
      ]
    ])(selection, blockList),
    BlockList.removeCharBeforeSelection(
      selection,
      blockList
    )
  )
}

const removeCharAfterSelection = editorState =>
  setBlockList(
    BlockList.removeCharAfterSelection(
      getSelection(editorState),
      getBlockList(editorState)
    ),
    editorState
  )

const addFormatToSelection = R.curry(
  (format, editorState) =>
    I.update(
      'blocks',
      R.compose(
        BlockList.mapSpansInSelection(
          false,
          Span.addFormat(format),
          getSelection(editorState)
        ),
        BlockList.splitSpansAtSelection(
          getSelection(editorState)
        )
      ),
      editorState
    )
)

const removeFormatFromSelection = R.curry(
  (formatName, editorState) =>
    I.update(
      'blocks',
      BlockList.mapSpansInSelection(
        true,
        Span.removeFormat(formatName),
        getSelection(editorState)
      ),
      editorState
    )
)

const getFormatNamesInSelection = editorState =>
  BlockList.reduceSpansInSelection(
    true,
    (acc, span) =>
      acc.union(Span.getFormatNames(span)),
    Set(),
    getSelection(editorState),
    getBlockList(editorState)
  )

const append = R.curry(
  (
    mergeEdges,
    editorStateToAppend,
    editorState
  ) =>
    create(
      Selection.collapseToBlockListEnd(
        getBlockList(editorState),
        getSelection(editorState)
      ),
      BlockList.append(
        mergeEdges,
        getBlockList(editorStateToAppend),
        getBlockList(editorState)
      )
    )
)

const prepend = R.curry(
  (
    mergeEdges,
    editorStateToPrepend,
    editorState
  ) =>
    append(
      mergeEdges,
      editorState,
      editorStateToPrepend
    )
)

export default {
  create,
  getSelection,
  setSelection,
  getBlockList,
  setBlockList,
  removeSelection,
  copySelection,
  pasteAfterSelection,
  insertOrSplitBlockAfterSelection,
  insertTextAfterSelection,
  removeCharBeforeSelection,
  removeCharAfterSelection,
  addFormatToSelection,
  removeFormatFromSelection,
  getFormatNamesInSelection,
  append,
  prepend
}
