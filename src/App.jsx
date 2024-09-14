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
    const aspectRatio = image.width / image.height;
    const canvasWidth = window.innerWidth * 0.7; // Adjust canvas size to fit the screen
    const canvasHeight = canvasWidth / aspectRatio;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    // Dynamically adjust font size based on canvas width
    const fontSize = canvasWidth * 0.02; // Change multiplier for larger font on mobile
    ctx.font = `bold ${fontSize}px Verdana`;
    ctx.textAlign = "center";

    // Positions of text
    const positions = [
      {
        x: canvasWidth * 0.2,
        y: canvasHeight * 0.895,
        price: `$${rest[0].pepe}`,
        color: "#006451",
      },
      {
        x: canvasWidth * 0.43,
        y: canvasHeight * 0.9,
        price: `$${rest[0].brett}`,
        color: "#4B2E2A",
      },
      {
        x: canvasWidth * 0.67,
        y: canvasHeight * 0.9,
        price: `$${rest[0].ponke}`,
        color: "#4B2E2A",
      },
      {
        x: canvasWidth * 0.9,
        y: canvasHeight * 0.9,
        price: `$${data}`,
        color: "#00008B",
      },
    ];

    // Draw each piece of text
    positions.forEach((pos) => {
      ctx.fillStyle = "white";
      ctx.strokeStyle = pos.color; // Text border color
      ctx.lineWidth = 10; // Border thickness for text
      ctx.strokeText(pos.price, pos.x, pos.y);
      ctx.fillText(pos.price, pos.x, pos.y);
    });
  };

  const getBlubData = async () => {
    try {
      const { data } = await axios.get(
        "https://blubapi.vercel.app/api/dexScreenerApi"
      );
      console.log(data);
      const blub = formatValue(Number(data.data.pairs[0].marketCap));

      setData(blub);
    } catch (error) {
      console.log("Error fetching blub data:", error);
    }
  };

  const getMemeData = async () => {
    try {
      const { data } = await axios.get("https://blubapi.vercel.app/api/cmc");
      const result = [data.data.data].map((token) => ({
        pepe: formatValue(Number(token[24478].quote.USD.market_cap)),
        ponke: formatValue(Number(token[29150].quote.USD.market_cap)),
        brett: formatValue(Number(token[29743].quote.USD.market_cap)),
      }));
      setRest(result);
    } catch (error) {
      console.error("Error fetching meme data:", error);
    }
  };

  useEffect(() => {
    getBlubData();
    getMemeData();
  }, []);

  useEffect(() => {
    if (data && rest) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = blubLogo;

        image.onload = () => {
          drawImageWithText(canvas, ctx, image);
        };

        image.onerror = (error) => {
          console.error("Error loading image:", error);
        };

        // Redraw canvas when window is resized
        const handleResize = () => drawImageWithText(canvas, ctx, image);
        window.addEventListener("resize", handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
      }
    }
  }, [data, rest]);

  return <canvas ref={canvasRef}></canvas>;
}

export default App;
