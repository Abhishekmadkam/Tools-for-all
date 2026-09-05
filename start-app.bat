@echo off
title Tools-for-all App
cd /d "%~dp0"

where py >nul 2>&1
if %errorlevel%==0 goto RUN_PY

where python >nul 2>&1
if %errorlevel%==0 goto RUN_PYTHON

echo Python is not installed.
echo Install Python from https://www.python.org/downloads/
pause
exit /b

:RUN_PY
start "" "http://localhost:8000"
py -m http.server 8000
exit /b

:RUN_PYTHON
start "" "http://localhost:8000"
python -m http.server 8000
exit /b
