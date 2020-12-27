const axios = require('axios');
const FormData = require('form-data');

const validateRecaptcha = (req, res, next) => {
  var bodyFormData = new FormData();
  bodyFormData.append('secret', process.env.RECAPTCHA_SECRET_KEY);
  bodyFormData.append('response', req.body["g-recaptcha-response"]);
  axios.post("https://www.google.com/recaptcha/api/siteverify", bodyFormData, {
    headers: bodyFormData.getHeaders()
  })
    .then(resp => {
      req.recaptchaVerified = resp.data.success;
      next();
    })
    .catch(err => next(err));
};

module.exports = { validateRecaptcha };