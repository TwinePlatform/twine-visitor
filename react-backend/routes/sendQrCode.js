const postmark = require("postmark");

const QrCodeMaker = require("../functions/qrcodemaker");
const client = new postmark.Client("89eaa2ad-8f62-474d-9a13-7782eecdd603");

const sendQrCode = function(email, name, hash) {
  if (!email) return console.log("Missing the person to deliver this email to");
  const newhash = QrCodeMaker(hash)
    .then((url) => {
      const qrcontent = url.slice(22);
      client.sendEmailWithTemplate({
        "From": "dev@milfordcapitalpartners.com",
        "TemplateId": 3843402,
        "To": email,
        "TemplateModel": {
          "name": name,
          "hash": url
        },
        "Attachments": [{
          "Name": "qrcode.png",
          "Content": qrcontent,
          "ContentType": "image/png"
        }]
      }, function(error, result) {
        if (error) {
          console.error("Unable to send via postmark: " + error.message);
          return;
        }
        console.info("Sent to postmark for delivery");
      })
    })

}

module.exports = {
  sendQrCode
}
