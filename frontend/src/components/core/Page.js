import Component from "./Component";

export class Page extends Component {
  async componentDidMount() {
    await this.props.applicationSetCurrentPage(this);
  }
}

export default Page;
