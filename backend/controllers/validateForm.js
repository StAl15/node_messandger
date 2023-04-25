const {formSchema} = require("../schemas/index")

const validateForm = (req, res, next) => {

    const formData = req.body;
    formSchema
        .validate(formData)
        .catch(() => {
            res.status(422).send()
        })
        .then(valid => {
            if (valid) {
                console.log("valid")
                next()
            } else {
                res.status(422).send()
            }
        })
}

module.exports = validateForm;