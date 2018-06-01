import React from 'react';
import PropTypes from 'prop-types';
import styles from './DropdownSearch.module.scss';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { Text, Chip } from 'components';

const filterOptions = (filter, options) => {
  let result = [];
  let hashTable = {};

  filter.forEach(elem => {
    hashTable[elem.value] = true;
  });

  options.forEach(elem => {
    if (!hashTable[elem.value]) {
      result.push({ value: elem.value, label: elem.value });
    }
  });

  return result;
};

// props = options, onChange, placeholder
class DropdownSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: null,
      options: [],
      filters: []
    };

    this.onDropdownSelect = this.onDropdownSelect.bind(this);
    this.renderChips = this.renderChips.bind(this);
    this.closeChip = this.closeChip.bind(this);
  }

  componentDidMount() {
    this.setState({ options: this.props.options });
  }

  onDropdownSelect(e) {
    const { options } = this.props;
    const { filters, selection } = this.state;

    let tempFilters = filters.slice(0, filters.length);
    tempFilters.push({ value: e.value, label: e.value });
    let tempOptions = filterOptions(tempFilters, options);

    this.setState(
      { filters: tempFilters, selection: null, options: tempOptions },
      () => {
        this.props.onChange(this.state.filters);
      }
    );
  }

  closeChip(value) {
    const { filters } = this.state;
    const { options } = this.props;

    let tempFilters = filters
      .slice(0, filters.length)
      .filter(elem => elem.value !== value);
    let tempOptions = filterOptions(tempFilters, options);
    this.setState({ filters: tempFilters, options: tempOptions }, () => {
      this.props.onChange(this.state.filters);
    });
  }

  renderChips(data) {
    return data.map((elem, idx) => {
      return (
        <div className={`${styles.chip}`} key={'chip' + idx}>
          <Chip close onCloseClick={() => this.closeChip(elem.value)}>
            {elem.value}
          </Chip>
        </div>
      );
    });
  }

  clearFilters() {
    const { filters } = this.state;
    const { options } = this.props;

    let tempOptions = filterOptions([], options);
    this.setState({ filters: [], options: tempOptions }, () => {
      this.props.onChange(this.state.filters);
    });
  }

  render() {
    return (
      <div className={`${styles.dropdownSearch}`}>
        <Select
          name="DropdownSearch"
          options={this.state.options}
          onChange={this.onDropdownSelect}
          placeholder={this.props.placeholder}
        />
        <div>
          <div className={`${styles.chipBar}`}>
            {this.renderChips(this.state.filters)}
          </div>
        </div>
      </div>
    );
  }
}

DropdownSearch.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

DropdownSearch.defaultProps = {
  options: [],
  onChange: () => {},
  placeholder: 'Select one!!!'
};

export default DropdownSearch;