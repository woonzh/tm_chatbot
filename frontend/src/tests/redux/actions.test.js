import React, { Component } from "react";
import { shallow } from "enzyme";

import globals from "../../globals";
import { store, connect } from "../../redux";
import PropertyPanelProduct from "../../models/PropertyPanelProduct";

class DummyComponent extends Component {
  render() {
    return <div />;
  }
}

const ConnectedDummyComponent = connect(DummyComponent);

describe("Redux actions", () => {
  let wrapper;
  let instance;
  let dummyCmp;

  beforeAll(() => {
    wrapper = shallow(<ConnectedDummyComponent />, { context: { store } });
    dummyCmp = wrapper.dive();
    instance = dummyCmp.instance();
  });
  test("PropertyPanelProduct should have the actions listed in the model", async () => {
    const allProps = instance.props;
    const model = "PropertyPanelProduct";
    const actionList = PropertyPanelProduct.actions;
    await Promise.all(
      actionList.map(action => {
        const prop = `${model.lcfirst()}${action}`;
        return expect(allProps.hasOwnProperty(prop)).toBe(true);
      })
    );
  });
});
