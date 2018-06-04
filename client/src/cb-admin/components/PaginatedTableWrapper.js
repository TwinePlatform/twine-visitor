import React from 'react';
import PropTypes from 'prop-types';
import Paginate from 'react-paginate';
import styled from 'styled-components';

const FullWidthWrapper = styled.div`
  width: 100%;
`;


export default class PaginatedTableWrapper extends React.Component {
  static propTypes = {
    rowCount: PropTypes.number.isRequired, // eslint-disable-line
    loadRows: PropTypes.func.isRequired,
    rowsPerPage: PropTypes.number,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    rowsPerPage: 10,
  }

  static getDerivedStateFromProps(nextProps) { // eslint-disable-line
    return { totalPages: Math.ceil(nextProps.rowCount / nextProps.rowsPerPage) };
  }

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.loadRows();
  }

  onPageChange = ({ selected }) =>
    this.setState(
      { offset: Math.ceil(selected * this.props.rowsPerPage) },
      this.loadRows,
    )

  loadRows = () => this.props.loadRows(this.state.offset)

  render() {
    const Table = React.Children.only(this.props.children);

    return (
      <FullWidthWrapper>
        {
          Table
        }
        <Paginate
          pageCount={this.state.totalPages}
          pageRangeDisplayed={4}
          marginPagesDisplayed={1}
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          onPageChange={this.onPageChange}
          breakClassName="rpg-break"
          containerClassName="rpg-container"
          pageClassName="rpg-page"
          pageLinkClassName="rpg-pageLink"
          activeClassName="rpg-active"
          previousClassName="rpg-previous"
          nextClassName="rpg-next"
          previousLinkClassName="rpg-previousLink"
          nextLinkClassName="rpg-nextLink"
          disabledClassName="rpg-disabled"
        />
      </FullWidthWrapper>
    );
  }
}
