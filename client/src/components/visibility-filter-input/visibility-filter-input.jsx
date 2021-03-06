import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { setFilter } from '../../actions/actions';
import './visibility-filter-input.scss';

/**
* Movie filter
* @function VisibilityFilterInput
* @param {func} props - setFilter props
* @returns {VisibilityFilterInput}
*/
function VisibilityFilterInput(props) {
  return (
    <Form.Control
      className="mb-3 filter-bar"
      onChange={e => props.setFilter(e.target.value)}
      value={props.visibilityFilter}
      placeholder="filter"
    />
  );
}

VisibilityFilterInput.propTypes = {
  setFilter: PropTypes.func,
};

export default connect(null, { setFilter })(VisibilityFilterInput)