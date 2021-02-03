/**
 * RGBLight package
 */

enum RGBColors {
    //% block=红色
    Red = 1,
    //% block=橘色
    Orange = 2,
    //% block=黄色
    Yellow = 3,
    //% block=绿色
    Green = 4,
    //% block=蓝色
    Blue = 5,
    //% block=靛蓝色
    Indigo = 6,
    //% block=紫罗兰色
    Violet = 7,
    //% block=紫色
    Purple = 8,
    //% block=白色
    White = 9,
    //% block=关闭
    Off = 10  
}

/**
 * Different modes for RGB or RGB+W RGBLight LHRGBLight
 */
enum RGBPixelMode {
    //% block="RGB (GRB format)"
    RGB = 0,
    //% block="RGB+W"
    RGBW = 1,
    //% block="RGB (RGB format)"
    RGB_RGB = 2
}

/**
 * RGBLight Functions
 */
namespace MICROBITRGBLight {
    //% shim=sendBufferAsm
    //% parts="RGBLight"
    function sendBuffer(buf: Buffer, pin: DigitalPin) {

    }

    /**
    * A RGBLight class
    */
    export class MICROBITLHRGBLight {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: RGBPixelMode;

        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
            // don't yield to avoid races on initialization
        }

        setPixelColor(pixeloffset: number, rgb: RGBColors): void {
            if (pixeloffset == this._length)//全部
            {
                for (let i = 0; i < this._length; i++)
                {
                    this.setPixelRGB(i, rgb);     
                }
            }
            else
            {
                this.setPixelRGB(pixeloffset, rgb);
            }
        }

        private setPixelRGB(pixeloffset: number, rgb: RGBColors): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;
            let tureRgb = 0;
            switch (rgb)
            {
                case RGBColors.Red:
                    tureRgb = 0xFF0000;
                    break;    

                case RGBColors.Orange:
                    tureRgb = 0xFFA500;    
                    break;    

                case RGBColors.Yellow:
                    tureRgb = 0xFFFF00;
                    break;    
                    
                case RGBColors.Green:
                    tureRgb = 0x00FF00;    
                    break;    

                    case RGBColors.Blue:
                    tureRgb = 0x0000FF;
                    break;    
                    
                case RGBColors.Indigo:
                    tureRgb = 0x4b0082;    
                    break;    

                case RGBColors.Violet:
                    tureRgb = 0x8a2be2;
                    break;    
                    
                case RGBColors.Purple:
                    tureRgb = 0xFF00FF;    
                    break;   

                case RGBColors.White:
                    tureRgb = 0xFFFFFF;    
                    break;  
                case RGBColors.Off:
                    tureRgb = 0x000000;    
                    break;  
            }

            let red;
            let green;
            let blue;

            if((pixeloffset == 2) || (pixeloffset == 3))
            {
                //WS2812B
                red = unpackG(tureRgb);
                green = unpackR(tureRgb);
                blue = unpackB(tureRgb);
            }
            else
            {
                red = unpackR(tureRgb);
                green = unpackG(tureRgb);
                blue = unpackB(tureRgb);
            }

            let stride = this._mode === RGBPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === RGBPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        show() {
            sendBuffer(this.buf, this.pin);
        }

        clear(): void {
            const stride = this._mode === RGBPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
            this.show();
        }
    }
    export function create(pin: DigitalPin, numleds: number, mode: RGBPixelMode): MICROBITLHRGBLight {
        let light = new MICROBITLHRGBLight();
        let stride = mode === RGBPixelMode.RGBW ? 4 : 3;
        light.buf = pins.createBuffer(numleds * stride);
        light.start = 0;
        light._length = numleds;
        light._mode = mode;
        light.setBrightness(255);
        light.setPin(pin);
        return light;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }
}
