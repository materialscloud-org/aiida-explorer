[![Build Status](https://github.com/materialscloud-org/aiida-explorer/workflows/Build/badge.svg)](https://github.com/materialscloud-org/aiida-explorer/actions)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/materialscloud-org/aiida-explorer/blob/master/LICENSE)

AiiDA provenance explorer
=========================

This AngularJS application powers the EXPLORE section of the Materials Cloud at www.materialscloud.org/explore

## Architecture

The app fetches configuration information from an endpoint returning a JSON file ([example](https://dev-www.materialscloud.org/mcloud/api/v2/explore/profiles)).
The JSON object contains a list AiiDA REST API endpoints as well as some optional metadata.

The location of the JSON endpoint as well as the prefix for the AiiDA REST API endpoints is configured in `Gruntfile.js`.


## Technologies

* AngularJS
* Bootstrap 3
* SaSS
* Bower, Grunt, Karma
* UI Widget Toolkit: Vis.js, Kendo UI, Highchart, JSmol

## Branches

* **develop:** (default) The development branch
* **staging:** Used for staging and production servers

## Development Setup

### Ubuntu 16.04

Install nodejs and npm:

```bash
sudo apt-get install nodejs npm
```

> **Note:** If you get errors like **"E: Unable to correct problems, you have held broken packages**", install the packages from source distribution. 

Install yo, bower, grunt
```bash
sudo npm install --global yo bower grunt-cli sass
```

> **Note.** If you get an error like:

```bash
sh: 1: node: not found
npm WARN This failure might be due to the use of legacy binary "node"
npm WARN For further explanations, please read /usr/share/doc/nodejs/README.De"**
```

, install nodejs-legacy:

```bash
sudo apt-get install nodejs-legacy
```

Install angular using npm
```bash
sudo npm install --global generator-angular@0.11.1
```

### OSX

Download and Install node and npm from OSX [installer](https://nodejs.org/en/download/)

Update npm
```bash
sudo npm install -g npm
```

Install grunt-cli, bower, yo, generator-karma, generator-angular:
```bash
sudo npm install -g grunt-cli bower yo generator-karma generator-angular
```

Install ruby gems for SaSS
```bash
sudo gem install sass bundler
```

## Building 
NPM, Grunt and Bower toolchain is used in order to automate the build process of Materials Cloud web portal. 
Assuming these tools are already installed, one can build the **distribution** folder using:

```bash
git clone git@github.com:materialscloud-org/frontend-explore.git
cd frontend-explore
npm install && bower install
grunt build
```
This will build the **dist** folder inside the frontend-explore which can be deployed on the server.

## Deployment

If you have received the **distribution** folder, you can run simple python web server as:
```bash
cd frontend-explore/dist
python -m http.server
```
This will start simple http server from the directory which can be accessible at [http://localhost:8000](http://localhost:8000)

## License

MIT

## Acknowledgements

This work is supported by the [MARVEL National Centre of Competence in Research](http://www.marvel-nccr.ch), the [MaX European Centre of Excellence](http://www.max-centre.eu) and by a number of other supporting projects, partners and institutions, [listed on materialscloud.org](https://www.materialscloud.org/home#partners).
