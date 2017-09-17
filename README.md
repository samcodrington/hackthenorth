# hackthenorth
Developed by 2 Brothers in 2 days for Hack the North 2017. Read all about it on [Devpost](https://devpost.com/software/wamsit-what-actor-movie-show-is-it)

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
After downloading Node.js
simply run 
`` npm install mongodb`` and ``npm install`` to install dependencies.
`` npm start`` will start a server on your browser

3.The easiest way to add actors to your database is uncomment 

