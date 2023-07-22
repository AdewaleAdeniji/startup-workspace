const axios = require("axios");

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;

exports.sendEmail = (to: string, templated: boolean, payload: any) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: "Genelyst",
      to: to,
      customUser: false,
      ...payload,
    });
    console.log(data)
    const config = {
      method: "post",
      url: templated
        ? `${EMAIL_SERVICE_URL}/template/${payload.templateKey}`
        : EMAIL_SERVICE_URL,
      headers: {
        Authorization: "Bearer api-key-test",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response: any) {
        const responseData = JSON.stringify(response.data);
        resolve({ status: true, data: responseData });
      })
      .catch(function (error: any) {
        reject({
          status: false,
          data: null,
        });
      });
  });
};
