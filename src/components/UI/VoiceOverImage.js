import React from "react";
import AIImg2 from "../../asset/girl.gif";
import Mic from "../../asset/mic.gif";

export default function VoiceOverImage({ speaking }) {
  return (
    <div>
      {speaking ? (
        <div
          style={{ backgroundImage: `url(${AIImg2})` }}
          className="myDiv"
        ></div>
      ) : (
        <div style={{ backgroundImage: `url(${Mic})` }} className="myDiv"></div>
      )}
    </div>
  );
}
