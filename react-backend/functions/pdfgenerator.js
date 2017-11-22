const PdfPrinter = require('pdfmake');

module.exports = QRcodeBase64Url => {
  const fontDescriptors = {
    Roboto: {
      normal: `${__dirname}/../public/Roboto/Roboto-Regular.ttf`,
      bold: `${__dirname}/../public/Roboto/Roboto-Medium.ttf`,
      italics: `${__dirname}/../public/Roboto/Roboto-Italic.ttf`,
      bolditalics: `${__dirname}/../public/Roboto/Roboto-MediumItalic.ttf`,
    },
  };

  const docDefinition = {
    info: {
      title: 'Visitor QRCode',
      author: 'Power To Change',
    },

    pageSize: 'C8',
    pageOrientation: 'landscape',
    pageMargins: [5, 5, 5, 5],

    content: [
      {
        columns: [
          {
            image: `${__dirname}/../public/qrcodelogo.png`,
            width: 38,
            height: 129.5,
            margin: [0, 10, 0, 0],
          },
          {
            image: QRcodeBase64Url,
            margin: [25, 5, 0, 0],
            fit: [125, 125],
          },
        ],
      },
      {
        text: 'Use this QR Code to sign in',
        fontSize: 14,
        alignment: 'right',
        margin: [0, -10, 10, 0],
        color: '#0a092a',
      },
    ],
  };

  return new Promise((resolve, reject) => {
    const printer = new PdfPrinter(fontDescriptors);

    const doc = printer.createPdfKitDocument(docDefinition);

    const chunks = [];
    let result;

    doc.on('data', chunk => {
      chunks.push(chunk);
    });
    doc.on('end', () => {
      result = Buffer.concat(chunks);
      resolve(result.toString('base64'));
      reject("Couldn't generate PDF");
    });
    doc.end();
  });
};
