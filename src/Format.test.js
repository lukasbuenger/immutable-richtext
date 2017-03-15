import test from 'tape';
import { Map } from 'immutable';
import Format from './Format';


test('Format.create', (assert) => {
    assert.plan(3);

    assert.equal(
        Format.create({ name: 'foo' }).name,
        'foo',
        'should return a new Format record with the given name',
    );

    assert.equal(
        Map.isMap(Format.create({ name: 'foo' }).data),
        true,
        'should return a new Format record with an empty Map as data property',
    );

    assert.throws(
        () => Format.create(),
        /Please provide a valid format name!/,
        'should throw if no name was provided',
    );
});

test('Format.fromJS', (assert) => {
    assert.plan(4);

    const format = Format.fromJS({
        name: 'foo',
        data: {
            bar: 'baz',
        },
    });

    assert.equal(
        format.name,
        'foo',
        'should parse the name into the name property',
    );

    assert.equal(
        format.data instanceof Map,
        true,
        'should parse the data object into a Map',
    );

    assert.equal(
        format.data.has('bar'),
        true,
        'should parse the data object keys',
    );

    assert.equal(
        format.data.get('bar'),
        'baz',
        'should parse the data object values',
    );
});
