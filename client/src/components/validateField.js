export const validateFields = (fields) => {
    const regexEmail = new RegExp(/^\S+@\S+\.\S+$/)
    let error = {};
    for (const field of Object.entries(fields)) {
        //check is empty 
        if (field[1] === '') {
            error[`${field[0]}Error`] = `${field[0]} field cant be empty`;
        }

        if (field[0] === 'email') {
            if (!regexEmail.test(field[1])) {
                error['emailError'] = 'Email is invalid'
            }
        }

    }

    return error
}