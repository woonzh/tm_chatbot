import PFile from "./PFile";

export class PCsv extends PFile {
  get accept() {
    return this.props.accept || "text/csv";
  }
  get text() {
    return this.props.text || "Upload a csv file";
  }
}

export default PCsv;
