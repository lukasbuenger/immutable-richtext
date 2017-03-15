import { Record, Map } from 'immutable';
import R from 'ramda';

import I from './utils/I';
import Range from './Range';
import Format from './Format';

const innerCreate = Record({
    start: 0,
    end: 0,
    formats: Map(),
}, 'Span');


const getStart = I.get('start');

const getEnd = I.get('end');

const setStart = I.set('start');

const setEnd = I.set('end');

const offsetStart = R.curry(
    (delta, span) =>
        I.update('start', x => x + delta, span),
);

const offsetEnd = R.curry(
    (delta, span) =>
        I.update('end', x => x + delta, span),
);

const offset = R.curry(
    (delta, span) =>
        R.compose(
            offsetStart(delta),
            offsetEnd(delta),
        )(span),
);

const asRange = R.props(['start', 'end']);

const getLength = R.compose(
    Range.getLength,
    asRange,
);

const isEmpty = span =>
    getLength(span) === 0;

const create = (props = {}) => {
    const span = innerCreate(props);
    if (!Range.isValid(asRange(span))) {
        throw new Error('Invalid Span detected!');
    }
    return span;
};

const getFormatMap = R.prop('formats');

const getPathFromFormatName = R.compose(
    R.prepend('formats'),
    R.of,
);

const getPathFromFormatRecord = R.compose(
    getPathFromFormatName,
    R.prop('name'),
);

const hasFormat = R.curryN(2,
    R.useWith(I.hasIn, [getPathFromFormatName, R.identity]),
);

const getFormatNames = R.compose(
    I.keySeq,
    getFormatMap,
);

const haveSameFormats = R.curryN(2,
    R.useWith(I.is, [getFormatNames, getFormatNames]),
);

const addFormat = R.curryN(2, R.compose(
    R.apply(I.setIn),
    R.useWith(R.concat, [
        format => [getPathFromFormatRecord(format), format],
        R.of,
    ]),
));

const removeFormat = R.curryN(2,
    R.useWith(I.removeIn, [getPathFromFormatName, R.identity]),
);

const fromJS = R.compose(
    create,
    R.evolve({
        formats: R.compose(
            R.construct(Map),
            R.map(R.construct(Format.fromJS)),
        ),
    }),
);

export default {
    getStart,
    getEnd,
    setStart,
    setEnd,
    offsetStart,
    offsetEnd,
    offset,
    asRange,
    getLength,
    isEmpty,
    hasFormat,
    getFormatNames,
    haveSameFormats,
    addFormat,
    removeFormat,
    fromJS,
    create,
};
