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
    console.log("Drawing on canvas");

    const aspectRatio = image.width / image.height;
    const canvasWidth = window.innerWidth * 0.5;
    const canvasHeight = canvasWidth / aspectRatio;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    const fontSize = canvasWidth * 0.02;
    ctx.font = `${fontSize}px Verdana`;
    ctx.textAlign = "center";

    ctx.fillStyle = "white"; // Text color
    ctx.strokeStyle = "black"; // Border color
    ctx.lineWidth = 10; // Border thickness

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
        "https://blubapi.vercel.app/api/birdeye"
      );
      console.log("Blub Data:", data);
      const blub = data.data.data.tokens.find((token) => token.name === "BLUB");
      setData(blub);
    } catch (error) {
      console.log("Error fetching blub data:", error);
    }
  };

  const getMemeData = async () => {
    try {
      const { data } = await axios.get("https://blubapi.vercel.app/api/cmc");
      console.log("Meme Data:", data);
      const result = [data.data.data].map((token) => ({
        pepe: formatValue(Number(token[24478].quote.USD.market_cap)),
        ponke: formatValue(Number(token[29150].quote.USD.market_cap)),
        brett: formatValue(Number(token[29743].quote.USD.market_cap)),
      }));
      console.log("Formatted Result:", result);
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
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = blubLogo;

        image.onload = () => {
          console.log("Image loaded successfully");
          drawImageWithText(
            canvasRef.current,
            canvasRef.current.getContext("2d"),
            image
          );
        };

        image.onerror = (error) => {
          console.error("Error loading image:", error);
        };

        window.addEventListener("resize", () =>
          drawImageWithText(canvas, ctx, image)
        );
      }
    }
  }, [data, rest]); // Add `rest` and `data` as dependencies
  return <canvas ref={canvasRef}></canvas>;
}

export default App;
