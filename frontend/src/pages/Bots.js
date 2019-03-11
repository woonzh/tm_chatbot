import React from "react";

import { ProcessSetting, Page } from "../components";

import { BotSearchBar, Services } from "../components/bot";
import { RecentlyViewed, SolutionBuilder } from "../components/bot";

import { connect } from "../redux";

class BotsPage extends Page {
  async componentDidMount() {
    await super.componentDidMount();
    await this.props.api(this.props.apis.category.list);
  }

  openProcessSetting = async item => {
    await this.props.productDetail(item);
    this.processSettingForm = (
      <ProcessSetting
        onClose={e => this.props.popupRemove(this.processSettingForm)}
      />
    );
    await this.props.popupAdd(this.processSettingForm);
  };

  renderComponent() {
    return (
      <div className="page page-bots">
        <h3>Amaris APA Services</h3>
        <div className="page-content">
          <div id="page-content-top">
            <BotSearchBar />
            <RecentlyViewed />
          </div>
          <Services />
          <SolutionBuilder openProcessSetting={this.openProcessSetting} />
        </div>
      </div>
    );
  }
}

export default connect(BotsPage);
