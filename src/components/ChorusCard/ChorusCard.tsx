import React from "react";

interface IProps {
  buttonPressed: boolean;
}

const ConnectButton: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="card">
      <p>press the button</p>
      {props.buttonPressed ? (
        <p>chorus is <span className="on">on</span></p>
      ) : (
        <p>chorus is <span className="off">off</span></p>
      )}
    </div>
  );
};

export default ConnectButton;
