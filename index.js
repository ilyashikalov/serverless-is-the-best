const sharp = require('sharp');

async function cropImage(imageBase64, width, height) {
    try {
        // DEcode image from base64
        const buffer = Buffer.from(imageBase64, 'base64');

        // Обрезаем изображение с помощью sharp
        const croppedBuffer = await sharp(buffer)
            .resize(width, height) // Изменение размеров
            .toBuffer(); // Преобразуем обратно в буфер

        // Кодируем результат в base64
        const croppedImageBase64 = croppedBuffer.toString('base64');
        return croppedImageBase64;
    } catch (error) {
        console.error('Error cropping image:', error);
        throw error;
    }
}

module.exports.handler = async function (event, context) {
    return {
        content: await cropImage(event.content, event.width, event.height)
    };
};

