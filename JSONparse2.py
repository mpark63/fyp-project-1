import json

x = json.load(open('/Users/minspk/Desktop/gc112/classes.json'))

y = "["

for i in range(len(x)):
    if x[i]["SectionName"] == "01":
        y += '{\"Title\":\"' + x[i]["Title"] + "\","
        y += '\"OfferingName\":\"' + x[i]["OfferingName"] + "\","
        y += '\"Credits\":\"' + x[i]["Credits"] + "\"},"
y += "]"

print(y)
