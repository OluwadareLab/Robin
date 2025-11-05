# Robin:  An Advanced Tool for Comparative Loop Caller Result Analysis Leveraging Large Language Models
***
#### [OluwadareLab, University of Colorado, Colorado Springs](https://uccs-bioinformatics.com/)
***
#### Developers:
H. M. A. Mohit Chowdhury<br>
Department of Computer Science and Engineering<br>
University of North Texas<br>
Email: h.m.a.mohitchowdhury@my.unt.edu<br>

Mattie Fuller<br>
Department of Computer Science<br>
University of Colorado at Colorado Springs<br>
Email: mfuller@uccs.edu<br>

#### Corresponding:
Oluwatosin Oluwadare, PhD<br>
Department of Computer Science and Engineering and Center for Computational Life Sciences<br>
University of North Texas<br>
Email: oluwatosin.oluwadare@unt.edu<br>
***

## Using Robin
all information about using Robin can be found here: http://biomlearn.uccs.edu/robinrd/tutorial.html
***

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
Additional markdown files are placed throughout the project in any folder where its contents may need clarification.  

















