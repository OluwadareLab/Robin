docker pull higlass/higlass-docker # Ensure that you have the latest.
docker run --detach \
           --publish 8889:80 \
           --volume /storage/store/Robin_ComprehensiveLoopCaller/data/higlassTracks/:/data \
           --volume /storage/store/Robin_ComprehensiveLoopCaller/data/higlassTempData/:/tmp \
           --name higlass-server-for-robin \
           higlass/higlass-docker