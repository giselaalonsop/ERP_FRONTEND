import { useDropzone } from 'react-dropzone'

const DropzoneComponent = ({ onDrop, file }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/*',
    })

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-4 rounded-md cursor-pointer">
            <input {...getInputProps()} />
            {file ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-auto"
                />
            ) : (
                <p className="text-gray-500">
                    Drag & drop an image here, or click to select one
                </p>
            )}
        </div>
    )
}

export default DropzoneComponent
