import test from 'tape'
import { List, Map, Seq } from 'immutable'

import SpanList from './SpanList'
import Span from './Span'
import Format from './Format'

const getFixtures = () =>
  SpanList.create([
    Span.create({
      start: 0,
      end: 4
    }),
    Span.create({
      start: 4,
      end: 9,
      formats: Map({
        b: Format.create({
          name: 'b'
        }),
        i: Format.create({
          name: 'i'
        })
      })
    }),
    Span.create({
      start: 9,
      end: 13,
      formats: Map({
        i: Format.create({
          name: 'i'
        })
      })
    }),
    Span.create({
      start: 13,
      end: 15
    })
  ])

test('SpanList.create', assert => {
  assert.plan(4)

  assert.equal(
    List.isList(SpanList.create()),
    true,
    'should return a new span list of type List'
  )

  assert.equal(
    SpanList.getSize(SpanList.create()),
    1,
    'should return a new span list with at least one span by default'
  )

  const span = Span.create()

  assert.equal(
    SpanList.getFirst(SpanList.create([span])),
    span,
    'should accept a passed list of spans'
  )

  assert.throws(
    () => SpanList.create([]),
    Error,
    'should throw if created with no spans'
  )
})

test('SpanList.getSize', assert => {
  assert.plan(1)

  assert.equal(
    SpanList.getSize(SpanList.create([1, 2, 3])),
    3,
    'should return the number of items in the list'
  )
})

test('SpanList.getLength', assert => {
  assert.plan(1)

  assert.equal(
    SpanList.getLength(getFixtures()),
    15,
    'should return the end value of the last span in the list'
  )
})

test('SpanList.getLastIndex', assert => {
  assert.plan(1)

  assert.equal(
    SpanList.getLastIndex(getFixtures()),
    3,
    'should return the index of the last span in the list'
  )
})

test('SpanList.getFirst', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getFirst(fixtures),
    fixtures.get(0),
    'should return the first span in the list'
  )
})

test('SpanList.getLast', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getLast(fixtures),
    fixtures.get(3),
    'should return the last span in the list'
  )
})

test('SpanList.getAtIndex', assert => {
  assert.plan(1)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getAtIndex(1, fixtures),
    fixtures.get(1),
    'should return the span at index'
  )
})

test('SpanList.isEmpty', assert => {
  assert.plan(3)

  assert.equal(
    SpanList.isEmpty(SpanList.create()),
    true,
    'should return true if the span list is of size 1 and its first span is empty too'
  )

  assert.equal(
    SpanList.isEmpty(
      SpanList.create([
        Span.create({ start: 0, end: 14 })
      ])
    ),
    false,
    'should return false if the span list is of size 1 but its first span is not empty'
  )

  assert.equal(
    SpanList.isEmpty(
      SpanList.create([
        Span.create({ start: 0, end: 0 }),
        Span.create({ start: 0, end: 14 })
      ])
    ),
    false,
    'should return false if the span list is not of size 1 although its first span is empty'
  )
})

test('SpanList.removeRange', assert => {
  assert.plan(7)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getFirst(
      SpanList.removeRange([6, 12])(fixtures)
    ),
    SpanList.getFirst(fixtures),
    'should not touch any spans before the given range'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getLast(
        SpanList.removeRange([6, 12], fixtures)
      )
    ),
    [7, 9],
    'should offset any spans after the given range by -1 * length of range'
  )

  assert.equal(
    SpanList.getSize(
      SpanList.removeRange([3, 12])(fixtures)
    ),
    3,
    'should remove any span that is inside the given range'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        1,
        SpanList.removeRange([5, 8], fixtures)
      )
    ),
    [4, 6],
    'should shorten a span that contains the given range by range length'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getFirst(
        SpanList.removeRange([2, 7], fixtures)
      )
    ),
    [0, 2],
    "should sets a spans end value to the range's start if the span intersects the given range start"
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getLast(
        SpanList.removeRange([8, 14], fixtures)
      )
    ),
    [8, 9],
    'should offset a spans end by -range length and set its start to range end if the span intersects the given range end'
  )

  assert.deepEqual(
    SpanList.removeRange(
      [2, 11],
      fixtures
    ).toJS(),
    [
      { start: 0, end: 2, formats: {} },
      {
        start: 2,
        end: 4,
        formats: { i: { name: 'i', data: {} } }
      },
      { start: 4, end: 6, formats: {} }
    ]
  )
})

