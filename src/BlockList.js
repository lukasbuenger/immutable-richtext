import { List } from 'immutable';
import R from 'ramda';
import I from './utils/I';

import SpanList from './SpanList';
import Block from './Block';
import Selection from './Selection';
import Range from './Range';

const getSize = R.prop('size');

const isValid = blockList => getSize(blockList) > 0;

const create = (blocks) => {
    const blockList = List(
        blocks || [Block.create()],
    );
    if (!isValid(blockList)) {
        throw new Error('Invalid BlockList detected!');
    }
    return blockList;
};

const createWithText = text =>
    create([Block.createWithText(text)]);

const getLastIndex = R.compose(
    R.dec,
    getSize,
);

const getFirst = I.first;

const getLast = I.last;

const getAtIndex = I.get;

const getText = I.reduce(
    (text, block) => text.concat(Block.getBlockText(block)),
    '',
);

const getLength = R.compose(
    R.prop('length'),
    getText,
);

const isEmpty = blockList =>
    getSize(blockList) === 1
    && Block.isEmpty(
        getFirst(blockList),
    );

const removeReducer = selection => (newBlockList, block, blockIndex) => {
    if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.push(
            Block.removeRange(
                Range.create(
                    Selection.getStartOffset(selection),
                    Selection.getEndOffset(selection),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) > blockIndex
    ) {
        return I.push(
            Block.removeRange(
                Range.create(
                    Selection.getStartOffset(selection),
                    Block.getLength(block),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) < blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.update(
            Selection.getStartIndex(selection),
            (previousBlock) => {
                return Block.isEmpty(previousBlock)
                ? Block.removeRange(
                    Range.create(
                        0,
                        Selection.getEndOffset(selection),
                    ),
                    block,
                )
                : Block.prepend(
                    previousBlock,
                    Block.removeRange(
                        Range.create(
                            0,
                            Selection.getEndOffset(selection),
                        ),
                        block,
                    ),
                );
            },
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) < blockIndex
        && Selection.getEndIndex(selection) > blockIndex
    ) {
        return newBlockList;
    }

    return I.push(
        block,
        newBlockList,
    );
};

const removeSelection = R.curry(
    (selection, blockList) =>
        I.reduce(removeReducer(selection), List(), blockList),
);

const copyReducer = selection => (newBlockList, block, blockIndex) => {
    if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.push(
            Block.copyRange(
                Range.create(
                    Selection.getStartOffset(selection),
                    Selection.getEndOffset(selection),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) > blockIndex
    ) {
        return I.push(
            Block.copyRange(
                Range.create(
                    Selection.getStartOffset(selection),
                    Block.getLength(block),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) < blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.push(
            Block.copyRange(
                Range.create(
                    0,
                    Selection.getEndOffset(selection),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) < blockIndex
        && Selection.getEndIndex(selection) > blockIndex
    ) {
        return I.push(
            block,
            newBlockList,
        );
    }

    return newBlockList;
};

const copySelection = R.curry(
    (selection, blockList) =>
        I.reduce(copyReducer(selection), List(), blockList),
);

const splitReducer = selection => (newBlockList, block, blockIndex) => {
    if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.push(
            I.update(
                'spans',
                SpanList.splitAtRange(
                    Range.create(
                        Selection.getStartOffset(selection),
                        Selection.getEndOffset(selection),
                    ),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) === blockIndex
        && Selection.getEndIndex(selection) > blockIndex
    ) {
        return I.push(
            I.update(
                'spans',
                SpanList.splitAtRange(
                    Range.create(
                        Selection.getStartOffset(selection),
                        Block.getLength(block),
                    ),
                ),
                block,
            ),
            newBlockList,
        );
    } else if (
        Selection.getStartIndex(selection) < blockIndex
        && Selection.getEndIndex(selection) === blockIndex
    ) {
        return I.push(
            I.update(
                'spans',
                SpanList.splitAtRange(
                    Range.create(
                        0,
                        Selection.getEndOffset(selection),
                    ),
                ),
                block,
            ),
            newBlockList,
        );
    }

    return I.push(
        block,
        newBlockList,
    );
};

const splitSpansAtSelection = R.curry(
    (selection, blockList) =>
        I.reduce(splitReducer(selection), List(), blockList),
);

const mapReducer = (lazy, mapperFn, selection) =>
    (newBlockList, block, blockIndex) => {
        if (
            Selection.getStartIndex(selection) === blockIndex
            && Selection.getEndIndex(selection) === blockIndex
        ) {
            return I.push(
                I.update(
                    'spans',
                    R.compose(
                        SpanList.normalize,
                        SpanList.mapInRange(
                            lazy,
                            mapperFn,
                            Range.create(
                                Selection.getStartOffset(selection),
                                Selection.getEndOffset(selection),
                            ),
                        ),
                    ),
                    block,
                ),
                newBlockList,
            );
        } else if (
            Selection.getStartIndex(selection) === blockIndex
            && Selection.getEndIndex(selection) > blockIndex
        ) {
            return I.push(
                I.update(
                    'spans',
                    R.compose(
                        SpanList.normalize,
                        SpanList.mapInRange(
                            lazy,
                            mapperFn,
                            Range.create(
                                Selection.getStartOffset(selection),
                                Block.getLength(block),
                            ),
                        ),
                    ),
                    block,
                ),
                newBlockList,
            );
        } else if (
            Selection.getStartIndex(selection) < blockIndex
            && Selection.getEndIndex(selection) === blockIndex
        ) {
            return I.push(
                I.update(
                    'spans',
                    R.compose(
                        SpanList.normalize,
                        SpanList.mapInRange(
                            lazy,
                            mapperFn,
                            Range.create(
                                0,
                                Selection.getEndOffset(selection),
                            ),
                        ),
                    ),
                    block,
                ),
                newBlockList,
            );
        } else if (
            Selection.getStartIndex(selection) < blockIndex
            && Selection.getEndIndex(selection) > blockIndex
        ) {
            return I.push(
                I.update(
                    'spans',
                    R.compose(
                        SpanList.normalize,
                        I.map(mapperFn),
                    ),
                    block,
                ),
                newBlockList,
            );
        }

        return I.push(
            block,
            newBlockList,
        );
    };

const mapSpansInSelection = R.curry(
    (lazy, mapperFn, selection, blockList) =>
        I.reduce(mapReducer(lazy, mapperFn, selection), List(), blockList),
);

const reduceReducer = (lazy, reducerFn, selection) =>
    (reduction, block, blockIndex) => {
        if (
            Selection.getStartIndex(selection) === blockIndex
            && Selection.getEndIndex(selection) === blockIndex
        ) {
            return SpanList.reduceInRange(
                lazy,
                reducerFn,
                reduction,
                Range.create(
                    Selection.getStartOffset(selection),
                    Selection.getEndOffset(selection),
                ),
                Block.getSpanList(block),
            );
        } else if (
            Selection.getStartIndex(selection) === blockIndex
            && Selection.getEndIndex(selection) > blockIndex
        ) {
            return SpanList.reduceInRange(
                lazy,
                reducerFn,
                reduction,
                Range.create(
                    Selection.getStartOffset(selection),
                    Block.getLength(block),
                ),
                Block.getSpanList(block),
            );
        } else if (
            Selection.getStartIndex(selection) < blockIndex
            && Selection.getEndIndex(selection) === blockIndex
        ) {
            return SpanList.reduceInRange(
                lazy,
                reducerFn,
                reduction,
                Range.create(
                    0,
                    Selection.getEndOffset(selection),
                ),
                Block.getSpanList(block),
            );
        } else if (
            Selection.getStartIndex(selection) < blockIndex
            && Selection.getEndIndex(selection) > blockIndex
        ) {
            return I.reduce(
                reducerFn,
                reduction,
                Block.getSpanList(block),
            );
        }
        return reduction;
    };

const reduceSpansInSelection = R.curry(
    (lazy, reducerFn, initialReduction, selection, blockList) =>
        I.reduce(reduceReducer(lazy, reducerFn, selection), initialReduction, blockList),
);

const insertTextAfterSelection = R.curry(
    (text, selection, blockList) =>
        I.update(
            Selection.getEndIndex(selection),
            Block.insertTextAfterRange(
                text,
                Range.create(
                    Selection.getEndOffset(selection),
                    Selection.getEndOffset(selection),
                ),
            ),
            blockList,
        ),
);

const removeCharBeforeSelection = R.curry(
    (selection, blockList) => {
        if (
            Selection.isCollapsedAt(
                0,
                0,
                Selection.collapseToStart(selection),
            )
        ) {
            return blockList;
        } else if (
            Selection.isCollapsedAt(
                Selection.getStartIndex(selection),
                0,
                Selection.collapseToStart(selection),
            )
        ) {
            return removeSelection(
                Selection.setStart(
                    Selection.getStartIndex(selection) - 1,
                    Block.getLength(
                        getAtIndex(
                            Selection.getStartIndex(selection) - 1,
                            blockList,
                        ),
                    ),
                    Selection.collapseToStart(selection),
                ),
                blockList,
            );
        }
        return removeSelection(
            Selection.setStartOffset(
                Selection.getStartOffset(selection) - 1,
                Selection.collapseToStart(selection),
            ),
            blockList,
        );
    },
);

const removeCharAfterSelection = R.curry(
    (selection, blockList) => {
        if (
            Selection.isCollapsedAt(
                getLastIndex(blockList),
                Block.getLength(
                    getLast(blockList),
                ),
                Selection.collapseToEnd(selection),
            )
        ) {
            return blockList;
        } else if (
            Selection.isCollapsedAt(
                Selection.getEndIndex(selection),
                Block.getLength(
                    getAtIndex(
                        Selection.getEndIndex(selection),
                        blockList,
                    ),
                ),
                Selection.collapseToEnd(selection),
            )
        ) {
            return removeSelection(
                Selection.setEnd(
                    Selection.getEndIndex(selection) + 1,
                    0,
                    Selection.collapseToEnd(selection),
                ),
                blockList,
            );
        }
        return removeSelection(
            Selection.setEndOffset(
                Selection.getEndOffset(selection) + 1,
                Selection.collapseToEnd(selection),
            ),
            blockList,
        );
    },
);

const append = R.curry(
    (mergeEdges, blockListToAppend, blockList) => {
        return mergeEdges === false ?
            I.concat(blockListToAppend, blockList) :
            I.concat(
                I.skip(
                    1,
                    blockListToAppend,
                ),
                I.update(
                    getLastIndex(blockList),
                    Block.append(
                        getFirst(blockListToAppend),
                    ),
                    blockList,
                ),
            );
    },
);

const prepend = R.curry(
    (mergeEdges, blockListToPrepend, blockList) =>
        append(mergeEdges, blockList, blockListToPrepend),
);

const insertEmptyBlockBeforeSelection = R.curry(
    (selection, blockList) =>
        I.insert(
            Selection.getStartIndex(selection),
            Block.create(),
            blockList,
        ),
);

const insertEmptyBlockAfterSelection = R.curry(
    (selection, blockList) =>
        I.insert(
            Selection.getEndIndex(selection) + 1,
            Block.create(),
            blockList,
        ),
);

const splitBlockAfterSelection = R.curry(
    (selection, blockList) =>
        append(
            false,
            copySelection(
                Selection.create({
                    startIndex: Selection.getEndIndex(selection),
                    startOffset: Selection.getEndOffset(selection),
                    endIndex: getLastIndex(blockList),
                    endOffset: getLength(blockList),
                }),
                blockList,
            ),
            copySelection(
                Selection.create({
                    startIndex: 0,
                    startOffset: 0,
                    endIndex: Selection.getEndIndex(selection),
                    endOffset: Selection.getEndOffset(selection),
                }),
                blockList,
            ),
        ),
    );

const fromJS = obj =>
    List(
        obj.map(Block.fromJS),
    );

export default {
    getSize,
    create,
    createWithText,
    getLastIndex,
    getFirst,
    getLast,
    getAtIndex,
    getText,
    getLength,
    isEmpty,
    removeSelection,
    copySelection,
    splitSpansAtSelection,
    mapSpansInSelection,
    reduceSpansInSelection,
    insertTextAfterSelection,
    removeCharBeforeSelection,
    removeCharAfterSelection,
    append,
    prepend,
    insertEmptyBlockBeforeSelection,
    insertEmptyBlockAfterSelection,
    splitBlockAfterSelection,
    fromJS,
};
