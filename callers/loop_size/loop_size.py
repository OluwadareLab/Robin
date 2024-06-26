import math
import sys

inputPath = sys.argv[1]
outputPath= sys.argv[2]
res = sys.argv[3]

print(inputPath)
output = open(outputPath, "a+")
with open(inputPath, "r") as input:
    lines = input.readlines()
    ave_size = 0
    avg_bin_size = 0
    count = 0
    for line in lines:
        row = line.split("\t")
        start = min(row[1], row[2])
        end = max(row[4], row[5])
        size = int(float(end)) - int(float(start))
        ave_size += size
        avg_bin_size += math.ceil(size/int(float(res)))
        count += 1
    ave_size = round(ave_size/count)
    avg_bin_size = round(avg_bin_size/count)
    output.writelines('Total Loops: ' + str(count) + '\n')
    output.writelines('Average Size (kb): ' + str(ave_size/1000) + '\n')
    output.writelines('Average Size (# bins): ' + str(avg_bin_size) + '\n')
    output.writelines('@{}KB\n'.format(res))
output.close()