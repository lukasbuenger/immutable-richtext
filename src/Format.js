import { Record, Map, fromJS as ImmutableFromJS } from 'immutable';
import R from 'ramda';

const innerCreate = Record({
    name: '',
    data: Map(),
}, 'Format');

const create = (props = {}) => {
    const format = innerCreate(props);
    if (format.name === '') {
        throw new Error('Please provide a valid format name!');
    }
    return format;
};

const fromJS = R.compose(
    create,
    R.evolve({
        data: ImmutableFromJS,
    }),
);

export default {
    create,
    fromJS,
};
