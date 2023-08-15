import React from "react";
import AIImg2 from "../../asset/girl.gif";
import Mic from "../../asset/mic.gif";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function VoiceOverImage({ speaking }) {
  return (
    <div>
      <Card sx={{ maxWidth: 300, marginBottom: 1 }}>
        <CardMedia
          sx={{ height: 300 }}
          image={speaking ? AIImg2 : Mic}
          title="green iguana"
        />
      </Card>
    </div>
  );
}
