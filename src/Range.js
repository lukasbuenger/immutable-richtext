import R from 'ramda';

const isValid = ([start, end]) =>
    start >= 0 && end >= 0 && start <= end;

const create = (start = 0, end = 0) => {
    const range = [start, end];
    if (!isValid(range)) {
        throw new Error('Invalid Range detected!');
    }
    return range;
};

const getLength = ([start, end]) =>
    end - start;

const getStart = ([start, end]) => // eslint-disable-line no-unused-vars
    start;

const getEnd = ([start, end]) => // eslint-disable-line no-unused-vars
    end;

const isBefore = R.curry(
    ([startB, endB], [startA, endA]) => // eslint-disable-line no-unused-vars
        startB >= endA,
);

const isAfter = R.curry(
    ([startB, endB], [startA, endA]) =>  // eslint-disable-line no-unused-vars
        endB <= startA && startB < startA,
);

const isInside = R.curry(
    ([startB, endB], [startA, endA]) =>
        startB < startA && endB > endA,
);

const isInsideOrEqual = R.curry(
    ([startB, endB], [startA, endA]) =>
    startB <= startA && endB >= endA,
);

const contains = R.curry(
    ([startB, endB], [startA, endA]) =>
        startA < startB && endA > endB,
);

const containsOrEqual = R.curry(
    ([startB, endB], [startA, endA]) =>
        startA <= startB && endA >= endB,
);

const equals = R.curry(
    ([startB, endB], [startA, endA]) =>
        startB === startA && endB === endA,
);

const intersectsStart = R.curry(
    ([startB, endB], [startA, endA]) =>
        startB >= startA && endB > endA && startB < endA,
);

const intersectsEnd = R.curry(
    ([startB, endB], [startA, endA]) =>
        startB <= startA && endB < endA && endB > startA,
);

export default {
    isValid,
    create,
    getLength,
    getStart,
    getEnd,
    isBefore,
    isAfter,
    isInside,
    isInsideOrEqual,
    contains,
    containsOrEqual,
    equals,
    intersectsStart,
    intersectsEnd,
};