test('SpanList.copyRange', assert => {
  assert.plan(12)

  const fixtures = getFixtures()

  assert.notEqual(
    SpanList.getFirst(
      SpanList.copyRange([5, 11])(fixtures)
    ),
    SpanList.getFirst(fixtures),
    'should skip any spans before the given range'
  )

  assert.notEqual(
    SpanList.getLast(
      SpanList.copyRange([5, 11])(fixtures)
    ),
    SpanList.getLast(fixtures),
    'should skip any spans after the given range'
  )

  assert.equal(
    Span.getStart(
      SpanList.getAtIndex(
        1,
        SpanList.copyRange([2, 11], fixtures)
      )
    ),
    2,
    "should offset the start value of any span inside the given range by -1 * the range's start"
  )

  assert.equal(
    Span.getEnd(
      SpanList.getAtIndex(
        1,
        SpanList.copyRange([2, 11], fixtures)
      )
    ),
    7,
    "should offset the end value of any span inside the given range by -1 * the range's start"
  )

  assert.equal(
    SpanList.getSize(
      SpanList.copyRange([5, 8], fixtures)
    ),
    1,
    'should return a list of size 1 if a span contains the range'
  )

  assert.equal(
    Span.getStart(
      SpanList.getFirst(
        SpanList.copyRange([5, 8], fixtures)
      )
    ),
    0,
    'should return a single span list with the span having start value of 0 if a span contains the range'
  )

  assert.equal(
    Span.getEnd(
      SpanList.getFirst(
        SpanList.copyRange([5, 8], fixtures)
      )
    ),
    3,
    'should return a single span list with the span having end value of range length if a span contains the range'
  )

  assert.equal(
    Span.getStart(
      SpanList.getFirst(
        SpanList.copyRange([2, 7], fixtures)
      )
    ),
    0,
    'should set a spans start to 0 if it intersects the range start'
  )

  assert.equal(
    Span.getEnd(
      SpanList.getFirst(
        SpanList.copyRange([2, 7], fixtures)
      )
    ),
    2,
    'should set a spans end to span end - range start if it intersects the range start'
  )

  assert.equal(
    Span.getStart(
      SpanList.getAtIndex(
        1,
        SpanList.copyRange([2, 7], fixtures)
      )
    ),
    2,
    'should set a spans start to span end - range start if it intersects the range end'
  )

  assert.equal(
    Span.getEnd(
      SpanList.getAtIndex(
        1,
        SpanList.copyRange([2, 7], fixtures)
      )
    ),
    5,
    'should set a spans end to range length if it intersects the range end'
  )

  assert.deepEqual(
    SpanList.copyRange([2, 11], fixtures).toJS(),
    [
      { start: 0, end: 2, formats: {} },
      {
        start: 2,
        end: 7,
        formats: {
          i: { name: 'i', data: {} },
          b: { name: 'b', data: {} }
        }
      },
      {
        start: 7,
        end: 9,
        formats: { i: { name: 'i', data: {} } }
      }
    ]
  )
})

test('SpanList.splitAtRange', assert => {
  assert.plan(11)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getAtIndex(
      0,
      SpanList.splitAtRange([5, 11], fixtures)
    ),
    SpanList.getAtIndex(0, fixtures),
    'should leave any spans before the range untouched'
  )

  assert.equal(
    SpanList.getLast(
      SpanList.splitAtRange([5, 11], fixtures)
    ),
    SpanList.getLast(fixtures),
    'should leave any spans after the range untouched'
  )

  assert.equal(
    SpanList.getAtIndex(
      5,
      SpanList.splitAtRange([2, 11], fixtures)
    ),
    SpanList.getAtIndex(3, fixtures),
    'should leave any spans inside the range untouched'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getFirst(
        SpanList.splitAtRange([2, 11], fixtures)
      )
    ),
    [0, 2],
    'should return two spans when one intersects the range start, with the first having its end set to range start'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        1,
        SpanList.splitAtRange([2, 11], fixtures)
      )
    ),
    [2, 4],
    'should return two spans when one intersects the range start, with the second having its start set to range start'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        3,
        SpanList.splitAtRange([2, 11], fixtures)
      )
    ),
    [9, 11],
    'should return two spans when one intersects the range end, with the first having its end set to range end'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        4,
        SpanList.splitAtRange([2, 11], fixtures)
      )
    ),
    [11, 13],
    'should return two spans when one intersects the range end, with the second having its start set to range end'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        1,
        SpanList.splitAtRange([6, 8], fixtures)
      )
    ),
    [4, 6],
    'should three spans when one contains the range, with the first having its end set to range start'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        2,
        SpanList.splitAtRange([6, 8], fixtures)
      )
    ),
    [6, 8],
    'should three spans when one contains the range, with the middle having the same start and end values as the range'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        3,
        SpanList.splitAtRange([6, 8], fixtures)
      )
    ),
    [8, 9],
    'should three spans when one contains the range, with the third having its start set to range end'
  )

  assert.deepEqual(
    SpanList.splitAtRange(
      [2, 11],
      fixtures
    ).toJS(),
    [
      { start: 0, end: 2, formats: {} },
      { start: 2, end: 4, formats: {} },
      {
        start: 4,
        end: 9,
        formats: {
          i: { name: 'i', data: {} },
          b: { name: 'b', data: {} }
        }
      },
      {
        start: 9,
        end: 11,
        formats: { i: { name: 'i', data: {} } }
      },
      {
        start: 11,
        end: 13,
        formats: { i: { name: 'i', data: {} } }
      },
      { start: 13, end: 15, formats: {} }
    ]
  )
})

