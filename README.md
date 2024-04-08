to run the api: 
launch the docker
nvm install --lts
nvm use --lts
npm install
mongod --dbpath ./data

Note: this will be fixed when I care enough to fix it. but for now running 3 more commands to set up npm is not bad.


I had to rewrite a significant chunk of higlass to get it to run with react 18, as such it is included as part of the project rather than a module.
it has its own dependancies and you need to run npm clean-install from inside /src/components/higlass/higlass to install its dependancies

