import React, { Component } from "react";
import video from "../../video/home.mp4";
import { Container } from "react-bootstrap";

class HomeVideo extends Component {
  render() {
    return (
        <Container>
        <div>
            <video src={video} width="100%" autoPlay={true} controls={true} loop={true}/>
        </div>
      </Container>
    );
  }
}

export default HomeVideo;