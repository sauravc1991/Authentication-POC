#!/usr/bin/env python
# -*- coding: utf8 -*-

import RPi.GPIO as GPIO
import signal
import time
import Adafruit_CharLCD as LCD
import MFRC522
import requests
import os

continue_reading = True

GPIO.setwarnings(False)

# Raspberry Pi pin setup
lcd_rs = 20
lcd_en = 24
lcd_d4 = 23
lcd_d5 = 17
lcd_d6 = 18
lcd_d7 = 22
lcd_backlight = 2

# Define LCD column and row size for 16x2 LCD.
lcd_columns = 16
lcd_rows = 2

lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7, lcd_columns, lcd_rows, lcd_backlight)
#GPIO.setmode(GPIO.BOARD)
#os.system("cd ~/servo/scary-gadgets-1/raspberrypi-src")

# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    lcd.clear()
    global continue_reading
    print "Ctrl+C captured, ending read."
    continue_reading = False
    GPIO.cleanup()
# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)
#os.system("nodejs /home/pi/node_test/NodePython/server.js")
lcd.clear()
lcd.message('System Started')
time.sleep(2)
lcd.clear()
# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# Welcome message
#time.sleep(4)
print "Welcome to the MFRC522 data read example"
print "Press Ctrl-C to stop."

# This loop keeps checking for chips. If one is near it will get the UID and authenticate
while continue_reading:

    # Scan for cards
    (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # If a card is found
    if status == MIFAREReader.MI_OK:
        print "Card detected"

        #os.system("cd ~/servo/scary-gadgets-1/raspberrypi-src/")
        #os.system("python servocontrol.py")
        #os.system("ls")


    # Get the UID of the card
    (status,uid) = MIFAREReader.MFRC522_Anticoll()

    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:

        # Print UID
        print "Card read UID: "+str(uid[0])+","+str(uid[1])+","+str(uid[2])+","+str(uid[3])
 uidtext=str(uid[0])+str(uid[1])+str(uid[2])+str(uid[3])

        lcd.clear()
        lcd.message('Card Detected\n'+uidtext)

        #r = requests.get('http://127.0.0.1:8000/api/')
        r = requests.post('http://127.0.0.1:8000/cardDetect', data = {'uid':uidtext})
       # os.system("cd ~/servo/scary-gadgets-1/raspberrypi-src")
        os.system("python servocontrol.py")

        #r = requests.get('http://127.0.0.1:3000/api/')
        #r = requests.post('http://127.0.0.1:3000/api/cardDetect', data = {'uid':uidtext})
        time.sleep(5)

        # This is the default key for authentication
        key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]

        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)
  # Authenticate
        status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)


        # Check if authenticated
        if status == MIFAREReader.MI_OK:
            MIFAREReader.MFRC522_Read(8)
            MIFAREReader.MFRC522_StopCrypto1()

        else:
            print "Authentication error"
