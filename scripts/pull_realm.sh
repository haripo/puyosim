#!/usr/bin/env bash

adb -e shell "
run-as com.puyosimulator.debug \
cp /data/data/com.puyosimulator.debug/files/default.realm /sdcard/
exit
"
adb -e pull /sdcard/default.realm default.realm