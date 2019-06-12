import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import ChorusCard from "./ChorusCard";

describe("PlatButton", () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => wrapper = shallow(<ChorusCard buttonPressed={false}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(1);
  });
});
