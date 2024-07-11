import React from 'react'
import { useDropzone } from 'react-dropzone'

const DropzoneComponent = ({ onDrop, file }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        maxFiles: 1,
    })

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {file ? (
                <div className="text-center">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-32 h-32 object-cover"
                    />
                    <p>{file.name}</p>
                </div>
            ) : (
                <p>
                    Arrastra una imagen aquí, o haz clic para seleccionar una
                    imagen
                </p>
            )}
        </div>
    )
}

export default DropzoneComponent
