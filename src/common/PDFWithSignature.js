import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFWithDirectSignature = ({ file, onSave }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const sigCanvas = useRef(null);
  const pdfContainerRef = useRef(null);
  const [canvasPosition, setCanvasPosition] = useState(null);
  const [isSignatureEnabled, setIsSignatureEnabled] = useState(false); // Enable/Disable E-Signature
  const [isMoveMode, setIsMoveMode] = useState(false); // Move Mode vs. Sign Mode

  // Load PDF pages
  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Show signature canvas at clicked position
  const startSigning = (event) => {
    if (!pdfContainerRef.current || !isSignatureEnabled) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - 75;
    const offsetY = event.clientY - rect.top;

    setCanvasPosition({ left: offsetX, top: offsetY });
  };

  // Stop event propagation inside the signature canvas
  const stopPropagation = (event) => {
    event.stopPropagation(); // Prevents the click from reaching `startSigning`
  };

  // Save signature inside PDF
  const saveSignature = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert("Please sign before saving.");
      return;
    }

    const signatureDataUrl = sigCanvas.current.toDataURL("image/png");

    // Load the existing PDF
    const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPage(pageNumber - 1);
    const { width: pdfWidth, height: pdfHeight } = page.getSize();

    // Get the dimensions of the PDF container in the UI
    const containerWidth = pdfContainerRef.current.clientWidth;
    const containerHeight = pdfContainerRef.current.clientHeight;

    // Convert position to PDF coordinates
    const pdfX = (canvasPosition.left / containerWidth) * pdfWidth;
    // const pdfY = pdfHeight - (canvasPosition.top / containerHeight) * pdfHeight;
    const pdfY = (pdfHeight - (canvasPosition.top / containerHeight) * pdfHeight) + 25;

    // Embed signature
    const signatureImage = await pdfDoc.embedPng(signatureDataUrl);
    page.drawImage(signatureImage, {
      x: pdfX,
      y: pdfY - 50, // Adjust for signature box height
      width: 150,
      height: 50,
    });

    // Save new PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Hide signature canvas
    setCanvasPosition(null);
    sigCanvas.current.clear();

    onSave(blob)
  };

  return (
    <div style={{ position: "relative", width: "600px" }}>

      {/* PDF Viewer */}
      <div
        ref={pdfContainerRef}
        onClick={startSigning}
        style={{ cursor: isSignatureEnabled ? "crosshair" : "auto", pointerEvents: canvasPosition && !isMoveMode ? "none" : "auto" }} // Disable clicks when canvas is visible and not in Move Mode
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={600} />
        </Document>
      </div>

      {/* Signature Canvas */}
      {canvasPosition && isSignatureEnabled && (
        <div
          style={{
            position: "absolute",
            left: `${canvasPosition.left}px`,
            top: `${canvasPosition.top}px`,
            width: "150px",
            height: "50px",
            background: "white",
            border: "2px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: isMoveMode ? "none" : "auto", // Disable pointer events in Move Mode
          }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            onMouseDown={stopPropagation} // Stop propagation for mouse events
            onMouseUp={stopPropagation}
            onClick={stopPropagation}
            canvasProps={{
              width: 150,
              height: 50,
              style: { touchAction: "none", cursor: "crosshair" },
            }}
          />
        </div>
      )}

      {/* Navigation and Actions */}
      <div style={{ marginTop: "10px" }}>
        {/* <button onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <button onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}>Next</button> */}
        <button onClick={() => setIsSignatureEnabled((prev) => !prev)}>
          {isSignatureEnabled ? "Disable E-Signature" : "Enable E-Signature"}
        </button>
        {
          isSignatureEnabled &&
          <>
            <button onClick={() => setIsMoveMode((prev) => !prev)}>
                {isMoveMode ? "Switch to Sign Mode" : "Switch to Move Mode"}
              </button>
            <button onClick={() => sigCanvas.current?.clear()}>Clear</button>
            <button onClick={saveSignature}>Save Signature</button>
          </>
        }
      </div>

    </div>
  );
};

export default PDFWithDirectSignature;