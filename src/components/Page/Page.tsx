import React from "react";
import Thingy from "thingy52_web_bluetooth";
import Tone from "tone";
import ChorusCard from "../ChorusCard/ChorusCard";
import ConnectButton from "../ConnectButton/ConnectButton";
import PlayButton from "../PlayButton/PlayButton";
import "./Page.css";

interface IState {
  buttonPressed: boolean;
  connected: boolean;
  playingAudio: boolean;
  temperature: number;
}

class Page extends React.Component<{}, IState> {
  public state: IState = {
    buttonPressed: false,
    connected: false,
    playingAudio: false,
    temperature: -1,
  };
  private player!: Tone.Player;
  private filter!: Tone.Filter;
  private chorus!: Tone.Chorus;

  public componentDidMount() {
    this.chorus = new Tone.Chorus(2, 2.5, 0.5);
    this.chorus.wet.value = 0;
    this.chorus.toMaster();
    this.filter = new Tone.Filter(3000, "lowpass");
    this.filter.toMaster();
    this.player = new Tone.Player("./song.mp3");
    this.player.loop = true;
    this.player.connect(this.chorus);
  }

  public connect = async () => {
    if (!this.state.connected) {
      const thingy = new Thingy({logEnabled: false});
      (window as any).thingy = thingy;
      const connected = await (window as any).thingy.connect();
      if (connected) {
        (window as any).thingy.addEventListener("button", this.toggleChorus);
        await (window as any).thingy.button.start();
        this.setState({
          connected: true,
        });
      } else {
        console.log("web bluetooth not supported");
      }
    } else {
      await (window as any).thingy.disconnect();
      this.toggleChorus({detail: {value: 0}});
      this.setState({
        buttonPressed: false,
        connected: false,
      });
    }
  }

  public play = () => {
    if (this.state.playingAudio === false) {
      this.player.start();
    } else {
      this.player.stop();
    }
    this.setState({
      playingAudio: (!this.state.playingAudio),
    });
  }

  public toggleChorus = (data: {detail: {value: number}}) => {
    // can do gravity with filter?
    if (data.detail.value === 1) {
      this.chorus.wet.value = 1;
      this.setState({buttonPressed: true});
    } else {
      this.chorus.wet.value = 0;
      this.setState({buttonPressed: false});
    }
  }

  public render() {
    return (
    <div className="page">
      <h1>thingy audio controller</h1>
      <ConnectButton connect={this.connect} connected={this.state.connected}/>
      <PlayButton play={this.play} playingAudio={this.state.playingAudio}/>
      <ChorusCard buttonPressed={this.state.buttonPressed}/>
    </div>
  );
  }

  public getChorus() {
    return this.chorus;
  }
}

export default Page;
