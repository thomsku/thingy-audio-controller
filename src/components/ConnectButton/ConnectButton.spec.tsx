import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import ConnectButton from "./ConnectButton";

describe("ConnectButton", () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => wrapper = shallow(<ConnectButton connect={jest.fn()} connected={false}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(1);
  });
});
