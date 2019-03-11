import React, { Component, Fragment } from "react";
import classNames from "classnames";

import { connect } from "../../redux";

import { CheckboxForm } from "..";

export class BotSearchBar extends Component {
  get categories() {
    return this.props.Category.getVisibleCategories();
  }
  get filter() {
    return this.props.Category.filter;
  }

  componentDidMount() {
    this.props.categoryFilter({
      owner: this.props.User.profile.id
    });
  }

  checkboxOptions = () => [
    {
      label: "Public",
      onChange: e =>
        this.props.categoryFilter({ showPublic: e.target.checked }),
      checked: this.filter.showPublic
    },
    {
      label: "My own",
      onChange: e => this.props.categoryFilter({ showMyOwn: e.target.checked }),
      checked: this.filter.showMyOwn
    }
  ];
  renderCheckboxForm() {
    return <CheckboxForm legend="" options={this.checkboxOptions()} />;
  }
  renderSearchBar() {
    const { q } = this.props.Category.filter;
    return (
      <div className="section section-bots-searchBar">
        <h4>Find by Searching</h4>
        <div className="section-description">
          You can enter keywords and names.
        </div>
        <input
          type="text"
          value={q}
          onChange={e => this.props.categoryFilter({ q: e.target.value })}
          placeholder="Example: Email, Image Recognition..."
        />
      </div>
    );
  }
  renderCategory() {
    const { categories, filter } = this;
    const { category } = filter;
    const className = classNames("cat-filter", category ? "" : "placeholder");
    return (
      <div className="section section-bots-filter">
        <h4>Find by Category</h4>
        <div className="section-description">
          Select the bot through the category filter.
        </div>
        <select
          className={className}
          value={category}
          onChange={e =>
            this.props.categoryFilter({ category: e.target.value })
          }
        >
          <option value="">Select All Categories</option>
          {categories.map(o => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  render() {
    if (this.props.Category.filter) {
      return (
        <Fragment>
          {this.renderCategory()}
          {this.renderSearchBar()}
          {this.renderCheckboxForm()}
        </Fragment>
      );
    } else return null;
  }
}
export default connect(BotSearchBar);
