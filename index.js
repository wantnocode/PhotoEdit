import sharp from 'sharp';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { promises as fs } from 'fs';
import { config } from './config.js'



async function recognizeTable(imagePath) {
  // 预处理操作
  await sharp(imagePath)
    // .resize(300) 
    .sharpen()
    // .greyscale()
    .normalize(99)
    .toFile('processedImage.jpg');


  // 加载图像
  await loadImage('processedImage.jpg').then((image) => {
    const w = image.width;
    const h = image.height;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    const mode = process.env.npm_config_mode ? process.env.npm_config_mode : 'nomal';
    ctx.drawImage(image, 0, 0, w, h);
    
    if(mode == "cover"){
      ctx.shadowBlur = 20;
      ctx.fillStyle = config.bgFillStyle;
      ctx.fillRect(0, 0, w, h);
    }
    
    
    const t = process.env.npm_config_text;
    const size = config.fontSize == 'fill' ? Math.min(w,h) / t.length :  config.fontSize;
    ctx.fillStyle = config.fontFillStyle;
    ctx.font = size + 'px Arial';

    
    let x = (w - size) / 2 - 25 * t.length,y = size;
    if ( config.fontMethod == 'transverse'){
      ctx.fillText(t, x, y);
    }else{
      t.split('').forEach((character) => {
        ctx.fillText(character, x, y);
        // if
        x += 100;
        y += size; 
      });
    }
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFile('output.png', buffer);
  });
}


recognizeTable(config.imagePath)



