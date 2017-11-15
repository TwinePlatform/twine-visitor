const PdfPrinter = require('pdfmake');

module.exports = (QRcodeBase64Url)=>{
  var fontDescriptors = {
    Roboto: {
      normal: __dirname + '/../public/Roboto/Roboto-Regular.ttf',
      bold: __dirname + '/../public/Roboto/Roboto-Medium.ttf',
      italics: __dirname + '/../public/Roboto/Roboto-Italic.ttf',
      bolditalics: __dirname + '/../public/Roboto/Roboto-MediumItalic.ttf',
    }
  };

  const docDefinition = {
    content: [
      {
        image: __dirname + '/../src/qrcodelogo.png'
      },
      {
        text: 'Please use the QR code below to visit us',
        fontSize: 40
      },
      {
        image: QRcodeBase64Url
      }
    ]
  }

  return new Promise((resolve, reject)=>{
    var printer = new PdfPrinter(fontDescriptors);

    var doc = printer.createPdfKitDocument(docDefinition);

    var chunks = [];
    var result;

    doc.on('data', function (chunk) {
      chunks.push(chunk);
    });
    doc.on('end', function () {
      result = Buffer.concat(chunks);
      resolve(result.toString('base64'));
      reject("Couldn't generate PDF")
    });
    doc.end();
  })
}
