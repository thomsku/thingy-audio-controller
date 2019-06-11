import React from "react";

interface IProps {
  playingAudio: boolean;
  play(): void;
}

const ConnectButton: React.FunctionComponent<IProps> = (props) => {
  return (
    <div>
      <button className="playbutton" onClick={props.play}>
        {props.playingAudio ? (
          "stop"
        ) : (
          "play"
        )}
      </button>
    </div>
  );
};

export default ConnectButton;