test('SpanList.offsetAll', assert => {
  assert.plan(1)

  assert.deepEqual(
    SpanList.offsetAll(2, getFixtures()).toJS(),
    [
      { start: 2, end: 6, formats: {} },
      {
        start: 6,
        end: 11,
        formats: {
          i: { name: 'i', data: {} },
          b: { name: 'b', data: {} }
        }
      },
      {
        start: 11,
        end: 15,
        formats: { i: { name: 'i', data: {} } }
      },
      { start: 15, end: 17, formats: {} }
    ],
    'should return a span list with all containing spans offset by the given value'
  )
})

test('SpanList.mapInRange', assert => {
  assert.plan(8)

  const fixtures = getFixtures()
  const format = Format.create({ name: 'a' })

  const mapper = span =>
    Span.addFormat(format, span)

  assert.equal(
    SpanList.getFirst(
      SpanList.mapInRange(
        true,
        mapper,
        [5, 8],
        fixtures
      )
    ),
    SpanList.getFirst(fixtures),
    'should never touch any span before the range'
  )

  assert.equal(
    SpanList.getLast(
      SpanList.mapInRange(
        true,
        mapper,
        [5, 8],
        fixtures
      )
    ),
    SpanList.getLast(fixtures),
    'should never touch any span after the range'
  )

  assert.equal(
    SpanList.getAtIndex(
      1,
      SpanList.mapInRange(
        false,
        mapper,
        [5, 10],
        fixtures
      )
    ),
    SpanList.getAtIndex(1, fixtures),
    'should never touch spans that intersect range start when lazy = false'
  )

  assert.equal(
    Span.hasFormat(
      'a',
      SpanList.getAtIndex(
        1,
        SpanList.mapInRange(
          true,
          mapper,
          [5, 10],
          fixtures
        )
      )
    ),
    true,
    'should touch spans that intersect range start when lazy = true'
  )

  assert.equal(
    SpanList.getAtIndex(
      2,
      SpanList.mapInRange(
        false,
        mapper,
        [5, 10],
        fixtures
      )
    ),
    SpanList.getAtIndex(2, fixtures),
    'should never touch spans that intersect range end when lazy = false'
  )

  assert.equal(
    Span.hasFormat(
      'a',
      SpanList.getAtIndex(
        2,
        SpanList.mapInRange(
          true,
          mapper,
          [5, 10],
          fixtures
        )
      )
    ),
    true,
    'should touch spans that intersect range end when lazy = true'
  )

  assert.equal(
    SpanList.getAtIndex(
      2,
      SpanList.mapInRange(
        false,
        mapper,
        [5, 8],
        fixtures
      )
    ),
    SpanList.getAtIndex(2, fixtures),
    'should never touch spans that contain the range end when lazy = false'
  )

  assert.equal(
    Span.hasFormat(
      'a',
      SpanList.getAtIndex(
        1,
        SpanList.mapInRange(
          true,
          mapper,
          [5, 8],
          fixtures
        )
      )
    ),
    true,
    'should touch spans that contain the range when lazy = true'
  )
})

test('SpanList.reduceInRange', assert => {
  assert.plan(2)

  const reducer = (acc, span) =>
    acc.concat(Span.getFormatNames(span))

  assert.deepEqual(
    SpanList.reduceInRange(
      false,
      reducer,
      Seq(),
      [2, 12],
      getFixtures()
    ).toJS(),
    ['b', 'i']
  )

  assert.deepEqual(
    SpanList.reduceInRange(
      true,
      reducer,
      Seq(),
      [2, 12],
      getFixtures()
    ).toJS(),
    ['b', 'i', 'i']
  )
})

