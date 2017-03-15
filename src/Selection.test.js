import test from 'tape';
import { Map } from 'immutable';

import SpanList from './SpanList';
import Span from './Span';
import Format from './Format';
import Block from './Block';
import BlockList from './BlockList';
import Selection from './Selection';

const getFixtures = () =>
    BlockList.create([
        Block.create({
            text: 'Lorem ipsum dolor sit amet,',
            spans: SpanList.create([
                Span.create({
                    start: 0,
                    end: 12,
                }),
                Span.create({
                    start: 12,
                    end: 27,
                    formats: Map({
                        i: Format.create({
                            name: 'i',
                        }),
                    }),
                }),
            ]),
        }),
        Block.create({
            text: ' consectetur adipiscing elit.',
            spans: SpanList.create([
                Span.create({
                    start: 0,
                    end: 13,
                    formats: Map({
                        i: Format.create({
                            name: 'i',
                        }),
                    }),
                }),
                Span.create({
                    start: 13,
                    end: 29,
                }),
            ]),
        }),
        Block.create({
            text: 'Aliquam accumsan cursus sem quis placerat.',
            spans: SpanList.create([
                Span.create({
                    start: 0,
                    end: 30,
                }),
                Span.create({
                    start: 30,
                    end: 38,
                    formats: Map({
                        i: Format.create({
                            name: 'i',
                        }),
                    }),
                }),
                Span.create({
                    start: 38,
                    end: 42,
                }),
            ]),
        }),
    ]);

const toObj = selection =>
    ({
        startIndex: Selection.getStartIndex(selection),
        startOffset: Selection.getStartOffset(selection),
        endIndex: Selection.getEndIndex(selection),
        endOffset: Selection.getEndOffset(selection),
    });

test('Selection.create', (assert) => {
    assert.plan(2);

    assert.throws(
        () => Selection.create({ startIndex: 1, endIndex: 0 }),
        Error,
        'should throw if start index > end index',
    );

    assert.throws(
        () => Selection.create({ startIndex: 0, endIndex: 0, startOffset: 2, endOffset: 1 }),
        Error,
        'should throw if start index === end index and startOffset > endOffset',
    );
});

test('Selection.getStartIndex', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getStartIndex(
            Selection.create({ startIndex: 0, endIndex: 1 }),
        ),
        0,
        'should return the start index',
    );
});

test('Selection.setStartIndex', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getStartIndex(
            Selection.setStartIndex(
                1,
                Selection.create({ endIndex: 1 }),
            ),
        ),
        1,
        'should return a new selection with the new start index',
    );
});

test('Selection.getStartOffset', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getStartOffset(
            Selection.create({ startIndex: 0, endIndex: 1, startOffset: 2, endOffset: 4 }),
        ),
        2,
        'should return the start offset',
    );
});

test('Selection.setStartOffset', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getStartOffset(
            Selection.setStartOffset(
                3,
                Selection.create({ endOffset: 4 }),
            ),
        ),
        3,
        'should return a new selection with the new start offset',
    );
});

test('Selection.setStart', (assert) => {
    assert.plan(2);

    const modifiedSelection = Selection.setStart(
        1,
        14,
        Selection.create({ startIndex: 2, endIndex: 2, startOffset: 2, endOffset: 4 }),
    );

    assert.equal(
        Selection.getStartIndex(modifiedSelection),
        1,
        'should return a selection with the given start index',
    );

    assert.equal(
        Selection.getStartOffset(modifiedSelection),
        14,
        'should return a selection with the given start offset',
    );
});

test('Selection.getEndIndex', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getEndIndex(
            Selection.create({ startIndex: 0, endIndex: 1 }),
        ),
        1,
        'should return the end index',
    );
});

test('Selection.setEndIndex', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getEndIndex(
            Selection.setEndIndex(
                3,
                Selection.create({ endIndex: 1 }),
            ),
        ),
        3,
        'should return a new selection with the new end index',
    );
});

test('Selection.getEndOffset', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getEndOffset(
            Selection.create({ startIndex: 0, endIndex: 1, startOffset: 2, endOffset: 4 }),
        ),
        4,
        'should return the end offset',
    );
});

test('Selection.setEndOffset', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getEndOffset(
            Selection.setEndOffset(
                12,
                Selection.create({ endOffset: 4 }),
            ),
        ),
        12,
        'should return a new selection with the new end offset',
    );
});

