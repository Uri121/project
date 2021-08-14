
const handleRes = (res) => {
    return {
        success: true,
        payload: res
    }
}

const handleError = (funcName, err) => {
    console.error(`Error in ${funcName}: `, err.message)
    return {
        success: false,
        error: err.message
    }
}


exports.handleRes = handleRes
exports.handleError = handleError