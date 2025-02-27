import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import "./Style/photobooth.css";

function Home() {
    const webcamRef = useRef(null);
    const [images, setImages] = useState([]);
  
    const capture = () => {
      if (images.length < 3) {
        const screenshot = webcamRef.current.getScreenshot();
        setImages([...images, screenshot]);
      }
    };
  
    const downloadImages = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    
      if (images.length === 0) {
        console.error("No images to download!");
        return;
      }

      let loadedImages = [];
      let imagesLoaded = 0;
    
      images.forEach((imgSrc, index) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          loadedImages[index] = img;
          imagesLoaded++;
    
          if (imagesLoaded === images.length) {
            const imageWidth = loadedImages[0].naturalWidth || 300;
            const imageHeight = loadedImages[0].naturalHeight || 400;
            const padding = 20;
            const topPadding = 60;
            const borderRadius = 20;
            const frameColor = "#ffffff";
    
            canvas.width = imageWidth + padding * 2;
            canvas.height = images.length * (imageHeight + padding) + topPadding + padding;
    
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#000000";
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillText("♡", canvas.width / 2, topPadding /1);
    
            loadedImages.forEach((img, idx) => {
              const x = padding;
              const y = topPadding + padding + idx * (imageHeight + padding);
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x + borderRadius, y);
              ctx.arcTo(x + imageWidth, y, x + imageWidth, y + imageHeight, borderRadius);
              ctx.arcTo(x + imageWidth, y + imageHeight, x, y + imageHeight, borderRadius);
              ctx.arcTo(x, y + imageHeight, x, y, borderRadius);
              ctx.arcTo(x, y, x + imageWidth, y, borderRadius);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, x, y, imageWidth, imageHeight);
              ctx.restore();
            });
    
            setTimeout(() => {
              const link = document.createElement("a");
              link.href = canvas.toDataURL("image/png");
              link.download = "photo-strip.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 500);
          }
        };
      });
    };
    
  
    return (
      <div className="container">
        <h1 className="title">PhotoBooth</h1>
        <a href="https://www.instagram.com/mxrxxs_x/" className="link"><h3>ig: mxrxxs_x</h3></a>
        <div className="content">
          {/* Showcase Container */}
          <div className="photo-showcase">
            <h2>♡</h2>
            <div id="photo-container" className="photo-container">
              {images.map((img, index) => (
                <img key={index} src={img} alt={`Captured ${index + 1}`} className="captured-image" />
              ))}
            </div>
          </div>
          
          {/* Camera & Controls */}
          <div className="camera-controls">
            {images.length < 3 ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/png"
                className="webcam"
                videoConstraints={{ facingMode: "user" }}
                mirrored={true} 
              />
            ) : (
              <p className="message">All photos taken! Download or retake.</p>
            )}
            <div className="buttons">
              {images.length < 3 ? (
                <button onClick={capture} className="capture-button">Capture</button>
              ) : (
                <>
                  <button onClick={() => setImages([])} className="retake-button">Retake</button>
                  <button onClick={downloadImages} className="download-button">Download</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;