const {formSchema} = require("../schemas/index")

const validateForm = (req, res) => {

    const formData = req.body;
    formSchema
        .validate(formData)
        .catch(err => {
            res.status(422).send()
            console.log(err.errors)
        })
        .then(valid => {
            if (valid) {
                // res.status(200).send()
                console.log("valid")
            }
        })
}

module.exports = validateForm;