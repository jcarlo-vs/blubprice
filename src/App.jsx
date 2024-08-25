import React, { useEffect, useRef, useState } from "react";
import blubLogo from "./assets/blub.jpeg";
import "./App.css";
import axios from "axios";
import formatValue from "./util";

function App() {
  const [data, setData] = useState(null);
  const [rest, setRest] = useState(null);

  const canvasRef = useRef(null);

  const drawImageWithText = (canvas, ctx, image) => {
    // Calculate the aspect ratio of the image
    const aspectRatio = image.width / image.height;

    // Set the canvas size based on the window size
    const canvasWidth = window.innerWidth * 0.5; // 50% of the window width
    const canvasHeight = canvasWidth / aspectRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the image
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    // Set the font size relative to the canvas size
    const fontSize = canvasWidth * 0.02; // 2% of the canvas width
    ctx.font = `${fontSize}px Verdana`;
    ctx.textAlign = "center";

    ctx.fillStyle = "white"; // Text color
    ctx.strokeStyle = "black"; // Border color
    ctx.lineWidth = 10; // Border thickness

    // Define text styles and positions
    const positions = [
      {
        x: canvasWidth * 0.2,
        y: canvasHeight * 0.895,
        price: `$${rest[0].pepe}`,
        color: "#006451",
        font: "bold 18px Verdana",
      },
      {
        x: canvasWidth * 0.43,
        y: canvasHeight * 0.9,
        price: `$${rest[0].brett}`,
        color: "#4B2E2A",
        font: "bold 18px Verdana",
      },
      {
        x: canvasWidth * 0.67,
        y: canvasHeight * 0.9,
        price: `$${rest[0].ponke}`,
        color: "#4B2E2A",
        font: "bold 18px Verdana",
      },
      {
        x: canvasWidth * 0.9,
        y: canvasHeight * 0.9,
        price: `$${(data?.mc / 1e6).toFixed(1)}M`,
        color: "#00008B",
        font: "bold 18px Verdana",
      },
    ];

    positions.forEach((pos) => {
      ctx.strokeStyle = pos.color;
      ctx.font = pos.font;
      ctx.strokeText(pos.price, pos.x, pos.y);
      ctx.fillText(pos.price, pos.x, pos.y);
    });
  };

  const getBlubData = async () => {
    try {
      const { data } = await axios.get(
        "https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc",
        {
          method: "GET",
          headers: {
            "x-chain": "sui",
            "X-API-KEY": import.meta.env.VITE_BIRD_EYE_API_KEY,
          },
        }
      );
      const blub = data.data.tokens.find((token) => token.name === "BLUB");
      setData(blub);
    } catch (error) {
      console.log(error);
    }
  };

  const getMemeData = async () => {
    try {
      const { data } = await axios.get(
        "/api/v2/cryptocurrency/quotes/latest?id=24478,29150,29743"
      );
      console.log("Meme Data:", data); // Log data to verify its structure
      const result = [data.data].map((token) => {
        return {
          pepe: formatValue(Number(token[24478].quote.USD.market_cap)),
          ponke: formatValue(Number(token[29150].quote.USD.market_cap)),
          brett: formatValue(Number(token[29743].quote.USD.market_cap)),
        };
      });
      console.log("Formatted Result:", result); // Log formatted result
      setRest(result);
    } catch (error) {
      console.error("Error fetching meme data:", error);
    }
  };

  useEffect(() => {
    getBlubData();
    getMemeData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    if (data && rest) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = blubLogo;

      const draw = () => drawImageWithText(canvas, ctx, image);

      image.onload = draw;

      // Redraw the canvas when the window is resized
      window.addEventListener("resize", draw);

      // Cleanup the event listener on component unmount
      return () => window.removeEventListener("resize", draw);
    }
  }, [data, rest]); // Add `rest` as a dependency

  return <canvas ref={canvasRef}></canvas>;
}

export default App;
