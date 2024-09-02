import React, { Component } from "react";
import { Container } from "react-bootstrap";

import video from "../../video/home.mp4";

class HomeVideo extends Component {
  render() {
    return (
      <Container>
        <div>
          <video src={video} width="100%" autoPlay={true} controls={true} loop={true} />
        </div>
      </Container>
    );
  }
}

export default HomeVideo;