const Notification = ({ errorMessage, successMessage }) => {
    if(errorMessage !== null){
        return (
            <div className='notification error'>
                {errorMessage}
            </div>
        )
    } else if (successMessage !== null){
        return (
            <div className='notification success'>
                {successMessage}
            </div>
        )
    }

    return null
}

export default Notification