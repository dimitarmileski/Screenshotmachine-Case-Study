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


function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


// Upload to Google Drive

const fs = require('fs');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    
        oAuth2Client.getToken("4/4gEt6EZrw_DIjYHnVSQQOaEFlqwo_6NQ9QfKG3fOPWbnFpELCEH_dP0", (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });

}
/**
* Describe with given media and metaData and upload it using google.drive.create method()
*/ 


function uploadFile(auth) {
  const drive = google.drive({version: 'v3', auth});

  websites.forEach((value, key, map)=>{
    const fileMetadata = {
      'name': value.id + '_' + key + '.jpg',
      parents: ['1QEpiok-LP2rnwaiXvmBV2ELgrdD5ZqA4']
    };
    const media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('./' + value.id + '_' + key + '.jpg')
    };
  
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, (err, file) => {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.id);
      }
    });
  
  });  
}

async function googleDriveUpload(){
  await sleep(15000);
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile);
  });

}

googleDriveUpload();