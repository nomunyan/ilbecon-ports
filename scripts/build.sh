#!/bin/bash

electron-forge make --platform=linux --targets=@electron-forge/maker-deb
electron-forge make --platform=linux --targets=@electron-forge/maker-rpm
electron-forge make --platform=win32 --targets=@electron-forge/maker-zip
electron-forge make --platform=darwin --targets=@electron-forge/maker-zip

mv ./out/make/deb/x64/ilbecon-ports_${npm_package_version}_amd64.deb ./out/ubuntu.deb
mv ./out/make/rpm/x64/ilbecon-ports-${npm_package_version}-1.x86_64.rpm ./out/fedora.rpm
mv ./out/make/zip/win32/x64/ilbecon-ports-win32-x64-${npm_package_version}.zip ./out/windows.zip
mv ./out/make/zip/darwin/x64/ilbecon-ports-darwin-x64-${npm_package_version}.zip ./out/macos.zip
