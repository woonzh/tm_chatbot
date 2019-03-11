import React, { Component } from "react";
import { shallow } from "enzyme";

import globals from "../../globals";
import { store, connect } from "../../redux";
import * as models from "../../models";

class DummyComponent extends Component {
  render() {
    return <div />;
  }
}

const ConnectedDummyComponent = connect(DummyComponent);

describe("<ConnectedDummyComponent /> component", () => {
  let wrapper;
  let instance;
  let dummyCmp;

  beforeAll(() => {
    wrapper = shallow(<ConnectedDummyComponent />, { context: { store } });
    dummyCmp = wrapper.dive();
    instance = dummyCmp.instance();
  });

  test("test props has proper attributes", async () => {
    const expectations = Object.keys(models);
    const obj = instance.props;
    await Promise.all(
      expectations.map(o => {
        if (o !== "normalizeNodes")
          return expect(obj.hasOwnProperty(o)).toBe(true);
      })
    );
  });
});
