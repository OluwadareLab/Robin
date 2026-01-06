# Robin:  An Advanced Tool for Comparative Loop Caller Result Analysis Leveraging Large Language Models
***
#### [Oluwadare Lab, University of North Texas](https://oluwadarelab.com/)
***
#### Developers:
H. M. A. Mohit Chowdhury<br>
Department of Computer Science and Engineering, and Center for Computational Life Sciences<br>
University of North Texas<br>
Email: h.m.a.mohitchowdhury@my.unt.edu<br>

Mattie Fuller<br>
Department of Computer Science<br>
University of Colorado at Colorado Springs<br>
Email: mfuller@uccs.edu<br>

#### Corresponding:
Oluwatosin Oluwadare<br>
Department of Computer Science and Engineering, and Center for Computational Life Sciences<br>
University of North Texas<br>
Email: oluwatosin.oluwadare@unt.edu<br>
***

## Using Robin
All information about using Robin can be found here: http://biomlearn.uccs.edu/robinrd/tutorial.html
***

# Server Installation Guide (by H. M. A. Mohit Chowdhury)
1. Clone the git repo with SSH. You can also choose HTTPS:
    ```
    git clone --recurse-submodules git@github.com:OluwadareLab/Robin.git
    ```
2. Build images from scratch:

    ```
    docker compose build --no-cache
    ```
3. Run Docker containers:

    ```
    docker compose up
    ```

    Note: You may observe errors in logs. Follow step 3 to fix them
4. Fix errors and run your container again:

    ```
    docker compose run --rm web_api sh -c "rm -rf node_modules package-lock.json && npm install"
        
    docker compose run --rm web sh -c "cd src/components/visualizationTools/HiGlass/higlass && npm install"
        
    docker compose up
    ```

4. Allow execute permission to all the scripts and files:

    ```
    chmod -R 777 Robin_ComprehensiveLoopCaller
    ```

5. Fix HiGlass container:
    * Enter HiGlass container
        ```
        docker exec -it robin_comprehensiveloopcaller-higlass-1 bash
        ```
    * See your ini file:
        ```
        ps aux | grep uwsgi
        cat /home/higlass/projects/uwsgi.ini
        ```
    * Open server config file in edit mode:
        ```
        vim /home/higlass/projects/uwsgi.ini
        ```
    * Past the below configuration in *[base]*
        ```
        harakiri = 3600
        http-timeout = 3600
        socket-timeout = 3600
        post-buffering = 65536
        buffer-size = 65536
        ignore-sigpipe = true
        ignore-write-errors = true
        disable-write-exception = true
        ```
    * Restart HiGlass container:
        ```
        docker restart robin_comprehensiveloopcaller-higlass-1
        ```
6. Add user for HiGlass:
    * Enter into HiGlass container:
        ```
        docker exec -it robin_comprehensiveloopcaller-higlass-1 bash
        ```
    * Create admin user:
        ```
        cd higlass-server
        python manage.py createsuperuser
        ```
        - Provide:
            1. Username: `admin`
            2. Password: `admin`
        - Verify user:
            ```
            python manage.py shell
            ```
            ```
            from django.contrib.auth.models import User
            User.objects.all().values("username", "is_superuser")
            ```
            Note: You will see: `<QuerySet [{'username': 'admin', 'is_superuser': True}]>`
            ```
            exit()
            ```

***



<!-- # Depricated
## Runnning Robin
Robin can be run by using the provided docker compose file to launch the required docker containers and link their ports together for you.
#### docker compose start cmd
```bash 
    docker compose up
```
***
## Setup instructions

1) run ```git submodule update --recursive --remote``` to pull the included subrepo of HiGlass.
2) run ```npm clean-install``` from inside /src/components/visualizationTools/HiGlass to install HiGlasses dependancies.
3) run ```npm install``` from the root of the project (IE: folder with package.json) to install robin's dependancies.


## Developer Documentation
[General Documentation](https://github.com/OluwadareLab/Robin/blob/1fe34be81b1bb7cb65f8c2e97213f2fbfd76a286/DEV_README.md) The Developer readme meant to document anything a new developer looking to maintain the project might need to know.  
[Component Documentation](http://biomlearn.uccs.edu/robin/styleguide/index.html). Robin uses React StyleGuidist for component documentation and isolated component development.    
[Full Documentation](http://biomlearn.uccs.edu/robin/docs/). Generated from in code comments using typeDoc    
The Component documentation contains all documentation for react components in the site, whereas the full documentation contains the auto generated documenation for all code in the project.    
Additional markdown files are placed throughout the project in any folder where its contents may need clarification.  -->


















