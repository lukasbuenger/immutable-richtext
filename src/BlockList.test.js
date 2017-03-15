import test from 'tape';
import { List, Map, Seq } from 'immutable';

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

test('BlockList.create', (assert) => {
    assert.plan(4);

    assert.equal(
        List.isList(BlockList.create()),
        true,
        'should return a new block list of type List',
    );

    assert.equal(
        BlockList.getSize(BlockList.create()),
        1,
        'should return a new block list with at least one span by default',
    );

    const block = Block.create();

    assert.equal(
        BlockList.getFirst(
            BlockList.create([block]),
        ),
        block,
        'should accept a passed list of spans',
    );

    assert.throws(
        () => BlockList.create([]),
        Error,
        'should throw if created with no spans',
    );
});

test('BlockList.createWithText', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        BlockList.createWithText('Foobar').toJS(),
        [
            {
                text: 'Foobar',
                spans: [
                    { start: 0, end: 6, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.getSize', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockList.getSize(BlockList.create([1, 2, 3])),
        3,
        'should return the number of items in the list',
    );
});

test('BlockList.getLength', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockList.getLength(getFixtures()),
        98,
        'should return the sum of the length of all blocks in the list',
    );
});

test('BlockList.getLastIndex', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockList.getLastIndex(getFixtures()),
        2,
        'should return the index of the last block in the list',
    );
});

test('BlockList.getFirst', (assert) => {
    assert.plan(1);

    const fixtures = getFixtures();

    assert.equal(
        BlockList.getFirst(fixtures),
        fixtures.get(0),
        'should return the first block in the list',
    );
});

test('BlockList.getLast', (assert) => {
    assert.plan(1);

    const fixtures = getFixtures();

    assert.equal(
        BlockList.getLast(fixtures),
        fixtures.get(2),
        'should return the last block in the list',
    );
});

test('BlockList.getAtIndex', (assert) => {
    assert.plan(1);

    const fixtures = getFixtures();

    assert.equal(
        BlockList.getAtIndex(1, fixtures),
        fixtures.get(1),
        'should return the block at index',
    );
});

test('BlockList.isEmpty', (assert) => {
    assert.plan(3);

    assert.equal(
        BlockList.isEmpty(
            BlockList.create(),
        ),
        true,
        'should return true if the block list is of size 1 and the first block is empty',
    );

    assert.equal(
        BlockList.isEmpty(
            BlockList.create([
                Block.createWithText('foo'),
            ]),
        ),
        false,
        'should return false if the block list is of size 1 but the first block is not empty',
    );
    assert.equal(
        BlockList.isEmpty(
            BlockList.create([
                Block.create(),
                Block.create(),
            ]),
        ),
        false,
        'should return false if the block list size is > 1 even though the first block is empty',
    );
});

