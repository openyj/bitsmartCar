
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/*****************************************************************************************************************************************
 *    智能小车 *****************************************************************************************************************************
 ****************************************************************************************************************************************/
//% color="#FF7F00" weight=21 icon="\uf185"
namespace microbit_CAR{

    export enum Colors {
        //% blockId="Red" block="红色"
        Red = 0x01,
        //% blockId="Green" block="绿色"
        Green = 0x02,
        //% blockId="Blue" block="蓝色"
		Blue = 0x03
    }

    export enum Lights {
        //% block="灯1"
        Light1 = 0x00,
        //% block="灯2"
        Light2 = 0x01,
        //% block="灯3"
        Light3 = 0x02,
        //% block="灯4"
        Light4 = 0x03,
        All = 0x04
    }

    export enum LedForwardIndex {
        //% blockId="LEFT" block="左边"
        LEFT = 0,
        //% blockId="RIGHT" block="右边"
        RIGHT 
    }

    export enum LineSensorIndex {
        //% blockId="LEFT" block="左边"
        LEFT = 0,
        //% blockId="RIGHT" block="右边"
        RIGHT 
    }

    export enum LineState {
        //% blockId="WHITE" block="白线"
        WHITE = 0,
        //% blockId="BLACK" block="黑线"
        BLACK = 1
    }

    export enum LightSensorIndex {
        //% blockId="LEFT" block="左边"
        LEFT = 0,
        //% blockId="RIGHT" block="右边"
        RIGHT 
    }

    export enum MotorIndex {
        //% blockId="MOTOR_LEFT" block="左边"
        LEFT = 0,
        //% blockId="MOTOR_RIGHT" block="右边"
        RIGHT 
    }

    export enum MotorState {
        //% blockId="MOTOR_STOP" block="停止"
        STOP = 0,
        //% blockId="MOTOR_FOREWARD" block="正转"
        FOREWARD,
        //% blockId="MOTOR_BACKWARD" block="反转"
        BACKWARD
    }

    export enum CarState {
        //% blockId="CAR_STOP" block="停止"
        STOP = 0,
        //% blockId="CAR_FOREWARD" block="前行"
        FOREWARD,
        //% blockId="CAR_LEFT_FOREWARD" block="左前行"
        LEFT_FOREWARD,
        //% blockId="CAR_RIGHT_FOREWARD" block="右前行"
        RIGHT_FOREWARD,
        //% blockId="CAR_BACKWARD" block="后退"
        BACKWARD,
        //% blockId="CAR_LEFT_BACKWARD" block="左后退"
        LEFT_BACKWARD,
        //% blockId="CAR_RIGHT_BACKWARD" block="右后退"
        RIGHT_BACKWARD
    }

    //var
    let lineSensorThrold : number = 400;
    let edgeSensorThrold : number = 400;
    let lhRGBLight: MICROBITRGBLight.MICROBITLHRGBLight;

    //% blockId=mbit_IoSet block="设置引脚|%pin 值为|%value"
    //% weight=100
    //% blockGap=10
    //% color="#FF7F00"
    //% value.min=0 value.max=1
    export function IoSet(pin: DigitalPin, value: number): void {

        pins.setPull(pin, PinPullMode.PullUp);
        pins.digitalWritePin(pin, value);
    }

