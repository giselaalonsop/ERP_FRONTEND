const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null

    return (
        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
            <div className="relative mx-auto shadow-xl rounded-xl bg-white w-full max-w-4xl h-3/4 overflow-y-auto mt-28">
                <div className="absolute py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400 w-full h-full flex flex-col">
                    <div className="w-full flex justify-between text-gray-600 mb-3">
                        <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight">
                            {title}
                        </h1>

                        <button
                            className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                            onClick={onClose}
                            aria-label="close modal"
                            role="button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-x"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-grow">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Modal
