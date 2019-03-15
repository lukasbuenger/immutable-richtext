import test from 'tape'
import Range from './Range'

test('Range.isValid', assert => {
  assert.plan(3)

  assert.equal(
    Range.isValid([1, 3]),
    true,
    'should return true if start and end are >= 0 and start <= end.'
  )

  assert.equal(
    Range.isValid([-1, 3]) ||
      Range.isValid([1, -3]),
    false,
    'should return false if either start or end are < 0'
  )

  assert.equal(
    Range.isValid([3, 1]),
    false,
    'should return false if end < start'
  )
})

test('Range.create', assert => {
  assert.plan(3)

  assert.deepEqual(
    Range.create(),
    [0, 0],
    'should return a [0, 0] tuple by default'
  )

  assert.deepEqual(
    Range.create(0, 2),
    [0, 2],
    'should return a tuple of shape [start, end]'
  )

  assert.throws(
    () => Range.create(4, 2),
    Error,
    'should throw if start > end'
  )
})

test('Range.getLength', assert => {
  assert.plan(1)

  assert.equal(
    Range.getLength([2, 4]),
    2,
    'should return end - start'
  )
})

test('Range.isBefore', assert => {
  assert.plan(3)

  assert.equal(
    Range.isBefore([20, 37])([1, 17]),
    true,
    'should return true if endA < startB'
  )

  assert.equal(
    Range.isBefore([17, 37])([1, 17]),
    true,
    'should return true if endA = startB'
  )

  assert.equal(
    Range.isBefore([17, 37])([17, 37]),
    false,
    'should return true if endA > startB'
  )
})

test('Range.isAfter', assert => {
  assert.plan(3)

  assert.equal(
    Range.isAfter([5, 16])([16, 31]),
    true,
    'should return true if startA >= endB and startA > startB'
  )

  assert.equal(
    Range.isAfter([0, 0])([0, 0]),
    false,
    'should return false if startA >= endB but startA = startB'
  )

  assert.equal(
    Range.isAfter([6, 16])([15, 28]),
    false,
    'should return false if startA <= endB'
  )
})

test('Range.isInside', assert => {
  assert.plan(3)

  assert.equal(
    Range.isInside([1, 5])([2, 4]),
    true,
    'should return true if startA > startB and endA < endB'
  )

  assert.equal(
    Range.isInside([1, 5])([0, 4]),
    false,
    'should return false if startA < startB although endA < endB'
  )

  assert.equal(
    Range.isInside([1, 5])([2, 6]),
    false,
    'should return false if startA > startB but endA > endB'
  )
})

test('Range.contains', assert => {
  assert.plan(3)

  assert.equal(
    Range.contains([2, 4])([1, 5]),
    true,
    'should return true if startA < startB and endA > endB'
  )

  assert.equal(
    Range.contains([0, 4])([1, 5]),
    false,
    'should return false if startA > startB although endB < endA'
  )

  assert.equal(
    Range.contains([2, 6])([1, 5]),
    false,
    'should return false if startA < startB but endB > endA'
  )
})

test('Range.isInsideOrEqual', assert => {
  assert.plan(5)

  assert.equal(
    Range.isInsideOrEqual([1, 5], [2, 4]),
    true,
    'should return true of if range a inside range b'
  )

  assert.equal(
    Range.isInsideOrEqual([1, 5], [1, 4]),
    true,
    'should return true of if startA equals startB'
  )

  assert.equal(
    Range.isInsideOrEqual([1, 5], [2, 5]),
    true,
    'should return true of if endA equals endB'
  )

  assert.equal(
    Range.isInsideOrEqual([1, 5], [1, 5]),
    true,
    'should return true of if range A equals  range B'
  )

  assert.equal(
    Range.isInsideOrEqual([6, 12], [9, 13]),
    false
  )
})

test('Range.containsOrEqual', assert => {
  assert.plan(4)

  assert.equal(
    Range.containsOrEqual([2, 4], [1, 5]),
    true,
    'should return true of if range a contains range b'
  )

  assert.equal(
    Range.containsOrEqual([1, 4], [1, 5]),
    true,
    'should return true of if startA equals startB'
  )

  assert.equal(
    Range.containsOrEqual([2, 5], [1, 5]),
    true,
    'should return true of if endA equals endB'
  )

  assert.equal(
    Range.containsOrEqual([1, 5], [1, 5]),
    true,
    'should return true of if range A equals  range B'
  )
})

test('Range.equals', assert => {
  assert.plan(3)

  assert.equal(
    Range.equals([2, 4])([2, 4]),
    true,
    'should return true if startA = startB and endA = endB'
  )

  assert.equal(
    Range.equals([0, 4])([1, 4]),
    false,
    'should return false if startA != startB although endB = endA'
  )

  assert.equal(
    Range.equals([2, 6])([2, 4]),
    false,
    'should return false if startA = startB but endB != endA'
  )
})

test('Range.intersectsStart', assert => {
  assert.plan(4)

  assert.equal(
    Range.intersectsStart([14, 21])([12, 20]),
    true,
    'should return true if startA <= startB and endA < endB'
  )

  assert.equal(
    Range.intersectsStart([14, 21])([12, 21]),
    false,
    'should return false if startA <= startB but endA >= endB'
  )

  assert.equal(
    Range.intersectsStart([14, 21])([16, 20]),
    false,
    'should return false if endA < endB but startA > startB'
  )

  assert.equal(
    Range.intersectsStart([6, 10])([0, 4]),
    false,
    'should return false if endA < endB and startA < startB'
  )
})

test('Range.intersectsEnd', assert => {
  assert.plan(4)

  assert.equal(
    Range.intersectsEnd([14, 21])([16, 22]),
    true,
    'should return true if startA >= startB and endA > endB'
  )

  assert.equal(
    Range.intersectsEnd([14, 21])([16, 21]),
    false,
    'should return false if startA >= startB but endA <= endB'
  )

  assert.equal(
    Range.intersectsEnd([14, 21])([13, 22]),
    false,
    'should return false if endA > endB but startA < startB'
  )

  assert.equal(
    Range.intersectsEnd([6, 10])([13, 15]),
    false,
    'should return false if endA > endB and startA > endB'
  )
})
