import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import React from "react";
import ConnectButton from "../ConnectButton/ConnectButton";
import PlayButton from "../PlayButton/PlayButton";
import Page from "./Page";

// jest.mock("thingy52_web_bluetooth", () => ({
//   connect: jest.fn(() => true),
//   connected: false,
//   default: jest.fn(() => true),
//   disconnect: jest.fn(() => true),
// }));

jest.mock("thingy52_web_bluetooth", () => {
// tslint:disable-next-line: only-arrow-functions
  return function() {
    return {
      addEventListener: jest.fn(),
      connect: () => true,
      disconnect: () => true,
      temperature: {start: jest.fn()},
      button: {start: jest.fn()},
    };
  };
});

jest.genMockFromModule("tone");
jest.mock("tone");

describe("Page", () => {
  let wrapper: ShallowWrapper<null, null, Page>;
  beforeEach(() => wrapper = shallow(<Page />));

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(1);
  });

  it("should render the ConnectButton and PlayButton Components", () => {
    expect(wrapper.containsAllMatchingElements([
    <ConnectButton
      connect={wrapper.instance().connect}
      connected={wrapper.instance().state.connected}/>,
    <PlayButton
      play={wrapper.instance().play}
      playingAudio={wrapper.instance().state.playingAudio}/>,
    ])).toEqual(true);
  });
});

describe("mounted Page", () => {
  let wrapper: ReactWrapper<null, null, Page>;
  beforeEach(() => wrapper = mount(<Page />));

  it("should call connect when the connect button is clicked", () => {
    const spy = jest.spyOn(wrapper.instance(), "connect");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(".connectbutton").simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should call play when the play button is clicked", () => {
    const spy = jest.spyOn(wrapper.instance(), "play");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(".playbutton").simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("connect", () => {
  let wrapper: ReactWrapper<null, null, Page>;
  beforeEach(() => wrapper = mount(<Page />));

  it("should update the text of the ConnectButton Component based on connected state", async () => {
    wrapper.setState({connected: false});
    await wrapper.instance().connect();
    await wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.connected).toEqual(true);
    expect(wrapper.find(".connectbutton").text()).toEqual("disconnect");
    await wrapper.instance().connect();
    await wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.connected).toEqual(false);
    expect(wrapper.find(".connectbutton").text()).toEqual("connect");
  });
});

describe("play", () => {
  let wrapper: ReactWrapper<null, null, Page>;
  beforeEach(() => wrapper = mount(<Page />));

  it("should update the text of the PlayButton Component based on playing state", async () => {
    wrapper.setState({playingAudio: false});
    await wrapper.instance().play();
    await wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.playingAudio).toEqual(true);
    expect(wrapper.find(".playbutton").text()).toEqual("stop");
    await wrapper.instance().play();
    await wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.playingAudio).toEqual(false);
    expect(wrapper.find(".playbutton").text()).toEqual("play");
  });
});
