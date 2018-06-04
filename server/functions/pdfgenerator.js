const PdfPrinter = require('pdfmake');
const axios = require('axios');
const path = require('path');

const encode64 = async (url) => {
  const isJpeg = ['.jpg', '.jpeg'].some((s) => url.endsWith(s));
  const pngUrl = isJpeg ? url.replace(/\.(jpg|jpeg)$/, '.png') : url;
  const result = await axios.get(pngUrl, { responseType: 'arraybuffer' });
  return Buffer.from(result.data, 'binary').toString('base64');
};

const getPdf = (
  QRcodeBase64Url,
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

  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  doc.on('end', () => {
    resolve(Buffer.concat(chunks).toString('base64'));
  });

  doc.on('error', reject);
  doc.end();
};

module.exports = (QRcodeBase64Url, image) =>
  new Promise((resolve, reject) => {
    if (image) {
      encode64(image)
        .then((encodedImage) => {
          const columns = [
            {
              image: `data:image/png;base64,${encodedImage}`,
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
          image: path.resolve(__dirname, '..', '..', 'client', 'src', 'shared', 'assets', 'images', 'qrcodelogo.png'),
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
        columns,
        [0, -10, 10, 0],
        'right',
        resolve,
        reject
      );
    }
  });
