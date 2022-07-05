const notificationReducer = (state = "", action) => {
    switch (action.type){
        case 'NEW_NOTIFICATION':
            return action.notification
        case 'END_NOTIFICATION':
            return ""
        default:
            return state
    }
}

export const notificationUpdate = (notification, time) => {
    return async dispatch => {
        dispatch({
            type: 'NEW_NOTIFICATION',
            notification,
        })

        setTimeout(() => {
            dispatch({
                type: 'END_NOTIFICATION',
            })
        }, time * 500)
    }
}

export const endNotification = () => {
    return {
        type: 'END_NOTIFICATION'
    }
}

export default notificationReducer