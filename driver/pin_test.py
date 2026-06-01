from gpiozero import PWMLED
from time import sleep

led = PWMLED(17)

def pulsate(interval): 
    brightness = 0.0
    while brightness <= 1.0:
        led.value = min(brightness, 1.0)
        brightness += interval
        sleep(0.05);

while True: 
    pulsate(0.1);
    
