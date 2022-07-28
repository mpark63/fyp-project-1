import json
import requests

def getData(): 
    session = requests.Session() 
    url = "https://murmuring-eyrie-98570.herokuapp.com/https://sis.jhu.edu/api/classes?key=JjHPAfkaB7SZpfX6MnQIXXHMGARAHR8x&School=Whiting%20School%20of%20Engineering&Term=Fall%202021&Term=Spring%202021"
    data = session.get(url)
    courseJSON = json.loads(data.text)
    shortJSON = []
    for course in courseJSON:
        if course["SectionName"] == "01": 
            courseDict = {}
            courseDict["code"] = course["OfferingName"]
            courseDict["title"] = course["Title"]
            courseDict["areas"] = course["Areas"]
            courseDict["credits"] = course["Credits"]
            shortJSON.append(courseDict)
    return shortJSON
