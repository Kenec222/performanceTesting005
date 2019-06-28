/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Slider.Item"),
    classNames: {
      main: ns.css("slider-selection"),
      pointer: ns.css("slider-pointer"),
      input: ns.css("slider-input")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: PropTypes.number,
    _min: PropTypes.number,
    _max: PropTypes.number,
    _step: PropTypes.number,
    _getStyle: PropTypes.func,
    _checkValue: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: null
    }
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      value: this.props._checkValue(this.props.value)
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value || nextState.disabled !== this.state.disabled;
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  getValue() {
    return this.state.value;
  },

  setValue(value, setStateCallback) {
    if (!this.isDisabled()) {
      this.setState({ value: this.props._checkValue(value) }, setStateCallback);
    }
  },

  increase(value, setStateCallback) {
    this.setState(prevState => {
      return { value: this.props._checkValue(prevState.value + (value || this.props._step)) };
    }, setStateCallback);
    return this;
  },

  decrease(value, setStateCallback) {
    this.setState(prevState => {
      return { value: this.props._checkValue(prevState.value - (value || this.props._step)) };
    }, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs() {
    const attrs = this.getMainAttrs();
    attrs.style = this.props._getStyle(this.state.value);
    attrs.name = null;
    return attrs;
  },

  _getInputAttrs() {
    let attrs = {
      className: this.getClassName().input,
      type: "range",
      name: this.getName(),
      min: this.props._min,
      max: this.props._max,
      step: this.props._step,
      value: this.getValue(),
      disabled: this.isDisabled()
    };

    if (!this.isDisabled()) {
      attrs.onChange = (e) => this._changeValue(e.target.value, e)
    }

    return attrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <div {...this._getMainAttrs()}>
       <input {...this._getInputAttrs()} />
       <div className={this.getClassName('pointer')}>
       <span> {this.getChildren()}
          </span></div>
       {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
