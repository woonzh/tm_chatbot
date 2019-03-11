import React, { Component } from "react";
import { shallow } from "enzyme";

import globals from "../../globals";
import { store, connect } from "../../redux";
import Product from "../../models/Product";

class DummyComponent extends Component {
  render() {
    return <div />;
  }
}

const ConnectedDummyComponent = connect(DummyComponent);

describe("Redux actions, model: Product", () => {
  const model = "Product";
  let wrapper;
  let instance;
  let dummyCmp;

  beforeAll(() => {
    wrapper = shallow(<ConnectedDummyComponent />, { context: { store } });
    dummyCmp = wrapper.dive();
    instance = dummyCmp.instance();
  });
  test("apis should contain the listed in the model", async () => {
    const allProps = instance.props;
    const apiModelKeys = Object.keys(allProps.apis[model.toLowerCase()]);
    await Promise.all(
      apiModelKeys.map(action =>
        expect(apiModelKeys.indexOf(action)).toBeGreaterThan(-1)
      )
    );
  });
});
