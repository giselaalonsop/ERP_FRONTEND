const AuthCard = ({ logo, children }) => (
    <>
    <div className=" flex justify-content-between bg-slate-100">
        <div>{logo}</div>
    </div>
    <div>
        <div className="">
            {children}
        </div>
    </div>
    </>
)

export default AuthCard
