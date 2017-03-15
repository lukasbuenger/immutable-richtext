import test from 'tape';
import { Record, Map } from 'immutable';

import Span from './Span';
import Format from './Format';

test('Span.create', (assert) => {
    assert.plan(4);

    const defaultSpan = Span.create();
    const span = Span.create({ start: 12, end: 24 });

    assert.equal(
        defaultSpan.start === 0 && defaultSpan.end === 0,
        true,
        'should set start and end property to 0 by default',
    );

    assert.equal(
        Map.isMap(defaultSpan.formats),
        true,
        'should return an empty Map as default formats property',
    );

    assert.equal(
        span.start === 12 && span.end === 24,
        true,
        'should set start and end property to the passed values',
    );

    assert.throws(
        () => Span.create({ start: 24, end: 12 }),
        Error,
        'should throw if not a valid Range',
    );
});

test('Span.getStart', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 0, end: 12 });

    assert.equal(
        Span.getStart(span),
        0,
        'should return the value of the start property',
    );
});

test('Span.getEnd', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 0, end: 12 });

    assert.equal(
        Span.getEnd(span),
        12,
        'should return the value of the end property',
    );
});

test('Span.setStart', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 0, end: 12 });

    assert.equal(
        Span.getStart(Span.setStart(4, span)),
        4,
        'should return a new span with the given start value',
    );
});

test('Span.setEnd', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 0, end: 12 });

    assert.equal(
        Span.getEnd(Span.setEnd(14, span)),
        14,
        'should return a new span with the given end value',
    );
});

test('Span.offsetStart', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 2, end: 12 });

    assert.equal(
        Span.getStart(Span.offsetStart(4, span)),
        6,
        'should return a new span with the start value offset by the given delta',
    );
});

test('Span.offsetEnd', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 2, end: 12 });

    assert.equal(
        Span.getEnd(Span.offsetEnd(-4, span)),
        8,
        'should return a new span with the end value offset by the given delta',
    );
});

test('Span.offset', (assert) => {
    assert.plan(1);

    const span = Span.create({ start: 2, end: 12 });

    assert.deepEqual(
        Span.asRange(Span.offset(4, span)),
        [6, 16],
        'should return new span with both start and end values offset by the given delta',
    );
});

test('Span.hasFormat', (assert) => {
    assert.plan(2);

    const span = Span.create({
        formats: Map({
            foo: Format.create({ name: 'foo' }),
        }),
    });

    assert.equal(
        Span.hasFormat('foo')(span),
        true,
        'should return true if the span has a format with the given name/key',
    );

    assert.equal(
        Span.hasFormat('bar')(span),
        false,
        'should return false if the span has no format with the given name/key',
    );
});

test('Span.asRange', (assert) => {
    assert.plan(1);

    assert.deepEqual(
        Span.asRange(
            Span.create({ start: 4, end: 10 }),
        ),
        [4, 10],
        'should return a range array with the start and end value',
    );
});

test('Span.getLength', (assert) => {
    assert.plan(1);

    assert.equal(
        Span.getLength(
            Span.create({ start: 4, end: 10 }),
        ),
        6,
        'should return the delta between end and start',
    );
});

test('Span.isEmpty', (assert) => {
    assert.plan(2);

    assert.equal(
        Span.isEmpty(
            Span.create(),
        ),
        true,
        'should return true if the spans length is 0',
    );

    assert.equal(
        Span.isEmpty(
            Span.create({ start: 0, end: 2 }),
        ),
        false,
        'should return false if the spans length > 0',
    );
});

test('Span.haveSameFormats', (assert) => {
    assert.plan(3);

    const spanA = Span.create({
        formats: Map({
            foo: Format.create({ name: 'foo' }),
            bar: Format.create({ name: 'bar' }),
        }),
    });

    const spanB = Span.create({
        formats: Map({
            foo: Format.create({ name: 'foo' }),
            baz: Format.create({ name: 'baz' }),
        }),
    });

    const spanC = Span.create({
        formats: Map({
            foo: Format.create({ name: 'foo' }),
            bar: Format.create({ name: 'bar' }),
            baz: Format.create({ name: 'baz' }),
        }),
    });

    assert.equal(
        Span.haveSameFormats(spanA)(spanA),
        true,
        'should return true if both spans have exactly the same formats',
    );

    assert.equal(
        Span.haveSameFormats(spanB)(spanA),
        false,
        'should return false if the spans have not the same formats',
    );

    assert.equal(
        Span.haveSameFormats(spanC)(spanA),
        false,
        'should return false if the spans have a different number of formats',
    );
});

test('Span.addFormat', (assert) => {
    assert.plan(2);

    const format = Format.create({ name: 'foo' });
    const spanWithFormat = Span.addFormat(format)(Span.create());

    assert.equal(
        spanWithFormat.formats.has('foo'),
        true,
        'should return a span that has the format name as key in its formats map',
    );

    assert.equal(
        spanWithFormat.formats.get('foo'),
        format,
        'should return a span that has the format as value at key in its formats map',
    );
});

test('Span.removeFormat', (assert) => {
    assert.plan(1);

    const format = Format.create({ name: 'foo' });
    const spanWithFormat = Span.addFormat(format)(Span.create());
    const spanWithoutFormat = Span.removeFormat('foo')(spanWithFormat);

    assert.equal(
        spanWithoutFormat.formats.has('foo'),
        false,
        'should return a span without the given format',
    );
});

test('Span.fromJS', (assert) => {
    assert.plan(3);

    const span = Span.fromJS({
        start: 1,
        end: 12,
        formats: {
            foo: {
                name: 'foo',
                data: {
                    bar: 'baz',
                },
            },
        },
    });

    assert.equal(
        span.start === 1 && span.end === 12,
        true,
        'should parse start and end properties acoordingly',
    );

    assert.equal(
        span.formats.size,
        1,
        'should parse the format property into a Map with correct size',
    );

    assert.equal(
        span.formats.get('foo') instanceof Record,
        true,
        'should create a Format record for each key in the formats property',
    );
});
