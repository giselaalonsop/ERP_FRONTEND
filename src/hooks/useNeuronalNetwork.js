// hooks/useNeuralNetwork.js
import * as tf from '@tensorflow/tfjs';

export const useNeuralNetwork = () => {
    const trainModel = async () => {
        // Datos de entrenamiento
        const xs = tf.tensor2d([[0], [1], [2], [3]], [4, 1]);
        const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

        // Creación del modelo
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

        // Compilación del modelo
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        // Entrenamiento del modelo
        await model.fit(xs, ys, { epochs: 100 });

        // Predicción
        const output = model.predict(tf.tensor2d([[4]], [1, 1]));

        // Retornar los resultados
        return output.dataSync();
    };

    return { trainModel };
};
