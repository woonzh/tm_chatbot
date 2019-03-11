import React, { Component } from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class CheckboxForm extends Component {
  renderFormGroup = options => {
    return options.map((o, i) => (
      <FormControlLabel
        key={i}
        value={o.value}
        control={<Checkbox checked={o.checked} onChange={o.onChange} />}
        label={o.label.ucfirst()}
      />
    ));
  };
  render() {
    const { legend, options } = this.props;
    return (
      <div className="checkbox-form">
        <FormControl component="fieldset" className="form-control">
          <FormLabel component="legend">{legend}</FormLabel>
          <FormGroup>{options && this.renderFormGroup(options)}</FormGroup>
        </FormControl>
      </div>
    );
  }
}

export default CheckboxForm;
