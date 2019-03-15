import { List } from 'immutable'
import R from 'ramda'
import I from './utils/I'

import Range from './Range'
import Span from './Span'

const getSize = R.prop('size')

const isValid = spanList => getSize(spanList) > 0

const create = spans => {
  const spanList = List(spans || [Span.create()])
  if (!isValid(spanList)) {
    throw new Error('Invalid SpanList detected!')
  }
  return spanList
}

const getLastIndex = R.compose(
  R.dec,
  getSize
)

const getFirst = I.first

const getLast = I.last

const getAtIndex = I.get

const getLength = R.compose(
  Span.getEnd,
  I.last
)

const isEmpty = spanList =>
  getSize(spanList) === 1 &&
  Span.isEmpty(getFirst(spanList))

const removeReducer = range => (
  newSpanList,
  span
) => {
  const spanRange = Span.asRange(span)

  if (Range.isBefore(range, spanRange)) {
    return I.push(span, newSpanList)
  } else if (Range.isAfter(range, spanRange)) {
    return I.push(
      Span.offset(
        -1 * Range.getLength(range),
        span
      ),
      newSpanList
    )
  } else if (
    Range.isInsideOrEqual(range, spanRange)
  ) {
    return newSpanList
  } else if (
    Range.containsOrEqual(range, spanRange)
  ) {
    return I.push(
      Span.offsetEnd(
        -1 * Range.getLength(range),
        span
      ),
      newSpanList
    )
  } else if (
    Range.intersectsStart(range, spanRange)
  ) {
    return I.push(
      Span.setEnd(Range.getStart(range), span),
      newSpanList
    )
  } else if (
    Range.intersectsEnd(range, spanRange)
  ) {
    return I.push(
      Span.setStart(
        Range.getStart(range),
        Span.offsetEnd(
          -1 * Range.getLength(range),
          span
        )
      ),
      newSpanList
    )
  }
  return newSpanList
}

const removeRange = R.curry((range, spanList) =>
  I.reduce(removeReducer(range), List(), spanList)
)

const copyReducer = range => (
  newSpanList,
  span
) => {
  const spanRange = Span.asRange(span)

  if (
    Range.isBefore(range, spanRange) ||
    Range.isAfter(range, spanRange)
  ) {
    return newSpanList
  } else if (
    Range.isInsideOrEqual(range, spanRange)
  ) {
    return I.push(
      Span.offset(
        -1 * Range.getStart(range),
        span
      ),
      newSpanList
    )
  } else if (
    Range.containsOrEqual(range, spanRange)
  ) {
    return I.push(
      Span.setEnd(
        Range.getLength(range),
        Span.setStart(0, span)
      ),
      newSpanList
    )
  } else if (
    Range.intersectsStart(range, spanRange)
  ) {
    return I.push(
      Span.setEnd(
        Span.getEnd(span) - Range.getStart(range),
        Span.setStart(0, span)
      ),
      newSpanList
    )
  } else if (
    Range.intersectsEnd(range, spanRange)
  ) {
    return I.push(
      Span.setStart(
        Span.getStart(span) -
          Range.getStart(range),
        Span.setEnd(Range.getLength(range), span)
      ),
      newSpanList
    )
  }

  return newSpanList
}

const copyRange = R.curry((range, spanList) =>
  I.reduce(copyReducer(range), List(), spanList)
)

const splitReducer = range => (
  newSpanList,
  span
) => {
  const spanRange = Span.asRange(span)

  if (
    Range.isBefore(range, spanRange) ||
    Range.isAfter(range, spanRange) ||
    Range.isInsideOrEqual(range, spanRange)
  ) {
    return I.push(span, newSpanList)
  } else if (
    Range.intersectsStart(range, spanRange)
  ) {
    return I.concat(
      I.seqOf(
        Span.setEnd(Range.getStart(range), span),
        Span.setStart(Range.getStart(range), span)
      ),
      newSpanList
    )
  } else if (
    Range.intersectsEnd(range, spanRange)
  ) {
    return I.concat(
      I.seqOf(
        Span.setEnd(Range.getEnd(range), span),
        Span.setStart(Range.getEnd(range), span)
      ),
      newSpanList
    )
  } else if (
    Range.containsOrEqual(range, spanRange)
  ) {
    return I.concat(
      I.seqOf(
        Span.setEnd(Range.getStart(range), span),
        Span.setStart(
          Range.getStart(range),
          Span.setEnd(Range.getEnd(range), span)
        ),
        Span.setStart(Range.getEnd(range), span)
      ),
      newSpanList
    )
  }

  return newSpanList
}

const splitAtRange = R.curry((range, spanList) =>
  I.reduce(splitReducer(range), List(), spanList)
)

const offsetAll = R.curry((offset, spanList) =>
  I.map(Span.offset(offset), spanList)
)

const offsetMapper = (
  offset,
  range,
  lastContainingSpan
) => span => {
  const spanRange = Span.asRange(span)

  if (
    Range.intersectsEnd(range, spanRange) ||
    span === lastContainingSpan
  ) {
    return Span.offsetEnd(offset, span)
  } else if (Range.isAfter(range, spanRange)) {
    return Span.offset(offset, span)
  }
  return span
}

const offsetAfterRange = R.curry(
  (offset, range, spanList) =>
    I.map(
      offsetMapper(
        offset,
        range,
        I.findLast(
          span =>
            Range.containsOrEqual(
              range,
              Span.asRange(span)
            ),
          spanList
        )
      ),
      spanList
    )
)

const isInRange = (lazy, range, spanRange) =>
  Range.isInsideOrEqual(range, spanRange) ||
  (lazy &&
    (Range.containsOrEqual(range, spanRange) ||
      Range.intersectsStart(range, spanRange) ||
      Range.intersectsEnd(range, spanRange)))

const mapInRange = R.curry(
  (lazy, mapperFn, range, spanList) =>
    I.map(span => {
      return isInRange(
        lazy,
        range,
        Span.asRange(span)
      )
        ? mapperFn(span)
        : span
    }, spanList)
)

const reduceInRange = R.curry(
  (
    lazy,
    reducerFn,
    initialReduction,
    range,
    spanList
  ) =>
    I.reduce(
      (reduction, span) => {
        return isInRange(
          lazy,
          range,
          Span.asRange(span)
        )
          ? reducerFn(reduction, span)
          : reduction
      },
      initialReduction,
      spanList
    )
)

const append = R.curry((spanListB, spanListA) =>
  I.concat(
    offsetAll(getLength(spanListA), spanListB),
    spanListA
  )
)

const prepend = R.flip(append)

const normalizeReduzer = (newSpanList, span) => {
  const previousSpan = getLast(newSpanList)

  if (Span.isEmpty(span)) {
    return newSpanList
  } else if (
    !previousSpan ||
    !Span.haveSameFormats(previousSpan, span)
  ) {
    return I.push(span, newSpanList)
  }

  return I.set(
    getLastIndex(newSpanList),
    Span.setEnd(Span.getEnd(span), previousSpan),
    newSpanList
  )
}

const normalize = spanList => {
  return isEmpty(spanList)
    ? spanList
    : I.reduce(normalizeReduzer, List(), spanList)
}

const fromJS = spans =>
  create(spans.map(Span.fromJS))

export default {
  getSize,
  create,
  getLastIndex,
  getFirst,
  getLast,
  getAtIndex,
  getLength,
  isEmpty,
  removeRange,
  copyRange,
  splitAtRange,
  offsetAll,
  offsetAfterRange,
  mapInRange,
  reduceInRange,
  append,
  prepend,
  normalize,
  fromJS
}
