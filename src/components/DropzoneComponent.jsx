import { useDropzone } from 'react-dropzone'
import { useState } from 'react'

const DropzoneComponent = ({ onDrop }) => {
    const [file, setFile] = useState(null)

    const handleDrop = acceptedFiles => {
        const selectedFile = acceptedFiles[0]
        setFile(selectedFile)
        onDrop(selectedFile)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        multiple: false,
        accept: 'image/*',
    })

    return (
        <div
            {...getRootProps()}
            className={`dropzone border-2 border-dashed cursor-pointer rounded-lg p-4 flex flex-col items-center justify-center transition-colors duration-300 ${
                isDragActive
                    ? 'border-blue-600 bg-blue-100'
                    : 'border-gray-300 bg-gray-50'
            }`}
            style={{ width: '350px', height: '140px' }}>
            <input {...getInputProps()} />
            {file ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <p className="text-gray-500 text-center">
                    Arrastra una imagen aquí, o haz clic para seleccionar una
                    imagen
                </p>
            )}
        </div>
    )
}

export default DropzoneComponent
