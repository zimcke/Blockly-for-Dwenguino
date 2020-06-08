#!/bin/bash
/home/ubuntu/Blockly-for-Dwenguino/node_modules/electron/dist/electron /home/ubuntu/Blockly-for-Dwenguino/Blockly-for-Dwenguino/index.html --no-sandbox &
electronPid=$!
node --experimental-modules /home/ubuntu/Blockly-for-Dwenguino/backend/index.js &
nodePid=$!
echo "DwenguinoBlockly is running"
wait $electronPid
kill $nodePid
echo "Quitting DwenguinoBlockly"
