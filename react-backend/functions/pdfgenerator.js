const PdfPrinter = require('pdfmake');
const base64 = require('node-base64-image');

module.exports = (QRcodeBase64Url, image) =>
  new Promise((resolve, reject) => {
    if (image) {
      base64.encode(image, { string: true }, (err, image) => {
        if (err) {
          return reject(err);
        }
        const columns = [
          {
            image: `data:image/png;base64, ${image}`,
            margin: [5, 5, 0, 0],
            fit: [100, 100],
          },
          {
            image: QRcodeBase64Url,
            margin: [-5, -3, 5, 0],
            fit: [115, 115],
          },
        ];
        getPdf(
          QRcodeBase64Url,
          image,
          columns,
          [0, 10, 10, 0],
          'center',
          resolve,
          reject,
        );
      });
    } else {
      const columns = [
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
      ];
      getPdf(
        QRcodeBase64Url,
        undefined,
        columns,
        [0, -10, 10, 0],
        'right',
        resolve,
        reject,
      );
    }
  });

getPdf = (
  QRcodeBase64Url,
  image,
  columns,
  textMargin,
  textAlignment,
  resolve,
  reject,
) => {
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
        columns,
      },
      {
        text: 'Use this QR Code to sign in',
        fontSize: 14,
        alignment: textAlignment,
        margin: textMargin,
        color: '#0a092a',
      },
    ],
  };

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
};
