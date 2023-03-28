import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { load } from "@tensorflow-models/toxicity";

export default function App() {
  // Initialize our messages list with some sample messages:
  const initialMessages = [
    { id: 1, msg: "Hello!" },
    { id: 2, msg: "What's up?" },
    { id: 3, msg: "Hello!" },
  ];
  let count = initialMessages.length;

  // The list of messages
  const [messages, setMessages] = useState(initialMessages);
  // The state of toxicity for the message we just typed
  const [toxicity, setToxicity] = useState({ isToxic: false, labels: [] });
  // A simple state variable to reflect the classifying process status
  const [isClassifying, setIsClassifying] = useState(false);
  // Has the Toxicity model been loaded?
  const [hasLoaded, setHasLoaded] = useState(false);
  // Should we render the ul that will hold the messages if no messages are available?
  const hasMessages = messages.length > 0;
  // Retain a value throughout the Component's render cycles WITHOUT triggering a render, as opposed to a useState variable
  const model = useRef<any | null>(null);

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#000" }}>
      <MDBRow>
        <MDBCol md="6" lg="8" xl="12">
          <MDBTypography listUnStyled>
            <li className="d-flex justify-content-between mb-4">
              <img
                src="src/assets/bot_avatar.png"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="60"
              />
              <MDBCard>
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">Bot</p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </MDBCardBody>
              </MDBCard>
            </li>
            <li className="d-flex justify-content-between mb-4">
              <MDBCard className="w-100">
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">Guest</p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium.
                  </p>
                </MDBCardBody>
              </MDBCard>
              <img
                src="src/assets/client_avatar.jpg"
                alt="avatar"
                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                width="60"
              />
            </li>
            <li className="bg-white mb-3">
              <MDBTextArea label="Message" id="textAreaExample" rows={4} />
            </li>
            <MDBBtn color="info" rounded className="float-end">
              Send
            </MDBBtn>
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
