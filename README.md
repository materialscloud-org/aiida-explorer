[![Build Status](https://github.com/materialscloud-org/aiida-explorer/workflows/ci/badge.svg)](https://github.com/materialscloud-org/aiida-explorer/actions)
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

## Development setup

Note: The following works with node 14 but not 16! (Suggested setup: `nvm install 14`.)

Install dependencies:

```bash
npm install
npx bower install
```

Note: the project will not work if a 'profile list' is not accessible. Update Gruntfile.js to use the one of Materials Cloud:

```bash
sed -i 's/http:\/\/localhost/https:\/\/www.materialscloud.org/g' Gruntfile.js
```

Build with Grunt:

```bash
npx grunt build
```

Deploy:

```bash
cd dist
python -m http.server
```

Note: to access a local AiiDA REST API started with `verdi restapi`, there might be a CORS error occurring. For development, one can just disable CORS. E.g. in Chrome on linux: `google-chrome --disable-web-security`

## License

MIT

## Acknowledgements

This work is supported by the [MARVEL National Centre of Competence in Research](http://www.marvel-nccr.ch), the [MaX European Centre of Excellence](http://www.max-centre.eu) and by a number of other supporting projects, partners and institutions, [listed on materialscloud.org](https://www.materialscloud.org/home#partners).
