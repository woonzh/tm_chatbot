import React from "react";

import { Page, Table, ButtonRounded } from "../components";
import { connect } from "../redux";

const columns = [
  {
    id: "name",
    numeric: false,
    sortable: true,
    label: "Name",
    component: "th",
    scope: "row",
    render: (row, col, i) =>
      global.store.getState().User.nameFormat(row, "Not Set")
  },
  {
    id: "email",
    numeric: true,
    sortable: true,
    label: "Email",
    render: (row, col, i) => {
      const { username } = row;
      return username;
    }
  },
  {
    id: "groups",
    numeric: true,
    sortable: true,
    label: "Groups",
    render: (row, col, i) => {
      const { groupnames } = row;
      return groupnames.join(", ");
    }
  },
  {
    id: "actions",
    numeric: true,
    label: "Actions",
    hidden: true,
    render: (row, col, i) => {
      const { actionnames } = row;
      return actionnames.join(", ");
    }
  }
];

export class Users extends Page {
  get columns() {
    return columns.filter(o => !o.hidden);
  }
  get data() {
    return this.props.User.items;
  }

  async componentDidMount() {
    await super.componentDidMount();
    await this.props.api(this.props.apis.user.list);
  }

  onRowClick = async tblstate => {
    const { selected } = tblstate;
    if (selected.length) {
      const users = this.props.User.items;
      const userid = selected[0];
      const user = users.find(o => o.id === userid);
      if (user) {
        await this.props.userDetail(user);
        await this.props.api({
          ...this.props.apis.user.detail,
          path: [userid]
        });
        await this.props.history.push(`/users/${userid}`);
      }
    }
  };
  onSort = tblstate => {
    console.log(tblstate);
  };
  onChangePage = tblstate => {
    console.log(tblstate);
  };
  onChangePageSize = tblstate => {
    console.log(tblstate);
  };
  onSearch = async (tblstate, e) => {
    await this.props.userCriteria({
      search: tblstate.search,
      order: tblstate.order,
      orderBy: tblstate.orderBy
    });
  };
  onOpenCreateUserPage = () => this.props.history.push(`/users/new`);
  renderTable() {
    const { search, order, orderBy } = this.props.User.criteria;
    return (
      <Table
        title="Users"
        {...{ search, order, orderBy }}
        searchable={true}
        searchcols={this.columns}
        columns={this.columns}
        data={this.data}
        showCheckbox={false}
        onSearch={this.onSearch}
        onRowClick={this.onRowClick}
        onSort={this.onSort}
        onChangePage={this.onChangePage}
        onChangePageSize={this.onChangePageSize}
        actions={[
          <ButtonRounded
            key="add"
            title="Add User"
            icon="PersonAddRounded"
            onClick={this.onOpenCreateUserPage}
          />
        ]}
      />
    );
  }
  renderComponent() {
    return (
      <div className="page page-users">
        <div className="page-content">{this.renderTable()}</div>
      </div>
    );
  }
}

export default connect(Users);
