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
    {
      id: 1,
      bot: true,
      msg: "Hello! I'm an AI language model designed to detect potentially toxic or offensive language in text.",
    },
    {
      id: 2,
      bot: true,
      msg: "My goal is to promote healthy and respectful communication, and to help prevent harmful or hurtful interactions. If my system detects language that may be perceived as toxic or offensive, I'll notify you so that you can consider revising your message before sending it.",
    },
    {
      id: 3,
      bot: true,
      msg: "Example bad words would: Fuck, Bitch, Suck, ...",
    },
    {
      id: 4,
      bot: true,
      msg: "日本のユーザーの皆様へ、現時では当サービスは英語のみの提供となっております。将来的には、皆様が必要とするサービスを提供できるようにサービスのアップデートを約束いたします。今のところは、当サービスをお楽しみください。",
    },
  ];

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
  let [count, setCount] = useState(4);
  const model = useRef<any | null>(null);

  // Load the model just one, when the component mounts (hence the empty dependency array [])
  useEffect(() => {
    async function loadModel() {
      const threshold = 0.9;
      // Set a state that indicates the model is being loaded...
      model.current = await load(threshold, []);
      setHasLoaded(true);
      // Set the state to false to let the user know that they can check the text
      console.log("Model loaded");
    }
    loadModel();
  }, []);

  // Handle form submission: check the toxicity of the message and update accordingly:
  const sendMessage = async (event: any) => {
    // console.log("sendMessage()");
    event.preventDefault(); // Prevent default HTML form behavior that will trigger an HTTP request and a page reload
    const form = event.target;
    const msg = form.message.value;

    // Run the classifier on every message
    setIsClassifying(true);
    const predictions = await model.current.classify([msg]);
    setIsClassifying(false);

    // Is the message toxic?
    const isToxic = predictions[6].results[0].match;

    if (isToxic) {
      const labels: any = [];
      // Loop through the toxicity labels and create a list of them along with the corresponding percentages (level of confidence):
      predictions.forEach((p: any) => {
        if (p.results[0].match) {
          labels.push({
            label: p.label,
            prob: Math.round(p.results[0].probabilities[1] * 100) + "%",
          });
        }
      });
      setToxicity({ isToxic: true, labels });
      setMessages([
        ...messages,
        {
          id: ++count,
          bot: true,
          msg: `Detected: ${labels[0].label} ${labels[0].prob}! I shall not allow that to be sent!`,
        },
      ]);
      setCount(count + 1);
    } else {
      setToxicity({ isToxic: false, labels: [] });
      setMessages([...messages, { id: ++count, bot: false, msg: msg }]);
      setCount(count + 1);
      form.reset();
    }
  };

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#000" }}>
      <MDBRow>
        <MDBCol md="6" lg="8" xl="12">
          <MDBTypography listUnStyled>
            {hasMessages && (
              <ul>
                {messages.map((message) => {
                  if (message.bot)
                    return (
                      <li
                        className="d-flex justify-content-between mb-4"
                        key={message.id}
                      >
                        <img
                          src="src/assets/bot_avatar.png"
                          alt="avatar"
                          className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                          width="60"
                        />
                        <MDBCard className="w-100">
                          <MDBCardHeader className="d-flex justify-content-between p-3">
                            <p className="fw-bold mb-0">Bot</p>
                          </MDBCardHeader>
                          <MDBCardBody>
                            <p className="mb-0 text-end">{message.msg}</p>
                          </MDBCardBody>
                        </MDBCard>
                      </li>
                    );
                  else
                    return (
                      <li
                        className="d-flex justify-content-between mb-4"
                        key={message.id}
                      >
                        <MDBCard className="w-100">
                          <MDBCardHeader className="d-flex justify-content-between p-3">
                            <p className="fw-bold mb-0">Guest</p>
                          </MDBCardHeader>
                          <MDBCardBody>
                            <p className="mb-0">{message.msg}</p>
                          </MDBCardBody>
                        </MDBCard>
                        <img
                          src="src/assets/client_avatar.jpg"
                          alt="avatar"
                          className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                          width="60"
                        />
                      </li>
                    );
                })}
              </ul>
            )}
            {/* <li className="bg-white mb-3">
              <MDBTextArea label="Message" id="textAreaExample" rows={4} />
            </li>
            {hasLoaded && (
              <MDBBtn color="info" rounded className="float-end" onClick={sendMessage}>
                Send
              </MDBBtn>
            )} */}
            {hasLoaded && (
              <form onSubmit={sendMessage}>
                <input type="text" name="message" placeholder="Enter message" />
                <button>{isClassifying ? " ️‍️‍🕵 " : "Send"}</button>
              </form>
            )}
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
