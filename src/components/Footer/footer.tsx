import React from 'react';
import "./footer.css";
import { GitHubLink } from './githubLink/githubLink';
import { Col, Row } from 'react-bootstrap';

/** a simple footer for the website */
export const Footer: React.FC = () => {
  return (
    <footer className="footer" style={{ marginTop: "auto" }}>
      <Row className="text-center align-items-center">
        <Col>
          {/* Left Section: Logos + Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src="https://webassets.unt.edu/assets/branding/unt-stacked-logo.svg"
                alt="UNT Logo"
                className="rounded"
                style={{ width: "10%", height: "auto" }}
              />
              <img
                src="https://brand.uccs.edu/sites/g/files/kjihxj1416/files/2022-06/UCCS%20Signature.svg"
                alt="UCCS Logo"
                className="rounded"
                style={{ width: "30%", height: "auto" }}
              />
            </div>

            <span style={{ fontSize: "14px" }}>
              © {new Date().getFullYear()}{" "}
              <b>
                <a
                  target="_blank"
                  href="https://oluwadarelab.com/"
                  rel="noopener noreferrer"
                >
                  Oluwadare Lab
                </a>
              </b>
            </span>
          </div>
        </Col>

        {/* Right Section: GitHub link */}
        <Col>
          <div style={{ float: "right", width: "10%" }}>
            <GitHubLink />
          </div>
        </Col>
      </Row>
    </footer>
  );
};
