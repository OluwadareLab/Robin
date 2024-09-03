## Developer Documentation
This file includes all documenation that you might need to contiune development or maintaince.  

### Additional Documentation
The other 3 types of documentation for this project are as follows:  
1) [The React Styleguidist docs](http://biomlearn.uccs.edu/robin/styleguide/index.html), this is documentation for all components with the functional rendered component in an isolated env  
2) [The typeDocs](http://biomlearn.uccs.edu/robin/docs/). Generated from in code comments using typeDoc.
3) [The API Endpoint Docs](idk). the documentation on the robin server api endpoint.  

### install instructions
see the README.  

### General Information
Robin itself is composed of 4 parts:
1) the react server that serves html to clients
2) the api server that serves data from the .sql database
3) the flask server that runs python scripts to facilitate the AI assistant
4) the higlass backend server that handles the higlass database and injesting files

All of these are dockerized and communicate via docker.compose connecting their ports. 
#### Important Files
1) config.mjs file --contains general configs 
2) apiCOnfig.js file --contains api configs 
3) callers.config.sh --contains script runner configs
4) /src/api/mainAPI.js --this file is the api itself it handles all logic for it, if a endpoint isnt behaving how you think it should this file contains docs and the implementation
5) /src/api/flaskServer.py --the flask server
6) craco.config.js --this is a file that overrides a lot of the ReactCreateApp default webpack and other configs.
7) eslint.config.mjs --the eslint style config for the project
8) styleguide.config.js --the config for the react styleguidist doc gen
9) tsconfig.json --ONLY used for typedoc
10) typedoc.js --the config for typedoc gen
11) webpack.config.js --old configuration
12) .BABELRC --extra config for babel
13) apache2ConfigForReverseProxy a file containing the apache2 reverse proxy setup
14) .env is used for port config

#### Project Structure
src/: contains most all of the project
public/:files that are publicly avalible on the server
callers/: all scripts that are called by the backend of the server.
public/docs/: the typedoc output folder
public/styleguide/: the react styleguidist output folder
src/pages: components that are meant to be rendered as pages
src/components: all the react components on the site
src/components/tempTypes: a folder that was meant to be temporary but now contains most of the TS type declarations
src/api/: contains all the api related parts of the project
src/css/: contains most css
src/images/: a lot of random images mostly not used --I think we stole this from TADMaster
src/util/: any opensource script that I yoinked for a task

#### API Endpoint docs
The api endpoint is documented in the same file directly above where the behaviour is defined.  
TODO: make a tool to parse the api doc comments into a proper api endpoint documentation.  


### Possible Hard Coded Things
If this project does ever need to be removed from the docker and ported somewhere else, here is a list of things that may be somewhat hardcoded:
1) The config.mjs file --contains configs 
2) The apiCOnfig.js file --contains configs 
5) the dockerfile.client might have some hardcoded things
6) the dockerfile.server might have some hardcoded things
7) The callers.config.sh script contains info for the scripts that is hardcoded
8) the callers folder should be reviewed if you are messing with project structure



## Things I dont remember what they do (if they do anything at all)
1) babel.config.js --might not actually be used anymore see:craco.config.js
2) webpack.config.js --might not actualyl be used anymore see:craco.config.js
4) /src/index.js -- I dont think this does anyhting
5) /src/app.test.js
6) /src/bootstrap/ --we have react-bootstrap so im not sure if this is used, but it might be used by docs
7) /src/utils/ --a lot of this isnt used I think
8) /src/components/visualizationTools/Aliro-0.21.1 --not used



# Dev Server
To launch a dev server edit the .env var TEST, this is a string that is appended to the end of the name of the containers.  
So to launch a dev server change it to _dev and make sure the ports are free also in the .env file.  
then change the config.mjs and apiconfig ports to match.


## Data folder
the data folder must container 2 subfolders. They can be empty they just need to be there
1) "higlassTempData"
2) "higlassTracks"