test('SpanList.offsetAfterRange', assert => {
  assert.plan(7)

  const fixtures = getFixtures()

  assert.equal(
    SpanList.getFirst(
      SpanList.offsetAfterRange(
        5,
        [5, 5],
        fixtures
      )
    ),
    SpanList.getFirst(fixtures),
    'should never touch spans before the range'
  )

  assert.equal(
    SpanList.getAtIndex(
      1,
      SpanList.offsetAfterRange(
        5,
        [3, 11],
        fixtures
      )
    ),
    SpanList.getAtIndex(1, fixtures),
    'should never touch spans that are inside a range'
  )

  assert.equal(
    SpanList.getAtIndex(
      1,
      SpanList.offsetAfterRange(
        5,
        [5, 11],
        fixtures
      )
    ),
    SpanList.getAtIndex(1, fixtures),
    'should never touch spans that intersect range start'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        1,
        SpanList.offsetAfterRange(
          5,
          [5, 5],
          fixtures
        )
      )
    ),
    [4, 14],
    'should only offset a spans end value if it contains the range'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        2,
        SpanList.offsetAfterRange(
          5,
          [5, 11],
          fixtures
        )
      )
    ),
    [9, 18],
    'should only offset a spans end value if it intersects the range end'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getLast(
        SpanList.offsetAfterRange(
          5,
          [5, 11],
          fixtures
        )
      )
    ),
    [18, 20],
    'should offset start and end values of a span after the range'
  )

  assert.deepEqual(
    SpanList.offsetAfterRange(
      2,
      [9, 9],
      fixtures
    ).toJS(),
    [
      { start: 0, end: 4, formats: {} },
      {
        start: 4,
        end: 9,
        formats: {
          i: { name: 'i', data: {} },
          b: { name: 'b', data: {} }
        }
      },
      {
        start: 9,
        end: 15,
        formats: { i: { name: 'i', data: {} } }
      },
      { start: 15, end: 17, formats: {} }
    ],
    'should offset only one span if the given range is between two spans'
  )
})

test('SpanList.normalize', assert => {
  assert.plan(2)

  const denormalizedFixtures = SpanList.create([
    Span.create({
      start: 0,
      end: 4
    }),
    Span.create({
      start: 4,
      end: 9,
      formats: Map({
        i: Format.create({
          name: 'i'
        })
      })
    }),
    Span.create({
      start: 9,
      end: 13,
      formats: Map({
        i: Format.create({
          name: 'i'
        })
      })
    }),
    Span.create({
      start: 13,
      end: 13
    }),
    Span.create({
      start: 13,
      end: 15
    })
  ])

  assert.deepEqual(
    SpanList.normalize(
      denormalizedFixtures
    ).toJS(),
    [
      { start: 0, end: 4, formats: {} },
      {
        start: 4,
        end: 13,
        formats: { i: { name: 'i', data: {} } }
      },
      { start: 13, end: 15, formats: {} }
    ],
    'should merge spans with matching format objects and remove spans with length = 0'
  )

  const emptySpanList = SpanList.create()

  assert.equal(
    SpanList.normalize(emptySpanList),
    emptySpanList,
    'should not modify the given span list if its empty'
  )
})

test('SpanList.append', assert => {
  assert.plan(3)

  const fixtures = getFixtures()
  const listToAppend = SpanList.create([
    Span.create({
      start: 0,
      end: 8
    }),
    Span.create({
      start: 8,
      end: 12
    })
  ])

  assert.equal(
    SpanList.getSize(
      SpanList.append(listToAppend, fixtures)
    ),
    6,
    'should return a new span list with the size being the sum of both lists sizes'
  )

  assert.equal(
    SpanList.getLength(
      SpanList.append(listToAppend, fixtures)
    ),
    27,
    'should return a new span list with the length being the sum of both list lenghts.'
  )

  assert.deepEqual(
    Span.asRange(
      SpanList.getAtIndex(
        4,
        SpanList.append(listToAppend, fixtures)
      )
    ),
    [15, 23],
    'should offset all spans in the appended list by the given lists length'
  )
})

test('SpanList.prepend', assert => {
  assert.plan(1)

  const fixtures = getFixtures()
  const listToPrepend = SpanList.create([
    Span.create({
      start: 0,
      end: 8
    }),
    Span.create({
      start: 8,
      end: 12
    })
  ])

  assert.deepEqual(
    SpanList.prepend(listToPrepend)(
      fixtures
    ).toJS(),
    SpanList.append(fixtures)(
      listToPrepend
    ).toJS(),
    'should return the same result as SpanList.append with inversed arguments'
  )
})

test('SpanList.fromJS', assert => {
  assert.plan(2)

  const fixtures = [
    {
      start: 0,
      end: 4
    },
    {
      start: 4,
      end: 11,
      formats: {
        a: {
          name: 'a'
        }
      }
    }
  ]

  assert.equal(
    List.isList(SpanList.fromJS(fixtures)),
    true,
    'should return a new list'
  )

  assert.equal(
    Span.hasFormat(
      'a',
      SpanList.getLast(SpanList.fromJS(fixtures))
    ),
    true,
    'should delegate span deserialization to Span.fromJS'
  )
})
