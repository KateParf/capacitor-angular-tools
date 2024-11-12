import pixelmatch from 'pixelmatch';

function fetchImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image;
        image.crossOrigin = "anonymous";
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

export async function doCompare(img) {

    const baseUrl = 'http://localhost:44450/assets/';
    const img1 = await fetchImage(baseUrl + 'capture.png');
    const img2 = await fetchImage(baseUrl + 'capture(1).png');
    const { width: w, height: h } = img1;

    //const ctx = DOM.context2d(w, h, 1);
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    let diffCtx = canvas.getContext('2d');

    diffCtx.drawImage(img1, 0, 0);
    const data1 = diffCtx.getImageData(0, 0, w, h).data;
    diffCtx.drawImage(img2, 0, 0);
    const data2 = diffCtx.getImageData(0, 0, w, h).data;
    const diff = diffCtx.createImageData(w, h);

    const r = w / (w * 2);
    //const ctx = DOM.context2d(width, h * r, 2);
    canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h * r;
    const ctx = canvas.getContext('2d');

    const numDifferentPixels = pixelmatch(data1, data2, diff.data, w, h, {threshold: 0.1});
    diffCtx.putImageData(diff, 0, 0);

    return ctx.canvas;
}