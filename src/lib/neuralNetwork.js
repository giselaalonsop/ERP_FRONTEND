// lib/neuralNetwork.js
import * as tf from '@tensorflow/tfjs';

// Define la estructura de la red neuronal
export const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    return model;
};

export const trainModel = async (model, xs, ys) => {
    const tensorXs = tf.tensor2d(xs, [xs.length, 1]);
    const tensorYs = tf.tensor2d(ys, [ys.length, 1]);

    await model.fit(tensorXs, tensorYs, {
        epochs: 50,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
            },
        },
    });
};

// Obtener predicciones para un conjunto de entradas
export const predictBatch = (model, inputs) => {
    const tensorInputs = tf.tensor2d(inputs, [inputs.length, 1]);
    const predictions = model.predict(tensorInputs);
    return predictions.dataSync();
};
