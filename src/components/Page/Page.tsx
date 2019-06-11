import React from "react";
import Thingy from "thingy52_web_bluetooth";
import Tone from "tone";
import ConnectButton from "../ConnectButton/ConnectButton";
import PlayButton from "../PlayButton/PlayButton";
import "./Page.css";

interface IState {
  connected: boolean;
  playingAudio: boolean;
  temperature: number;
}

class Page extends React.Component<{}, IState> {
  public state: IState = {
    connected: false,
    playingAudio: false,
    temperature: -1,
  };
  private player!: Tone.Player;
  private filter!: Tone.Filter;
  private chorus!: Tone.Chorus;

  public componentDidMount() {
    this.chorus = new Tone.Chorus(2, 2.5, 0.0).toMaster();
    // this.chorus.wet.value = 0;
    this.filter = new Tone.Filter(1500, "lowpass").toMaster();
    this.player = new Tone.Player("./song.mp3");
    this.player.loop = true;
    this.player.connect(this.chorus);
  }

  public connect = async () => {
    if (!this.state.connected) {
      try {
        const thingy = new Thingy({logEnabled: false});
        (window as any).thingy = thingy;
        const connected = await (window as any).thingy.connect();
        if (connected) {
          (window as any).thingy.addEventListener("button", this.temperatureToFilterListener);
          await (window as any).thingy.button.start();
          this.setState({
            connected: true,
          });
        }
      } catch (e) {
        throw(e);
      }
    } else {
      await (window as any).thingy.disconnect();
      this.setState({
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

  public temperatureToFilterListener = (data: any) => {
    // can do gravity with filter?
    if (data.detail.value === 1) {
      this.chorus.depth = 0.5;
    } else {
      this.chorus.depth= 0;
    }
    // this.filter.frequency.value = data.detail.heading * 30 + 300;
  }

  public render() {
    return (
    <div className="page">
      <h1>thingy audio controller</h1>
      <ConnectButton connect={this.connect} connected={this.state.connected}/>
      <PlayButton play={this.play} playingAudio={this.state.playingAudio}/>
    </div>
  );
  }
}

export default Page;