test('Selection.setEnd', (assert) => {
    assert.plan(2);

    const modifiedSelection = Selection.setEnd(
        3,
        12,
        Selection.create({ startIndex: 2, endIndex: 2, startOffset: 2, endOffset: 4 }),
    );

    assert.equal(
        Selection.getEndIndex(modifiedSelection),
        3,
        'should return a selection with the given end index',
    );

    assert.equal(
        Selection.getEndOffset(modifiedSelection),
        12,
        'should return a selection with the given end offset',
    );
});

test('Selection.getTarget', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getTarget(
            Selection.create({ target: 'foo' }),
        ),
        'foo',
        'should return the target',
    );
});

test('Selection.setTarget', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.getTarget(
            Selection.setTarget('bar')(
                Selection.create({ target: 'foo' }),
            ),
        ),
        'bar',
        'should return a new selection with the new target',
    );
});

test('Selection.setBothIndexes', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.setBothIndexes(
                2,
                Selection.create(),
            ),
        ),
        { startIndex: 2, endIndex: 2, startOffset: 0, endOffset: 0 },
    );
});

test('Selection.setBothOffsets', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.setBothOffsets(
                2,
                Selection.create(),
            ),
        ),
        { startIndex: 0, endIndex: 0, startOffset: 2, endOffset: 2 },
    );
});

test('Selection.isCollapsed', (assert) => {
    assert.plan(3);

    assert.equal(
        Selection.isCollapsed(
            Selection.create({
                startIndex: 2,
                endIndex: 2,
                startOffset: 5,
                endOffset: 5,
            }),
        ),
        true,
        'should return true if start index = end index and start offset = end offset ',
    );

    assert.equal(
        Selection.isCollapsed(
            Selection.create({
                startIndex: 1,
                endIndex: 2,
                startOffset: 5,
                endOffset: 5,
            }),
        ),
        false,
        'should return false if start index != end index even though start offset = end offset ',
    );

    assert.equal(
        Selection.isCollapsed(
            Selection.create({
                startIndex: 2,
                endIndex: 2,
                startOffset: 2,
                endOffset: 5,
            }),
        ),
        false,
        'should return false if start index = end index but start offset = end offset ',
    );
});

test('Selection.isCollapsedAt', (assert) => {
    assert.plan(3);

    assert.equal(
        Selection.isCollapsedAt(4)(16)(
            Selection.create({
                startIndex: 4,
                endIndex: 4,
                startOffset: 16,
                endOffset: 16,
            }),
        ),
        true,
        'should return true if both index values = the given index and both offset values = the given offset',
    );

    assert.equal(
        Selection.isCollapsedAt(4)(16)(
            Selection.create({
                startIndex: 3,
                endIndex: 3,
                startOffset: 16,
                endOffset: 16,
            }),
        ),
        false,
        'should return false if the index values != the given index even though both offset values = the given offset',
    );

    assert.equal(
        Selection.isCollapsedAt(4)(16)(
            Selection.create({
                startIndex: 4,
                endIndex: 4,
                startOffset: 9,
                endOffset: 9,
            }),
        ),
        false,
        'should return false if both index values = the given index but the offset values != the given offset',
    );
});

test('Selection.collapseTo', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.isCollapsedAt(
            2, 15,
            Selection.collapseTo(
                2, 15,
                Selection.create({
                    startIndex: 0,
                    endIndex: 5,
                    startOffset: 2,
                    endOffset: 16,
                }),
            ),
        ),
        true,
        'should return a collapsed selection pointing at the given index and offset value',
    );
});

test('Selection.collapseToStart', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.isCollapsedAt(
            0, 2,
            Selection.collapseToStart(
                Selection.create({
                    startIndex: 0,
                    endIndex: 5,
                    startOffset: 2,
                    endOffset: 16,
                }),
            ),
        ),
        true,
        'should return a collapsed selection pointing at the original start index and offset',
    );
});

test('Selection.collapseToEnd', (assert) => {
    assert.plan(1);

    assert.equal(
        Selection.isCollapsedAt(
            5, 16,
            Selection.collapseToEnd(
                Selection.create({
                    startIndex: 0,
                    endIndex: 5,
                    startOffset: 2,
                    endOffset: 16,
                }),
            ),
        ),
        true,
        'should return a collapsed selection pointing at the original end index and offset',
    );
});

test('Selection.isCollapsedAtBlockListStart', (assert) => {
    assert.plan(2);

    assert.equal(
        Selection.isCollapsedAtBlockListStart(
            getFixtures(),
            Selection.create(),
        ),
        true,
        'should return true if the selection is collapsed at 0/0',
    );

    assert.equal(
        Selection.isCollapsedAtBlockListStart(
            getFixtures(),
            Selection.collapseTo(
                1, 5,
                Selection.create(),
            ),
        ),
        false,
        'should return false if the selection is not collapsed at 0/0',
    );
});

