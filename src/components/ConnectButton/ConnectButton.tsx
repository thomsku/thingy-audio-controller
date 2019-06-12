import React from "react";

interface IProps {
  connected: boolean;
  connect(): void;
}

const ConnectButton: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="buttondiv">
      <button className="connectbutton" onClick={props.connect}>
        {props.connected ? (
          "disconnect"
        ) : (
          "connect"
        )}
      </button>
    </div>
  );
};

export default ConnectButton;
