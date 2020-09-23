//Screenshots

const api_config = require('./api_config.json');
const devConfig = api_config.development;

function sceenshotMapElements(value, key, map) {

  var customerKey = devConfig.customerKey;
  secretPhrase = devConfig.secretPhrase; //leave secret phrase empty, if not needed
  options = {
    //mandatory parameter
    url : `${value.url}`,
    // all next parameters are optional, see our website screenshot API guide for more details
    dimension : '1920x1080', // or "1366xfull" for full length screenshot
    device : 'desktop',
    format: 'jpg',
    cacheLimit: '0',
    delay: '200',
    zoom: '100'
  }

  var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

  //put link to your html code
  console.log('<img src="' + apiUrl + '">');
  
  //or save screenshot as an image
  var fs = require('fs');
  var output = `${value.id}` + '_' + `${key}` + '.jpg';
  screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
    console.log('Screenshot saved as ' + output);
  }));
    
}

var screenshotmachine = require('screenshotmachine');

let websites = new Map()
websites.set('iFunded', { id: 1 ,url:"https://ifunded.de/en/"})
websites.set('Property Partner',{ id: 2 ,url:"https://www.propertypartner.co"})
websites.set('Property Moose', { id: 3 ,url:"https://propertymoose.co.uk"})
websites.set('Homegrown', { id: 4 ,url:"https://www.homegrown.co.uk"})
websites.set('Realty Mogul', { id: 5 ,url:"https://www.realtymogul.com"})




websites.forEach(sceenshotMapElements)