test('Selection.collapseToBlockListStart', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.collapseToBlockListStart(
                getFixtures(),
                Selection.collapseTo(
                    1, 5,
                    Selection.create(),
                ),
            ),
        ),
        toObj(Selection.create()),
        'should return a selection that is collapsed at 0/0',
    );
});

test('Selection.isCollapsedAtBlockListEnd', (assert) => {
    assert.plan(2);

    assert.equal(
        Selection.isCollapsedAtBlockListEnd(
            getFixtures(),
            Selection.collapseTo(
                2, 42,
                Selection.create(),
            ),
        ),
        true,
        'should return true if the selection is collapsed at the length of the latest block in the block list',
    );

    assert.equal(
        Selection.isCollapsedAtBlockListEnd(
            getFixtures(),
            Selection.collapseTo(
                1, 5,
                Selection.create(),
            ),
        ),
        false,
        'should return false if the selection is not collapsed at the length of the latest block in the block list',
    );
});

test('Selection.collapseToBlockListEnd', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.collapseToBlockListEnd(
                getFixtures(),
                Selection.collapseTo(
                    1, 5,
                    Selection.create(),
                ),
            ),
        ),
        toObj(
            Selection.collapseTo(
                2, 42,
                Selection.create(),
            ),
        ),
        'should return a selection that is collapsed at the length of the latest block in the block list',
    );
});

test('Selection.isCollapsedAtBlockStart', (assert) => {
    assert.plan(2);

    assert.equal(
        Selection.isCollapsedAtBlockStart(
            getFixtures(),
            Selection.collapseTo(
                1, 0,
                Selection.create(),
            ),
        ),
        true,
        'should return true if the selection is collapsed at index/0',
    );

    assert.equal(
        Selection.isCollapsedAtBlockStart(
            getFixtures(),
            Selection.collapseTo(
                1, 5,
                Selection.create(),
            ),
        ),
        false,
        'should return false if the selection is not collapsed at index/0',
    );
});

test('Selection.collapseToBlockListStart', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.collapseToBlockStart(
                getFixtures(),
                Selection.collapseTo(
                    1, 5,
                    Selection.create(),
                ),
            ),
        ),
        toObj(
            Selection.collapseTo(
                1, 0,
                Selection.create(),
            ),
        ),
        'should return a selection that is collapsed at index/0',
    );
});

test('Selection.isCollapsedAtBlockStart', (assert) => {
    assert.plan(2);

    assert.equal(
        Selection.isCollapsedAtBlockStart(
            getFixtures(),
            Selection.collapseTo(
                1, 0,
                Selection.create(),
            ),
        ),
        true,
        'should return true if the selection is collapsed at index/0',
    );

    assert.equal(
        Selection.isCollapsedAtBlockStart(
            getFixtures(),
            Selection.collapseTo(
                1, 5,
                Selection.create(),
            ),
        ),
        false,
        'should return false if the selection is not collapsed at index/0',
    );
});

test('Selection.collapseToBlockStart', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.collapseToBlockStart(
                getFixtures(),
                Selection.collapseTo(
                    1, 5,
                    Selection.create(),
                ),
            ),
        ),
        toObj(
            Selection.collapseTo(
                1, 0,
                Selection.create(),
            ),
        ),
        'should return a selection that is collapsed at index/0',
    );
});

test('Selection.isCollapsedAtBlockEnd', (assert) => {
    assert.plan(2);

    assert.equal(
        Selection.isCollapsedAtBlockEnd(
            getFixtures(),
            Selection.collapseTo(
                0, 27,
                Selection.create(),
            ),
        ),
        true,
        'should return true if the selection is collapsed at index/length',
    );

    assert.equal(
        Selection.isCollapsedAtBlockEnd(
            getFixtures(),
            Selection.collapseTo(
                1, 5,
                Selection.create(),
            ),
        ),
        false,
        'should return false if the selection is not collapsed at index/length',
    );
});

test('Selection.collapseToBlockEnd', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        toObj(
            Selection.collapseToBlockEnd(
                getFixtures(),
                Selection.collapseTo(
                    0, 5,
                    Selection.create(),
                ),
            ),
        ),
        toObj(
            Selection.collapseTo(
                0, 27,
                Selection.create(),
            ),
        ),
        'should return a selection that is collapsed at index/length',
    );
});
