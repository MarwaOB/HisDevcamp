import { useState, useRef } from "react";
import Sidebar from "../components/SideBar";

const PredictPage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      alert("Veuillez déposer un fichier CSV uniquement.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Veuillez sélectionner un fichier CSV uniquement.");
    }
  };
  const handleStartPrediction = async () => {
    if (!file) {
      alert("Veuillez d'abord sélectionner un fichier CSV.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:8000/api/auth/predict/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      console.log('Response status:', response.status);  // Log response status
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error details:', errorData);  // Log error details
        throw new Error(errorData.error || "Une erreur est survenue");
      }
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "prediction_results.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar à gauche */}
 

      {/* Contenu principal à droite */}
      <div className="flex-1 bg-white p-8">
        <div className="flex justify-end items-center mb-8 gap-4">
          <button className="rounded-full bg-yellow-300 w-10 h-10 text-center font-bold">TY</button>
          <div>
            <p className="font-medium text-sm">Tati</p>
            <p className="text-xs text-gray-500">Youcef</p>
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-teal-600 bg-teal-100 text-teal-700 text-xl text-center p-10 rounded-md mb-4 cursor-pointer"
          onClick={openFileDialog}
        >
          <p>Drop Your File or Click to Browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {file && (
          <p className="mb-4 text-gray-700">
            Fichier sélectionné : <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleStartPrediction}
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2 rounded"
        >
          Start Prediction
        </button>
      </div>
    </div>
  );
};

export default PredictPage;
