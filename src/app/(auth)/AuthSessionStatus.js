const AuthSessionStatus = ({ status, className, ...props }) => (
    <>
        {status && (
            <div
                className={`${className} font-medium text-sm text-gray-700`}
                {...props}>
                {status}
            </div>
        )}
    </>
)

export default AuthSessionStatus
