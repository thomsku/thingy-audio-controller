import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import React from "react";
import ChorusCard from "../ChorusCard/ChorusCard";
import ConnectButton from "../ConnectButton/ConnectButton";
import PlayButton from "../PlayButton/PlayButton";
import Page from "./Page";

let mockWebBluetooth = true;

jest.mock("thingy52_web_bluetooth", () => {
// tslint:disable-next-line: only-arrow-functions
  return function() {
    return {
      addEventListener: jest.fn(),
      button: {start: jest.fn()},
      connect: () => (mockWebBluetooth ? true : false),
      disconnect: () => true,
      temperature: {start: jest.fn()},
    };
  };
});

jest.mock("tone", () => {
  return {
    Chorus: jest.fn().mockImplementation((frequency, delayTime, depth) => {
      return {
        delayTime,
        depth,
        frequency,
        toMaster: jest.fn(),
        wet: {value: 1},
      };
    }),
    Filter: jest.fn().mockImplementation((frequency, type) => {
      return {
        frequency,
        toMaster: jest.fn(),
        type,
      };
    }),
    Player: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        toMaster: jest.fn(),
      };
    }),
  };
});

// jest.genMockFromModule("tone");
// jest.mock("tone");

describe("Page", () => {
  let wrapper: ShallowWrapper<null, null, Page>;
  beforeEach(() => wrapper = shallow(<Page />));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

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
    <ChorusCard
      buttonPressed={wrapper.instance().state.buttonPressed}/>,
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

  it("should start the button listener on Thingy", async () => {
    const spy = jest.spyOn((window as any).thingy.button, "start");
    wrapper.setState({connected: false});
    await wrapper.instance().connect();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should not connect when the browser does not support Web Bluetooth", async () => {
    mockWebBluetooth = false;
    wrapper.setState({connected: false});
    await wrapper.instance().connect();
    wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.connected).toEqual(false);
  });

});

describe("play", () => {
  let wrapper: ReactWrapper<null, null, Page>;
  beforeEach(() => wrapper = mount(<Page />));

  it("should update the text of the PlayButton Component based on playing state", () => {
    wrapper.setState({playingAudio: false});
    wrapper.instance().play();
    wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.playingAudio).toEqual(true);
    expect(wrapper.find(".playbutton").text()).toEqual("stop");
    wrapper.instance().play();
    wrapper.instance().forceUpdate();
    expect(wrapper.instance().state.playingAudio).toEqual(false);
    expect(wrapper.find(".playbutton").text()).toEqual("play");
  });
});

describe("toggleChorus", () => {
  let wrapper: ReactWrapper<null, null, Page>;
  beforeEach(() => wrapper = mount(<Page />));

  it("should change the depth of the chorus based on the button state", () => {
    wrapper.instance().componentDidMount();
    wrapper.instance().toggleChorus({detail: {value: 1}});
    wrapper.instance().forceUpdate();
    expect(wrapper.instance().getChorus().wet.value).toEqual(1);
    wrapper.instance().toggleChorus({detail: {value: 0}});
    wrapper.instance().forceUpdate();
    expect(wrapper.instance().getChorus().wet.value).toEqual(0);
  });
});
