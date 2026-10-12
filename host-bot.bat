@echo off
chcp 65001 > nul
title 바다거북 수프 식탁 - 출제자 봇
cd /d "%~dp0"
node tools\build.mjs
node tools\host-bot.mjs
pause
