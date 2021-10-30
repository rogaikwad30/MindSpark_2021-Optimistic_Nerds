module.exports.checkErrors = (err) => {
    let errors = {};
    if (err.code === 11000) {
        duplicateKeys = Object.keys(err.keyPattern);
        duplicateKeys.forEach((key) => {
            errors[key] = "already exists";
        })
    }
    if (err.message.includes('validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}