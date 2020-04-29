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
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Common.Redirect custom props testing`, () => {
  it("redirect with absolute uri", () => {
    const mockFunc = jest.fn();
    window.open = mockFunc;

    shallow(<UU5.Common.Redirect uri="https://www.unicorn.com" />, {
      disableLifecycleMethods: false
    });

    expect(mockFunc).toBeCalled();
    expect(mockFunc.mock.calls[0][0]).toBe("https://www.unicorn.com");
    expect(mockFunc.mock.calls[0][1]).toBe("_self");
  });

  it("redirect with appBasePath relative uri", () => {
    const mockFunc = jest.fn();
    window.open = mockFunc;
    let origGABP = UU5.Environment.getAppBasePath;

    UU5.Environment.getAppBasePath = () => "/a-b/c-d/";
    shallow(<UU5.Common.Redirect uri="aboutBook" />, {
      disableLifecycleMethods: false
    });

    expect(mockFunc).toBeCalled();
    expect(mockFunc.mock.calls[0][0]).toBe("http://example.com/a-b/c-d/aboutBook");
    // http://example.com is the basePath

    UU5.Environment.getAppBasePath = origGABP;
  });
});
