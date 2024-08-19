

# old readme
to start the robin docker
```docker run -it -v $(pwd):$(pwd) -w $(pwd) -p 8086:8086 -p 8889:8888 robin```

to run the api: 
<!-- launch the docker
nvm install --lts
nvm use --lts
npm install
apt-get -y install python
nohup mongod --dbpath ./data & -->
docker run --detach \
           --publish 8888:80 \
           --volume ~/hg-data:/data \
           --volume ~/hg-tmp:/tmp \
           --name higlass-container \
           higlass/higlass-docker
npm run start-api-worker

Note: this will be fixed when I care enough to fix it. but for now running 3 more commands to set up npm is not bad.



I had to rewrite a significant chunk of higlass to get it to run with react 18, as such it is included as part of the project rather than a module.
it has its own dependancies and you need to run ```npm clean-install``` from inside /src/higlass to install its dependancies
it is included as a submodule, run ```git submodule update --init --recursive``` the first time you clone the repo to clone it.  
then just ```git submodule update --recursive --remote```

Note: this project uses craco to override a few webpack configs of create react app. find them in craco.config.js,   
webpack.config.js and tsconfig.json are not used execpt for react style guidist doc generation   


For higlass to interact with our data we need to first upload it to the higlass server, thus we can start a higlass server with
docker pull higlass/higlass-docker # Ensure that you have the latest.
docker run --detach \
           --publish 8888:80 \
           --volume ~/hg-data:/storage/store/Robin_ComprehensiveLoopCaller/data/higlassTracks/ \
           --volume ~/hg-tmp:/storage/store/Robin_ComprehensiveLoopCaller/data/higlassTempData/ \
           --name higlass-container \
           higlass/higlass-docker
or my provided ```startHiglassserver.sh``` script in this folder

to upload a track

first check if its there:
```docker exec higlass-container ls /tmp```

then upload it
```docker exec higlass-container python higlass-server/manage.py ingest_tileset --filename /tmp/test.txt --filetype vector --datatype vector```

higlass-manage ingest --filetype vector --datatype vector ./test.txt


