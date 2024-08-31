import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genKey = process.env.GEMINI_API_KEY || ''; 
const genAI = new GoogleGenerativeAI(genKey);

class ImageService {
  private genAI: GoogleGenerativeAI;
  private uploadsPath: string;

  constructor() {
    this.genAI = genAI;
    this.uploadsPath = path.join(__dirname, '..', 'uploads'); 
  }

  public async processImage(imageBase64: string): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const mimeType = this.mimeType(imageBase64);
      if (!mimeType) {
        throw new Error('Unsupported image type');
      }

      const prompt = "return only the numeric value in the image";
      const image = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType, 
        }
      };

      const result = await model.generateContent([prompt, image]);
      const value = parseFloat(result.response.text().trim());

      if (isNaN(value)) {
        throw new Error('INVALID_NUMBER');
      }

      return value;
    } catch (err) {
      console.error('Error processing image:', err);
      throw new Error('Failed to process image');
    }
  }

  public saveImage(imageBase64: string, fileName: string): string {
    const mimeType = this.mimeType(imageBase64);
    if (!mimeType) {
      throw new Error('Unsupported image type');
    }

    const filePath = path.join(this.uploadsPath, fileName);
    
    const base64Data = imageBase64.replace(`data:${mimeType};base64,`, '');
    
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    return `http://localhost:3000/uploads/${fileName}`;
  }

  private mimeType(imageBase64: string): string | null {
    const mimeTypes = {
      'jpeg': 'image/jpeg',
      'png': 'image/png',
    };

    for (const [ext, mimeType] of Object.entries(mimeTypes)) {
      if (imageBase64.startsWith(`data:${mimeType};base64,`)) {
        return mimeType;
      }
    }

    return null; 
  }
}

export default ImageService;