test('BlockList.removeSelection', (assert) => {
    assert.plan(3);

    assert.deepEqual(
        BlockList.removeSelection(
            Selection.create({
                startIndex: 1,
                endIndex: 2,
                startOffset: 20,
                endOffset: 18,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscursus sem quis placerat.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 32, formats: {} },
                    { start: 32, end: 40, formats: { i: { name: 'i', data: {} } } },
                    { start: 40, end: 44, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.removeSelection(
            Selection.create({
                startIndex: 0,
                endIndex: 0,
                startOffset: 4,
                endOffset: 8,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Loresum dolor sit amet,',
                spans: [
                    { start: 0, end: 8, formats: {} },
                    { start: 8, end: 23, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.removeSelection(
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 2,
                endOffset: 40,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lot.',
                spans: [
                    { start: 0, end: 4, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.copySelection', (assert) => {
    assert.plan(2);

    assert.deepEqual(
        BlockList.copySelection(
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 2,
                endOffset: 40,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'rem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 10, formats: {} },
                    { start: 10, end: 25, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placera',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 40, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.copySelection(
            Selection.create({
                startIndex: 1,
                endIndex: 1,
                startOffset: 13,
                endOffset: 28,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'adipiscing elit',
                spans: [
                    { start: 0, end: 15, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.splitSpansAtSelection', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        BlockList.splitSpansAtSelection(
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 6,
                endOffset: 34,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 6, formats: {} },
                    { start: 6, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 34, formats: { i: { name: 'i', data: {} } } },
                    { start: 34, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.mapSpansInSelection', (assert) => {
    assert.plan(2);

    const format = Format.create({ name: 'b' });

    assert.deepEqual(
        BlockList.mapSpansInSelection(
            true,
            span => Span.addFormat(format, span),
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 6,
                endOffset: 34,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: { b: { name: 'b', data: {} } } },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} }, b: { name: 'b', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} }, b: { name: 'b', data: {} } } },
                    { start: 13, end: 29, formats: { b: { name: 'b', data: {} } } },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: { b: { name: 'b', data: {} } } },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} }, b: { name: 'b', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.mapSpansInSelection(
            false,
            span => Span.addFormat(format, span),
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 6,
                endOffset: 34,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} }, b: { name: 'b', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} }, b: { name: 'b', data: {} } } },
                    { start: 13, end: 29, formats: { b: { name: 'b', data: {} } } },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: { b: { name: 'b', data: {} } } },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.reduceSpansInSelection', (assert) => {
    assert.plan(2);

    assert.deepEqual(
        BlockList.reduceSpansInSelection(
            true,
            (acc, span) => acc.concat(Span.getFormatNames(span)),
            Seq(),
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 6,
                endOffset: 34,
            }),
            getFixtures(),
        ).toJS(),
        ['i', 'i', 'i'],
    );

    assert.deepEqual(
        BlockList.reduceSpansInSelection(
            false,
            (acc, span) => acc.concat(Span.getFormatNames(span)),
            Seq(),
            Selection.create({
                startIndex: 0,
                endIndex: 2,
                startOffset: 6,
                endOffset: 34,
            }),
            getFixtures(),
        ).toJS(),
        ['i', 'i'],
    );
});

test('BlockList.insertTextAfterSelection', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        BlockList.insertTextAfterSelection(
            'foo',
            Selection.create({
                startIndex: 0,
                endIndex: 1,
                startOffset: 0,
                endOffset: 13,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur fooadipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 32, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});


test('BlockList.removeCharBeforeSelection', (assert) => {
    assert.plan(3);

    const fixtures = getFixtures();

    assert.equal(
        BlockList.removeCharBeforeSelection(
            Selection.create(),
            fixtures,
        ),
        fixtures,
    );

    assert.deepEqual(
        BlockList.removeCharBeforeSelection(
            Selection.create({
                startIndex: 2,
                startOffset: 0,
                endIndex: 2,
                endOffset: 0,
            }),
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 59, formats: {} },
                    { start: 59, end: 67, formats: { i: { name: 'i', data: {} } } },
                    { start: 67, end: 71, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.removeCharBeforeSelection(
            Selection.create({
                startIndex: 1,
                startOffset: 5,
                endIndex: 1,
                endOffset: 5,
            }),
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' conectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 12, formats: { i: { name: 'i', data: {} } } },
                    { start: 12, end: 28, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.removeCharAfterSelection', (assert) => {
    assert.plan(3);

    const fixtures = getFixtures();

    assert.equal(
        BlockList.removeCharAfterSelection(
            Selection.create({
                endIndex: 2,
                endOffset: 42,
            }),
            fixtures,
        ),
        fixtures,
    );

    assert.deepEqual(
        BlockList.removeCharAfterSelection(
            Selection.create({
                endIndex: 1,
                endOffset: 29,
            }),
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 59, formats: {} },
                    { start: 59, end: 67, formats: { i: { name: 'i', data: {} } } },
                    { start: 67, end: 71, formats: {} },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.removeCharAfterSelection(
            Selection.create({
                startIndex: 1,
                startOffset: 5,
                endIndex: 1,
                endOffset: 5,
            }),
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consctetur adipiscing elit.',
                spans: [
                    { start: 0, end: 12, formats: { i: { name: 'i', data: {} } } },
                    { start: 12, end: 28, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.append', (assert) => {
    assert.plan(2);

    const fixtures = getFixtures();
    const blockListToAppend = fixtures.take(1);

    assert.deepEqual(
        BlockList.append(
            false,
            blockListToAppend,
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
        ],
    );

    assert.deepEqual(
        BlockList.append(
            true,
            blockListToAppend,
            fixtures,
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 54, formats: {} },
                    { start: 54, end: 69, formats: { i: { name: 'i', data: {} } } },
                ],
            },

        ],
    );
});

test('BlockList.prepend', (assert) => {
    assert.plan(2);

    const fixtures = getFixtures();
    const blockListToPrepend = fixtures.take(1);

    assert.deepEqual(
        BlockList.prepend(
            false,
            blockListToPrepend,
            fixtures,
        ).toJS(),
        BlockList.append(
            false,
            fixtures,
            blockListToPrepend,
        ).toJS(),
    );

    assert.deepEqual(
        BlockList.prepend(
            true,
            blockListToPrepend,
            fixtures,
        ).toJS(),
        BlockList.append(
            true,
            fixtures,
            blockListToPrepend,
        ).toJS(),
    );
});

test('BlockList.insertEmptyBlockBeforeSelection', (assert) => {
    assert.plan(1);
    assert.deepEqual(
        BlockList.insertEmptyBlockBeforeSelection(
            Selection.create(),
            getFixtures(),
        ).toJS(),
        [
            {
                text: '',
                spans: [
                    { start: 0, end: 0, formats: {} },
                ],
            },
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.insertEmptyBlockAfterSelection', (assert) => {
    assert.plan(1);
    assert.deepEqual(
        BlockList.insertEmptyBlockAfterSelection(
            Selection.create(),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: '',
                spans: [
                    { start: 0, end: 0, formats: {} },
                ],
            },
            {
                text: ' consectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 13, formats: { i: { name: 'i', data: {} } } },
                    { start: 13, end: 29, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.splitBlockAfterSelection', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        BlockList.splitBlockAfterSelection(
            Selection.create({
                startIndex: 1,
                startOffset: 5,
                endIndex: 1,
                endOffset: 5,
            }),
            getFixtures(),
        ).toJS(),
        [
            {
                text: 'Lorem ipsum dolor sit amet,',
                spans: [
                    { start: 0, end: 12, formats: {} },
                    { start: 12, end: 27, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: ' cons',
                spans: [
                    { start: 0, end: 5, formats: { i: { name: 'i', data: {} } } },
                ],
            },
            {
                text: 'ectetur adipiscing elit.',
                spans: [
                    { start: 0, end: 8, formats: { i: { name: 'i', data: {} } } },
                    { start: 8, end: 24, formats: {} },
                ],
            },
            {
                text: 'Aliquam accumsan cursus sem quis placerat.',
                spans: [
                    { start: 0, end: 30, formats: {} },
                    { start: 30, end: 38, formats: { i: { name: 'i', data: {} } } },
                    { start: 38, end: 42, formats: {} },
                ],
            },
        ],
    );
});

test('BlockList.fromJS', (assert) => {
    assert.plan(1);

    assert.equal(
        List.isList(
            BlockList.fromJS(
                [
                    {
                        text: 'Foobar',
                        spans: [
                            { start: 0, end: 6, formats: {} },
                        ],
                    },
                ],
            ),
        ),
        true,
    );
});
