# Loop Caller Bash Scripts

This directory contains loop caller runner scripts referenced in our manuscript.

## Docker Images

You can download individual loop caller Docker images from:
<https://hub.docker.com/repositories/oluwadarelab>

We provided eleven individual loop caller docker images:

```bash
docker pull oluwadarelab/sip:latest
docker pull oluwadarelab/chromosight:latest
docker pull oluwadarelab/mustache:latest
docker pull oluwadarelab/peakachu:latest
docker pull oluwadarelab/fithichip:latest
docker pull oluwadarelab/fithic:latest
docker pull oluwadarelab/hicexplorer:latest
docker pull oluwadarelab/cloops:latest
docker pull oluwadarelab/cloops2:latest
docker pull oluwadarelab/lasca:latest
docker pull oluwadarelab/juicer:latest
```

> **_NOTE:_** Please see every individual loop callers details (manuscript and github page) for more information about their tools, input, output, etc.

### Example with SIP (see <https://github.com/PouletAxel/SIP>)

1. Pull docker image from repository:

```bash
docker pull oluwadarelab/sip:latest
```

2. Create docker container:

```bash
docker run -itd -v "${PWD}:${PWD}" --name sip oluwadarelab/sip:latest
```

3. Enter into the docker container:

```bash
docker exec -it sip bash
```

4. Download SIP (see <https://github.com/PouletAxel/SIP>):

```bash
wget https://github.com/PouletAxel/SIP/releases/download/SIP_Hic_v1.6.5/SIP-1.6.5.jar
```

5. Download juicer tool (see <https://github.com/aidenlab/Juicebox/wiki>):

```bash
wget https://github.com/aidenlab/Juicebox/releases/download/v2.20.00/juicer_tools.2.20.00.jar
```

6. Download example Hi-C data:

```bash
wget https://4dn-open-data-public.s3.amazonaws.com/fourfront-webprod/wfoutput/3400c4d3-4446-4fb9-96fa-b499dd00861d/4DNFI5EAPQTI.hic
```

7. Run SIP:

```bash
java -jar SIP-1.6.5.jar hic 4DNFI5EAPQTI.hic hg19.chrom.sizes ./ juicer_tools.2.20.00.jar -res 25000
```

> **_NOTE:_** We provided `sip.sh` script containing the similar command mentioned above. This bash script contails command for multiple resolutions. User need to adjust paths and write `bash sip.sh` in the linux command line tools.

8. You will see the output file like `25kbLoops*.txt`. Please see <https://github.com/PouletAxel/SIP/wiki/SIP-Quick-Start#output-bedpe-file> for more details about output file.

### Example with cLoops2 (see <https://github.com/YaqiangCao/cLoops2>)

1. Pull docker image from repository:

```bash
docker pull oluwadarelab/cloops2:latest
```

2. Create docker container:

```bash
docker run -itd -v "${PWD}:${PWD}" --name cLoops2 oluwadarelab/cloops2:latest
```

3. Enter the docker container:

```bash
docker exec -it cLoops2 bash
```

4. We provided docker image installed with cLoops2. If you want to install cLoops2, please see <https://github.com/YaqiangCao/cLoops2?tab=readme-ov-file#install>.

6. Download example data:

```bash
wget wget https://raw.githubusercontent.com/YaqiangCao/cLoops2/master/example/data/GM_HiTrac_bio1.bedpe.gz

```

7. Run cLoops2:

```bash
cLoops2 pre -f GM_HiTrac_bio1.bedpe.gz -o gm_bio1 -c chr21
cLoops2 callLoops -d gm_bio1 -o gm_bio1_output -eps 200,500,1000 -minPts 10 -w -j 
```

> **_NOTE:_** We provided `cloops2.sh` script containing the similar command mentioned above. This bash script contails command for multiple resolutions. User need to adjust paths and write `bash cloops2.sh` in the linux command line tools.

8. You will see the output file like `*output_loops*_*.txt`. Please see <https://github.com/YaqiangCao/cLoops2?tab=readme-ov-file#input-intermediate-output-files> for output fields.
