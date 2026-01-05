# Original string separated by ":"
# IE "element1:element2:element3"
original_string=$1
# prefix to add before each element
prefix=$2
# suffix to add after each element
suffix=$3

# Split the string into an array using ":" as the delimiter
IFS=':' read -ra elements <<< "$original_string"


# Iterate over the array and add the word before each element
for ((i=0; i<${#elements[@]}; i++)); do
    elements[$i]="$prefix${elements[$i]}$suffix"
done

# Reassemble the elements into a string separated by ":"
modified_string=$(IFS=':'; echo "${elements[*]}")

# Print the modified string
echo "$modified_string"