    //% blockId=mbit_MotroCtrl block="设置 |%index 电机状态为|%state"
    //% weight=100
    //% blockGap=10
    //% color="#FF7F00"
    export function MotorCtrl(index: MotorIndex, state: MotorState): void {
        switch(index)
        {
                case MotorIndex.RIGHT:
                    switch(state)
                    {
                        case MotorState.STOP:
                            pins.setPull(DigitalPin.P5, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P5, 0);
                            pins.setPull(DigitalPin.P11, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P11, 0);
                            break;
                        break;
                    case MotorState.FOREWARD:
                            pins.setPull(DigitalPin.P5, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P5, 1);
                            pins.setPull(DigitalPin.P11, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P11, 0);
                            break;
                        break;
                    case MotorState.BACKWARD:
                            pins.setPull(DigitalPin.P5, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P5, 0);
                            pins.setPull(DigitalPin.P11, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P11, 1);
                            break;
                        break;                   
                        default:
                        break;
                    }
                    break;
                case MotorIndex.LEFT:
                    switch(state)
                    {
                        case MotorState.STOP:
                            pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P15, 0);
                            pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P14, 0);
                            break;
                    case MotorState.FOREWARD:
                            pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P15, 1);
                            pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P14, 0);
                            break;
                    case MotorState.BACKWARD:
                            pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P15, 0);
                            pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                            pins.digitalWritePin(DigitalPin.P14, 1);
                            break;               
                        default:
                        break;
                    }
                    break;
                default:
                break;
        }
    }

   //% blockId=mbit_CarCtrl block="设置小车状态为|%state"
    //% weight=100
    //% blockGap=10
    //% color="#FF7F00"
    export function CarCtrl(state: CarState): void {
        switch(state)
        {
                case CarState.STOP:
                    //停止
                    MotorCtrl(MotorIndex.LEFT, MotorState.STOP);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.STOP);
                    break;
                case CarState.FOREWARD:
                    //前行
                    MotorCtrl(MotorIndex.LEFT, MotorState.FOREWARD);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.FOREWARD);
                    break;
                case CarState.LEFT_FOREWARD:
                    //左前行
                    MotorCtrl(MotorIndex.LEFT, MotorState.STOP);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.FOREWARD);
                    break;
                case CarState.RIGHT_FOREWARD:
                   //右前行
                    MotorCtrl(MotorIndex.LEFT, MotorState.FOREWARD);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.STOP);
                    break;
                case CarState.BACKWARD:
                    //后退
                    MotorCtrl(MotorIndex.LEFT, MotorState.BACKWARD);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.BACKWARD);
                    break;
                case CarState.LEFT_FOREWARD:
                    //左后退
                    MotorCtrl(MotorIndex.LEFT, MotorState.STOP);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.BACKWARD);
                    break;
                case CarState.RIGHT_FOREWARD:
                   //右后退
                    MotorCtrl(MotorIndex.LEFT, MotorState.BACKWARD);
                    MotorCtrl(MotorIndex.RIGHT, MotorState.STOP);
                    break;                               
                default:
                break;
        }
    }

    /**
	 * Initialize RGB
	 */
	function initRGBLight() {
		if (!lhRGBLight) {
			lhRGBLight = MICROBITRGBLight.create(DigitalPin.P12, 4, RGBPixelMode.RGB);
		}
    }
    
    /**
         * Set the brightness of the strip. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
    */
    //% blockId="mbit_setBrightness" block="设置彩灯亮度 %brightness"
    //% weight=87
    //% blockGap=10
    //% color="#8E236B"
    //% brightness.min=0 brightness.max=255
    export function setBrightness(brightness: number): void {
        //init
        initRGBLight();
        lhRGBLight.setBrightness(brightness);
    }
     
    /**
     * Set the color of the colored lights, after finished the setting please perform  the display of colored lights.
     */
    //% blockId=mbit_setPixelRGB block="设置彩灯| %lightoffset|颜色为 %rgb"
    //% weight=86
    //% blockGap=10
    //% color="#8E236B"
    export function setPixelRGB(lightoffset: Lights, rgb: RGBColors)
    {
        //init
        initRGBLight();
        lhRGBLight.setPixelColor(lightoffset, rgb);
    }
    /**
     * Set RGB Color argument
     */
    //% blockId=mbit_setPixelRGBArgs block="设置彩灯| %lightoffset|颜色为 %rgb"
    //% weight=85
    //% blockGap=10
    //% color="#8E236B"
    export function setPixelRGBArgs(lightoffset: Lights, rgb: number)
    {
        //init
        initRGBLight();
        lhRGBLight.setPixelColor(lightoffset, rgb);
    }

    /**
     * Display the colored lights, and set the color of the colored lights to match the use. After setting the color of the colored lights, the color of the lights must be displayed.
     */
    //% blockId=mbit_showLight block="显示彩灯"
    //% weight=84
    //% blockGap=10
    //% color="#8E236B"
    export function showLight() {
        //init
        initRGBLight();
        lhRGBLight.show();
    }

    /**
     * Clear the color of the colored lights and turn off the lights.
     */
    //% blockId=mbit_mbit_clearLight block="关闭彩灯"
    //% weight=83
    //% blockGap=10
    //% color="#8E236B"
    export function clearLight() {
        //init
        initRGBLight();
        //operate
        lhRGBLight.clear();
    }

    //% blockId=mbit_LineSensorChk block="检测到 |%index 寻迹传感器状态为 |%state"
    //% weight=100
    //% blockGap=10
    //% color="#9932CD"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function LineSensorChk(index: LineSensorIndex, state: LineState): boolean {

        let temp: boolean = false;

        switch (index) {
            case LineSensorIndex.LEFT: {
                if (lineSensorThrold > pins.analogReadPin(AnalogPin.P2)) {
                    if (state == LineState.WHITE) {
                        temp = true;
                    }
                }
                else {
                    if (state == LineState.BLACK) {
                        temp = true;
                        serial.writeNumber(lineSensorThrold);
                    }
                }
                break;
            }

            case LineSensorIndex.RIGHT: {
                if (lineSensorThrold > pins.analogReadPin(AnalogPin.P1)) {
                    if (state == LineState.WHITE) {
                        temp = true;
                    }
                }
                else {
                    if (state == LineState.BLACK) {
                        temp = true;
                    }
                }
                break;
            }
        }
        return temp;
    }

    //% blockId=mbit_LineSensorThreshold block="初始化寻迹传感器灵敏度（10-100） |%value"
    //% weight=100
    //% blockGap=10
    //% color="#9932CD"
    //% value.min=10 value.max=100
    export function mbit_LineSensorThreshold(value: number): void {
        lineSensorThrold = (100-value)*1024/100;
    }

    //% blockId=mbit_EdgeSensorChk block="|%index 边缘传感器检查到边缘"
    //% weight=100
    //% blockGap=10
    //% color="#9932CD"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function EdgeSensorChk(index: LineSensorIndex): boolean {
        switch (index) {
            case LineSensorIndex.LEFT: 
                if (edgeSensorThrold < pins.analogReadPin(AnalogPin.P2)) 
                {
                    return true;
                }
                return false;
            break;
            case LineSensorIndex.RIGHT:
                if (edgeSensorThrold < pins.analogReadPin(AnalogPin.P1)) 
                {
                    return true;
                }
                return false;
            break;
            default:
            break;
        }
        return false;
    }

    //% blockId=mbit_EdgeSensorThreshold block="初始化边缘传感器灵敏度（10-100） |%value"
    //% weight=100
    //% blockGap=10
    //% color="#9932CD"
    //% value.min=10 value.max=100
    export function mbit_EdgeSensorThreshold(value: number): void {
        edgeSensorThrold = (100-value)*1024/100;
    }
    
    //% blockId=mbit_LightSensorValueGet block="|%index 亮度传感器值(0-100)"
    //% weight=100
    //% blockGap=10
    //% color="#0000FF"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function LightSensorValueGet(index: LightSensorIndex): number {

        let temp: number = 0;

        switch (index) {
            case LightSensorIndex.LEFT: {
                temp = pins.analogReadPin(AnalogPin.P1);
                temp = temp * 100 /1024;
                break;
            }

            case LightSensorIndex.RIGHT: {
                temp = pins.analogReadPin(AnalogPin.P2);
                temp = temp * 100 /1024;
                break;
            }
        }
        return temp;
    }

    //% blockId=mbit_UltraSensorValueGet block="超声检测距离(cm)"
    //% color="#0000FF"
    //% weight=100
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function UltraSensorValueGet(): number {

        // send pulse   
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
		        pins.digitalWritePin(DigitalPin.P13, 0);
		        control.waitMicros(2);
		        pins.digitalWritePin(DigitalPin.P13, 1);
		        control.waitMicros(15);
		        pins.digitalWritePin(DigitalPin.P13, 0);
		
		        let d = pins.pulseIn(DigitalPin.P8, PulseValue.High, 43200);
		        list[i] = Math.floor(d / 40)
        }
        list.sort();
        let length = (list[1] + list[2] + list[3])/3;
        return  Math.floor(length);
    }

    //% blockId=mbit_carInit block="初始化小车"
    //% weight=100
    //% blockGap=10
    //% color="#FF7F00"
    export function carInit(): void {
        //
    }
}