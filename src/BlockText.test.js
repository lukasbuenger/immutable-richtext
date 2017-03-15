import test from 'tape';
import BlockText from './BlockText';

test('BlockText.create', (assert) => {
    assert.plan(3);

    assert.equal(
        BlockText.create(),
        '',
        'should return an empty string if no argument was provided',
    );

    assert.equal(
        BlockText.create('FooBar'),
        'FooBar',
        'should return the passed string',
    );

    assert.throws(
        () => BlockText.create(12),
        Error,
        'should throw if not a valid string',
    );
});

test('BlockText.fromJS', (assert) => {
    assert.plan(3);

    assert.equal(
        BlockText.fromJS(),
        '',
        'should return an empty string if no argument was provided',
    );

    assert.equal(
        BlockText.fromJS('FooBar'),
        'FooBar',
        'should return the passed string',
    );

    assert.throws(
        () => BlockText.fromJS(12),
        Error,
        'should throw if not a valid string',
    );
});

test('BlockText.removeRange', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.removeRange(
            [4, 10],
            BlockText.create('Lorem ipsum dolor sit amet.'),
        ),
        'Lorem dolor sit amet.',
        'should return a string without the chars within the range',
    );
});

test('BlockText.copyRange', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.copyRange(
            [4, 10],
            BlockText.create('Lorem ipsum dolor sit amet.'),
        ),
        'm ipsu',
        'should return only the chars within the range',
    );
});

test('BlockText.insertAfterRange', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.insertAfterRange(
            ' really',
            [4, 11],
            BlockText.create('Lorem ipsum dolor sit amet.'),
        ),
        'Lorem ipsum really dolor sit amet.',
        ' should return a string with the given text inserted at range end',
    );
});

test('BlockText.isEmpty', (assert) => {
    assert.plan(2);

    assert.equal(
        BlockText.isEmpty(
            BlockText.create(),
        ),
        true,
        'should return true if the text length is 0',
    );

    assert.equal(
        BlockText.isEmpty(
            BlockText.create('Foobar'),
        ),
        false,
        'should return false if the text length is > 0',
    );
});

test('BlockText.append', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.append(
            ' And then some.',
            'Lorem ipsum dolor sit amet.',
        ),
        'Lorem ipsum dolor sit amet. And then some.',
        'Should return a string with the new text appended',
    );
});

test('BlockText.prepend', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.prepend(
            'Know this: ',
            'Lorem ipsum dolor sit amet.',
        ),
        'Know this: Lorem ipsum dolor sit amet.',
        'Should return a string with the new text prepended',
    );
});

test('BlockText.getLength', (assert) => {
    assert.plan(1);

    assert.equal(
        BlockText.getLength(
            BlockText.create('Lorem ipsum dolor sit amet.'),
        ),
        27,
        'should return the length of the given string',
    );
});
