import { useDropzone } from 'react-dropzone'

const DropzoneComponent = ({ onDrop, file }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/*',
    })

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {file ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-32 h-32 object-cover"
                />
            ) : (
                <p className="text-gray-500">
                    Arrastra una imagen aquí, o haz clic para seleccionar una
                    imagen
                </p>
            )}
        </div>
    )
}

export default DropzoneComponent
