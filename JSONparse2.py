import json

courseJSON = json.load(open('/Users/minspk/Desktop/gc112/classes.json'))

shortJSON = "["

for i in range(len(courseJSON)):
    if x[i]["SectionName"] == "01": 
        shortJSON += '{\"code\":\"' + courseJSON[i]["OfferingName"] + "\","
        shortJSON += '\"title\":\"' + courseJSONx[i]["Title"] + "\","
        shortJSON += '\"areas\":\"' + courseJSON[i]["Areas"] + "\","
        shortJSON += '\"credits\":\"' + courseJSON[i]["Credits"] + "\"},"
shortJSON += "]"

print(shortJSON)
