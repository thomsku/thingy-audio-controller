import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import PlayButton from "./PlayButton";

describe("PlatButton", () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => wrapper = shallow(<PlayButton play={jest.fn()} playingAudio={false}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(1);
  });
});
