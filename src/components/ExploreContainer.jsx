import { useEffect, useRef, useState } from "react";
import { Application, Ticker } from "pixi.js";
import { Live2DModel } from "pixi-live2d-display-lipsyncpatch/cubism2";
import audioFile from "/audio.mp3";
import "./ExploreContainer.css";
import initialPrompt from '../prompt.json';

const NPCBubble = ({ text, isVisible }) => {
  return (
    <div
      className="npc-bubble"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <p style={{ margin: 0, fontSize: "16px", color: "black" }}>{text}</p>
    </div>
  );
};

const Live2DCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([initialPrompt]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas reference is not set");
      return;
    }

    appRef.current = new Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff, // Simple background color
    });

    const loadModel = async () => {
      try {
        if (!appRef.current.stage) {
          console.error("app.stage is not available");
          return;
        }

        const baseUrl =
          "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/";
        const modelUrl = new URL("shizuku.model.json", baseUrl).toString();

        const model = await Live2DModel.from(modelUrl, {
          ticker: Ticker.shared,
        });

        appRef.current.stage.addChild(model);

        // Model transforms
        model.x = appRef.current.screen.width / 2;
        model.y = appRef.current.screen.height / 3;
        model.scale.set(0.5);
        model.anchor.set(0.5, 0.5);

        modelRef.current = model;
        setModelLoaded(true);

      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };

    if (!modelLoaded) {
      loadModel();
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, true);
      }
    };
  }, []);


  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await callOpenAI();
  };

  const callOpenAI = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [...messages, { role: 'user', content: userInput }],
          max_tokens: 150
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setMessages(prevMessages => [...prevMessages, 
        { role: 'user', content: userInput },
        { role: 'assistant', content: aiResponse }
      ]);
      setBubbleText(aiResponse);
      setBubbleVisible(true);
      setUserInput("");

      // Trigger the speak function with the AI response
      if (modelRef.current) {
        modelRef.current.speak(audioFile, { crossOrigin: "anonymous", volume: 0 });
      }

      // Hide bubble after 10 seconds
      setTimeout(() => {
        setBubbleVisible(false);
      }, 1000000);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setBubbleText("Sorry, I couldn't process your request.");
      setBubbleVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="live2d-container">
      <canvas ref={canvasRef} id="canvas" className="live2d-canvas"></canvas>
      <div className="overlay">
        <NPCBubble text={bubbleText} isVisible={bubbleVisible} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button
          type="submit"
          disabled={!modelLoaded || isLoading}
          className="send-button"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Live2DCanvas;
