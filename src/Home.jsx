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
      const container = document.getElementById("photo-container");
    
      if (!container) {
        console.error("Photo container not found!");
        return;
      }
    
      setTimeout(() => {
        html2canvas(container, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff", 
          scale: 2, 
          logging: true,
        }).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "photobooth-strip.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch((error) => console.error("Error capturing image:", error));
      }, 1000);
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
            {/* <p>{images.length} / 3 Taken</p> */}
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
