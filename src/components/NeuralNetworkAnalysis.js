// components/NeuralNetworkAnalysis.js
'use client';

import React, { useEffect } from 'react';
import { createModel, trainModel, predictBatch } from '@/lib/neuralNetwork';

const NeuralNetworkAnalysis = ({ onPredictions }) => {
    useEffect(() => {
        const initModel = async () => {
            const model = createModel();
            const xs = [1, 2, 3, 4];
            const ys = [5000, 80000, 960000, 50]; // Datos de entrenamiento quemados

            // Entrena el modelo solo una vez
            await trainModel(model, xs, ys);

            // Genera predicciones para los datos del dashboard
            const predictions = predictBatch(model, xs);
            onPredictions(predictions);
        };

        initModel();
    }, []); // Solo se ejecuta una vez cuando el componente se monta

    return (
        <div className="neural-network-analysis">
          
        </div>
    );
};

export default NeuralNetworkAnalysis;
