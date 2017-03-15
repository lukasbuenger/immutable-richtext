import test from 'tape';
import { Map } from 'immutable';

import I from './utils/I';

import Format from './Format';
import Span from './Span';
import SpanList from './SpanList';
import BlockText from './BlockText';
import Block from './Block';

const getFixtures = () =>
    Block.create({
        text: BlockText.create('Lorem ipsum dolor sit amet!'),
        spans: SpanList.create([
            Span.create({
                start: 0,
                end: 4,
            }),
            Span.create({
                start: 4,
                end: 9,
                formats: Map({
                    b: Format.create({
                        name: 'b',
                    }),
                    i: Format.create({
                        name: 'i',
                    }),
                }),
            }),
            Span.create({
                start: 9,
                end: 18,
                formats: Map({
                    i: Format.create({
                        name: 'i',
                    }),
                }),
            }),
            Span.create({
                start: 18,
                end: 22,
            }),
            Span.create({
                start: 22,
                end: 27,
                formats: Map({
                    i: Format.create({
                        name: 'i',
                    }),
                }),
            }),
        ]),
    });

test('Block.create', (assert) => {
    assert.plan(4);

    const defaultBlock = Block.create();
    const fixtures = getFixtures();

    assert.equal(
        Block.getBlockText(defaultBlock),
        '',
        'should return a block with an empty text per default',
    );

    assert.equal(
        SpanList.getLength(
            Block.getSpanList(defaultBlock),
        ),
        0,
        'should return a block with an span list of length 0 per default',
    );

    assert.equal(
        Block.getBlockText(fixtures),
        'Lorem ipsum dolor sit amet!',
        'should return a block with the given text',
    );

    assert.equal(
        SpanList.getLength(
            Block.getSpanList(fixtures),
        ),
        27,
        'should return a block with the given text',
    );
});

test('Block.createWithText', (assert) => {
    assert.plan(3);

    assert.equal(
        Block.getBlockText(
            Block.createWithText('Foobar'),
        ),
        'Foobar',
        'should return a new block with the given text',
    );

    assert.equal(
        SpanList.getSize(
            Block.getSpanList(
                Block.createWithText('Foobar'),
            ),
        ),
        1,
        'should return a block with a span list of size 1',
    );

    assert.deepEqual(
        Span.asRange(
            SpanList.getFirst(
                Block.getSpanList(
                    Block.createWithText('Foobar'),
                ),
            ),
        ),
        [0, 6],
        'should return a block with a span list containing only one span representing a range from 0 to length of text',
    );
});

test('Block.isEmpty', (assert) => {
    assert.plan(2);

    assert.equal(
        Block.isEmpty(
            Block.create(),
        ),
        true,
        'should return true if you pass it an empty block',
    );

    assert.equal(
        Block.isEmpty(
            Block.createWithText('foo'),
        ),
        false,
        'should return false if you pass it an non-empty block',
    );
});

test('Block.getLength', (assert) => {
    assert.plan(1);

    assert.equal(
        Block.getLength(getFixtures()),
        27,
        'should return the length of the text in this block',
    );
});

test('Block.insertTextAfterRange', (assert) => {
    assert.plan(4);

    const fixtures = getFixtures();

    assert.equal(
        Block.getLength(
            Block.insertTextAfterRange('really ', [6, 6], fixtures),
        ),
        34,
        'should return a new block with length extended by the inserted texts length',
    );

    assert.deepEqual(
        Span.asRange(
            SpanList.getAtIndex(
                1,
                Block.getSpanList(
                    Block.insertTextAfterRange('really ', [6, 6], fixtures),
                ),
            ),
        ),
        [4, 16],
        'should offset the end of the span containing the range by the inserted texts length',
    );

    assert.deepEqual(
        Span.asRange(
            SpanList.getAtIndex(
                2,
                Block.getSpanList(
                    Block.insertTextAfterRange('really ', [6, 6], fixtures),
                ),
            ),
        ),
        [16, 25],
        'should offset start and end any span after the range by the inserted texts length',
    );

    assert.equal(
        Block.getBlockText(
            Block.insertTextAfterRange('really ', [6, 6], fixtures),
        ),
        'Lorem really ipsum dolor sit amet!',
        'should insert the text at the given offset',
    );
});

