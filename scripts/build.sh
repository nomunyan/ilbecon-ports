#!/bin/bash

electron-forge make --platform=linux --targets=@electron-forge/maker-deb
electron-forge make --platform=linux --targets=@electron-forge/maker-rpm
electron-forge make --platform=win32 --targets=@electron-forge/maker-zip
electron-forge make --platform=darwin --targets=@electron-forge/maker-zip

echo "::set-output name=ubuntu::ilbecon-ports_${npm_package_version}_amd64.deb"
echo "::set-output name=fedora::ilbecon-ports-${npm_package_version}-1.x86_64.rpm"
echo "::set-output name=win32::ilbecon-ports-win32-x64-${npm_package_version}.zip"
echo "::set-output name=macos::ilbecon-ports-darwin-x64-${npm_package_version}.zip"
