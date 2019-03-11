import React, { Component } from "react";

import { connect } from "../redux";

import { Button, Form } from "./core";

export class CatForm extends Component {
  state = { name: "", description: "" };
  render() {
    const { name, description } = this.state;
    return (
      <Form className="form-add-category">
        <h3 className="horizontal center middle fullW firstline">
          New Category
          <div className="space" />
          <div className="actions">
            <Button
              circle
              small
              icon="fas fa-save"
              onClick={async e => {
                const { error } = await this.props.api(
                  this.props.apis.category.create,
                  this.state
                );
                if (!error)
                  this.props.notificationNotify(
                    `Category '${this.state.name}' has been created`
                  );
              }}
            />
            <Button
              circle
              small
              icon="fas fa-times"
              onClick={e => this.props.popupRemoveLast()}
            />
          </div>
        </h3>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <textarea
          placeholder="description"
          value={description}
          onChange={e => this.setState({ description: e.target.value })}
        />
      </Form>
    );
  }
}
export default connect(CatForm);
