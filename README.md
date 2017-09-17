# hackthenorth
Developed by 2 Brothers in 2 days for Hack the North 2017. Read all about it on [Devpost](https://devpost.com/software/wamsit-what-actor-movie-show-is-it)

![Demo of WAMSIT](https://github.com/samcodrington/hackthenorth/raw/master/app/assets/img/demo.gif "Demo of WAMSIT")

In order to implement for yourself, you'll need to
1. create a valid config. file
2. Install Node.js & MongoDB
3. Create Azure Database & Train it


1. Config.Js 
You'll need to create the following file in the public/data folder that only contains the following structure
``
var config = {
  azure: {
    key: 'yourAzureKeyHere'
   },
   tmdb: {
    key: 'yourTMDBKeyHere'
   }
}
export default config;
``

2.Node.Js & MongoDB
After downloading Node.js simply run 

`` npm install mongodb`` and ``npm install`` to install dependencies then `` npm start`` will start a server on your browser

3. Setting Up the Azure Database
First create a PersonGroup in Azure named ``group1`` using [the following PUT request] (https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244).

Then add to your PersonGroup:
the easiest way to add actors to your database is uncomment the commented searchbar in ``index.html``. After reloading the page, you'll be able to use this to search Actors by name from TMDB and the app will add them to your Azure database. When you've added all the acotrs you'd like to recognize, you should send an http PUT request to train the dataset to azure [as detailed on their API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395249) and the service will start trianing the dataset based on the images you've provided

And then you should be good to go!

