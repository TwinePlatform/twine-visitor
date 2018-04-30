const PdfPrinter = require('pdfmake');
const axios = require('axios');

const encode64 = async (url) => {
  const result = await axios.get(url);
  return Buffer.from(result.data).toString('base64');
};

const getPdf = (
  QRcodeBase64Url,
  image,
  columns,
  textMargin,
  textAlignment,
  resolve,
  reject
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

  doc.on('data', chunk => {
    chunks.push(chunk);
  });

  doc.on('end', () => {
    resolve(Buffer.concat(chunks).toString('base64'));
  });

  doc.on('error', () => {
    reject('Error building doc');
  });
  doc.end();
};

module.exports = (QRcodeBase64Url, image) =>
  new Promise((resolve, reject) => {
    if (image) {
      encode64(image)
        .then(image => {
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
            reject
          );
        })
        .catch(reject);
    } else {
      const columns = [
        {
          image: `${__dirname}/../../client/src/assets/images/qrcodelogo.png`,
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
        reject
      );
    }
  });
