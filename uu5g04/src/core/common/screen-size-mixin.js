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

import React from "react";
import PropTypes from "prop-types";
import Tools from "./tools.js";
import ScreenSize from "../utils/screen-size";
import Environment from "../environment/environment";
import { postprocessors } from "./component-processors.js";

export const ScreenSizeMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ScreenSizeMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        screenSizeEvent: "UU5_Common_screenSize"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _contextScreenSize: PropTypes.oneOf(Object.keys(ScreenSize.SIZE_MAP)) // internally provided by postprocessor (interoperability with ScreenSizeProvider in uu5g04-hooks)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { _contextScreenSize: undefined };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.ScreenSizeMixin");
    // state
    return {
      screenSize: this.getScreenSize()
    };
  },

  componentDidMount() {
    if (this.props._contextScreenSize === undefined) {
      window.UU5.Environment.EventListener.registerScreenSize(this.getId(), this._onChangeScreenSize);
    }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps._contextScreenSize === undefined) {
      window.UU5.Environment.EventListener.registerScreenSize(this.getId(), this._onChangeScreenSize);
    } else {
      window.UU5.Environment.EventListener.unregisterScreenSize(this.getId());
      let runOnChange = false;
      let newScreenSize = nextProps._contextScreenSize;
      this.setState(
        state => {
          let isSame = state.screenSize === newScreenSize;
          runOnChange = !isSame;
          return isSame ? undefined : { screenSize: newScreenSize };
        },
        () => {
          if (runOnChange) this._onChangeScreenSize(null, newScreenSize);
        }
      );
    }
  },

  componentWillUnmount() {
    window.UU5.Environment.EventListener.unregisterScreenSize(this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonScreenSizeMixinProps() {
    return this.hasMixin("UU5.Common.ScreenSizeMixin");
  },

  getUU5CommonScreenSizeMixinProps() {
    return {
      screenSize: this.getScreenSize()
    };
  },

  getUU5CommonScreenSizeMixinPropsToPass() {
    return this.getUU5CommonScreenSizeMixinProps();
  },

  getScreenSize() {
    return this.state
      ? this.state.screenSize
      : (this.props || {})._contextScreenSize === undefined // this.props should be always defined but uuCourseKit calls this method statically :-/ so let's not crash their app...
      ? Tools.getScreenSize()
      : this.props._contextScreenSize;
  },

  isXs() {
    return this.getScreenSize() === "xs";
  },

  isS() {
    return this.getScreenSize() === "s";
  },

  isM() {
    return this.getScreenSize() === "m";
  },

  isL() {
    return this.getScreenSize() === "l";
  },

  isXl() {
    return this.getScreenSize() === "xl";
  },

  onChangeScreenSizeDefault(e, actualScreenSize) {
    this.setState(state => (state.screenSize !== actualScreenSize ? { screenSize: actualScreenSize } : undefined));
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onChangeScreenSize(e, actualScreenSize) {
    if (typeof this.onChangeScreenSize_ === "function") {
      this.onChangeScreenSize_(actualScreenSize, e);
    } else {
      this.onChangeScreenSizeDefault(e, actualScreenSize);
    }
    return this;
  }
  //@@viewOff:private
};

if (
  (process.env.NODE_ENV !== "test" || Environment._allowTestContext) && // disabled for tests because shallow rendering of components with this mixin would be useless (only wrapper with Consumer would be visible)
  React.forwardRef
) {
  postprocessors.push(function ScreenSizeMixinVCPostprocessor(Component, componentDescriptor, ctx) {
    let mixins = componentDescriptor && Array.isArray(componentDescriptor.mixins) ? componentDescriptor.mixins : null;
    if (mixins && mixins.includes(ScreenSizeMixin)) {
      // wrap with screen size consumer
      let ResultComponent = React.forwardRef(function(props, ref) {
        return (
          <ScreenSize.Context.Consumer>
            {value => {
              let screenSize = value ? value.screenSize || null : undefined;
              return <Component {...props} ref={ref} _contextScreenSize={screenSize} />;
            }}
          </ScreenSize.Context.Consumer>
        );
      });
      for (let k of Object.getOwnPropertyNames(Component)) {
        try {
          if (!(k in ResultComponent)) ResultComponent[k] = Component[k];
        } catch (e) {} // needed for IE for special properties like "caller"
      }
      ResultComponent.displayName = "withScreenSize(" + ResultComponent.displayName + ")";
      ResultComponent.isUu5PureComponent = true;
      return ResultComponent;
    }
    return Component;
  });
}

export default ScreenSizeMixin;
