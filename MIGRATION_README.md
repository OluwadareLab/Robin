# Migration of Robin to another server
This should be a simple process. If anything does not work see the DEV_README.md for extra info about project structure and things.  


1) First, identify the following files within the repo:
  -  .env
  -  .env_prod
  -  .env_test
These files are used to control most config that would relate to hosting the server. The .env file is overridden by either the prod or test versions. The .env_test file 
is the enviornment vars used for testing while the .env_prod file controls the enviornment vars for the production version.
2) Edit the port numbers in this file to ports that are open on your server and avalible for the server to use. It uses 4 ports
3) the config.mjs file can be used for editing the paths the web app uses against your server, you will need to change these from biomlearn.uccs.edu/robin and biomlearn.uccs.edu/robinAPI/ to be the apropriate paths that they are avalible on your server, this can either be just the serverName:portNumber for each of them, or can be the path you want them to use. If you want to use a subdomain such as the ones above to map port numbers through the default web port to differnt names IE: map port 8000->biomlearn.uccs.edu/server this is done through either nginx or apache, on biomlearn this is done via apache2 reverse proxy. The file used for this is contained in the main folder of the project. it is named "apache2ConfigForReverseProxy"