test('Block.copyRange', (assert) => {
    assert.plan(3);

    const fixtures = getFixtures();

    assert.equal(
        Block.getBlockText(
            Block.copyRange(
                [6, 11],
                fixtures,
            ),
        ),
        'ipsum',
        'should return a block with the text that is in the given range',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.copyRange(
                    [6, 11],
                    fixtures,
                ),
            ),
        ).toJS(),
        [
            [0, 3],
            [3, 5],
        ],
        'should return a block containing the span structure in the range',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.copyRange(
                    [4, 8],
                    fixtures,
                ),
            ),
        ).toJS(),
        [
            [0, 4],
        ],
        'should return a block containing a normalizeed span list',
    );
});

test('Block.removeRange', (assert) => {
    assert.plan(3);

    const fixtures = getFixtures();

    assert.equal(
        Block.getBlockText(
            Block.removeRange(
                [6, 12],
                fixtures,
            ),
        ),
        'Lorem dolor sit amet!',
        'should return a new block representing the text without the range',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.removeRange(
                    [6, 12],
                    fixtures,
                ),
            ),
        ).toJS(),
        [
            [0, 4],
            [4, 6],
            [6, 12],
            [12, 16],
            [16, 21],
        ],
        'should return a new block containing the span structure without the range',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.removeRange(
                    [2, 21],
                    fixtures,
                ),
            ),
        ).toJS(),
        [
            [0, 3],
            [3, 8],
        ],
        'should return a new block with a normalized span list',
    );
});

test('Block.append', (assert) => {
    assert.plan(2);

    const fixtures = getFixtures();
    const fixturesToAppend = Block.createWithText('Consectetur adipiscing elit.');

    assert.equal(
        Block.getBlockText(
            Block.append(fixturesToAppend, fixtures),
        ),
        'Lorem ipsum dolor sit amet!Consectetur adipiscing elit.',
        'should return a new block with the new text appended',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.append(
                    fixturesToAppend,
                    fixtures,
                ),
            ),
        ).toJS(),
        [
            [0, 4],
            [4, 9],
            [9, 18],
            [18, 22],
            [22, 27],
            [27, 55],
        ],
        'should return a new block with a span list of both blocks combined',
    );
});

test('Block.prepend', (assert) => {
    assert.plan(2);

    const fixtures = getFixtures();
    const fixturesToPrepend = Block.createWithText('Consectetur adipiscing elit.');

    assert.equal(
        Block.getBlockText(
            Block.prepend(fixturesToPrepend, fixtures),
        ),
        'Consectetur adipiscing elit.Lorem ipsum dolor sit amet!',
        'should return a new block with the new text appended',
    );

    assert.deepEqual(
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.prepend(
                    fixturesToPrepend,
                    fixtures,
                ),
            ),
        ).toJS(),
        I.map(
            Span.asRange,
            Block.getSpanList(
                Block.append(
                    fixtures,
                    fixturesToPrepend,
                ),
            ),
        ).toJS(),
        'should return the inversed result of append',
    );
});

test('Block.fromJS', (assert) => {
    assert.plan(2);

    assert.equal(
        SpanList.getSize(
            Block.getSpanList(
                Block.fromJS({
                    text: 'FooBar',
                    spans: [
                        {
                            start: 0,
                            end: 3,
                        },
                        {
                            start: 3,
                            end: 6,
                        },
                    ],
                }),
            ),
        ),
        2,
        'should parse the span list',
    );

    assert.equal(
        Block.getBlockText(
            Block.fromJS({
                text: 'FooBar',
                spans: [
                    {
                        start: 0,
                        end: 3,
                    },
                    {
                        start: 3,
                        end: 6,
                    },
                ],
            }),
        ),
        'FooBar',
        'should parse the text',
    );
});
