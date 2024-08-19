# Robin:  An Advanced Tool for Comparative Loop Caller Result Analysis Leveraging Large Language Models
***
#### [OluwadareLab, University of Colorado, Colorado Springs](https://uccs-bioinformatics.com/)
***
#### Developers:
H. M. A. Mohit Chowdhury<br>
Department of Computer Science<br>
University of Colorado at Colorado Springs<br>
Email: hchowdhu@uccs.edu<br>

Mattie Fuller<br>
Department of Computer Science<br>
University of Colorado at Colorado Springs<br>
Email: mfuller@uccs.edu<br>

#### Corresponding:
Oluwatosin Oluwadare, PhD<br>
Department of Computer Science<br>
University of Colorado at Colorado Springs<br>
(Secondary) Department of Biomedical Informatics<br>
University of Colorado School of Medicine, Anschutz Medical Campus<br>
Email: ooluwada@uccs.edu<br>
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





















