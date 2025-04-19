import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';  // Make sure you've set this up correctly


const DashBoard = () => {
  const [graphs, setGraphs] = useState({
    critical: '',
    seasonal: '',
    status: ''
  });

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/dashboard_graphs/", {
          
        });
  
        setGraphs(res.data.graphs);
      } catch (error) {
        console.error("Error fetching dashboard graphs:", error);
      }
    };
  
    fetchGraphs();
  }, []);
  

  
  return (
    <div className="p-4">
    <h1 className="text-3xl font-bold mb-4">Your Sales Dashboard</h1>
  
    <div className="flex flex-row gap-6 mb-6">
      {/* First row with two images */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">Produits Critiques</h2>
        {graphs.critical && (
          <img
            src={graphs.critical}
            alt="Produits Critiques"
            className="rounded-xl shadow-lg max-w-lg w-full h-auto"
          />
        )}
      </div>
  
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">Produits Saisonniers</h2>
        {graphs.seasonal && (
          <img
            src={graphs.seasonal}
            alt="Produits Saisonniers"
            className="rounded-xl shadow-lg max-w-lg w-full h-auto"
          />
        )}
      </div>
    </div>
  
    {/* Second row with one image */}
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-xl font-semibold mb-2">Statut des Produits</h2>
      {graphs.status && (
        <img
          src={graphs.status}
          alt="Statut des Produits"
          className="rounded-xl shadow-lg max-w-lg w-full h-auto"
        />
      )}
    </div>
  </div>
  
  );
};

export default DashBoard;
