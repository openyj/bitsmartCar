/**
 * IR remote
 */
//% icon="\uf1eb" weight=19
//% color="#99CC32"
namespace microbit_IR {

    /**
    * initialization
    */
    //% blockId=microbit_IR_init
    //% blockGap=20 weight=90
    //% block="IR连接到引脚 %pin"
    //% color="#99CC32"
    //% shim=microbit_IR::init
    export function init(pin: Pins): void {
      return
    }
  
    /**
    * button pushed.
    */
    //% blockId=microbit_IR_received_event
    //% blockGap=20 weight=89
    //% block="按键 |%btn| 按下时"
    //% color="#99CC32"
    //% shim=microbit_IR::onPressEvent
    export function onPressEvent(btn: RemoteButton, body:Action): void {
      return
    }

}