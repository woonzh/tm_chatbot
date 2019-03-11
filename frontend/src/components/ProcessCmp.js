import Cmp from "./Cmp";

class ProcessCmp extends Cmp {
  get processInstance() {
    throw new Error("property processInstance is not implemented");
  }
  get onProcessUpdate() {
    throw new Error("function onProcessUpdate is not implemented");
  }
  //////////
  subscribe = async () => {
    if (this.processInstance && this.processInstance.id)
      await this.actions.subscribeToProcess(this.processInstance.id);
  };
  unsubscribe = async () => {
    if (this.processInstance && this.processInstance.id)
      await this.actions.unsubscribeFromProcess(this.processInstance.id);
  };
  addListeners = async obj => {
    // subscribe to process change
    await this.subscribe(this.processInstance);
    // set handler for process update
    await this.actions.on("connect", this.subscribe);
    await this.actions.on("process", this.onProcessUpdate);
  };
  removeListeners = async () => {
    await this.actions.off("connect", this.subscribe);
    await this.actions.off("process", this.onProcessUpdate);
    await this.unsubscribe(this.processInstance);
  };
  //////////
  async componentDidMount() {
    await this.addListeners();
  }
  async componentWillUnmount() {
    await this.removeListeners();
  }
}

export default ProcessCmp;
