// declare array of courses by semester
// initiated with default CS requirements
let s1 = [          // freshman fall 
  { code: "EN.500.112", title: "Gateway Computing: JAVA", credits: 3, areas: "E" },
  { code: "EN.601.104", title: "Computer Ethics", credits: 1, areas: "H" },
];
let s2 = [          // freshman spring 
  { code: "EN.601.220", title: "Intermediate Programming", credits: 4, areas: "E" },
];
let s3 = [          // sophomore fall 
  { code: "EN.601.226", title: "Data Structures", credits: 4, areas: "E" },
  { code: "EN.601.229", title: "Computer System Fundamentals", credits: 3, areas: "E" },
];
let s4 = [          // sophomore spring 
  { code: "EN.601.230", title: "Mathematical Foundations for CS", credits: 4, areas: "Q" },
];
let s5 = [          // junior fall 
  { code: "EN.601.433", title: "Intro to Algorithms", credits: 3, areas: "E" },
];
let s6 = [];
let s7 = [];
let s8 = [];
// array of suggested courses
let sugg = [
    { "code" : "EN.601.270", "title" : "Full Stack JavaScript", "credits" : 3, "areas" : "E" }, 
    { "code" : "EN.601.290", "title" : "User Interfaces & Mobile Apps", "credits" : 3, "areas" : "E" }, 
    { "code" : "EN.601.318", "title" : "Operating Systems", "credits" : 3, "areas" : "E" }, 
    { "code" : "EN.553.310", "title" : "Probability & Statistics for Physical Sciences & engineering", "credits" : 4, "areas" : "Q" },
    { "code" : "EN.601.421", "title" : "Object Oriented Software Engineering", "credits" : 3, "areas" : "E" }, 
    { "code" : "AS.110.201", "title" : "Linear Algebra", "credits" : 4, "areas" : "Q" }, 
    { "code" : "EN.601.482", "title" : "Machine Learning: Deep Learning", "credits" : 3, "areas" : "E" }
];

// allow drop to semseter container 
function allowDrop(ev) {
  ev.preventDefault();
}

// allow drag to semester container 
function drag(ev) {         // course code (e.g. EN.500.122)
  ev.dataTransfer.setData("text", ev.target.id);
}

// transfers a course from one semester to another in ondrop event 
function drop(ev) {
  ev.preventDefault();
  var courseCode = ev.dataTransfer.getData("text");
  var semNum = ev.target.id; // semester container div id (e.g. s1, s2)

  // delete course at current sem and add to new sem
  let courseInfo = deleteCourse(courseCode);        // returns course obj 
  addCourse(semNum.charAt(1), courseInfo.code, courseInfo.title, courseInfo.credits, courseInfo.areas);          // add to dropped semester 
}

// returns the nth semester array for given n
function getSemArray(int) {
  if (int == 1) return s1;
  if (int == 2) return s2;
  if (int == 3) return s3;
  if (int == 4) return s4;
  if (int == 5) return s5;
  if (int == 6) return s6;
  if (int == 7) return s7;
  if (int == 8) return s8;
}

// add a course card to semester container with id=s<semNum>
function addCourse(semNum, code, title, credits, areas) {
  // get course level e.g. EN.500.<312>
  let level = parseInt(code.substring(code.length - 3));
  let sem = semNum;       // if semNum != 0, sem is known from drag drop event 
  if (semNum == 0) {      // if new course, determine suitable year for new course
    if (level < 150) {
      sem = 1;                  // freshman fall
    } else if (level < 200) {
      sem = 2;                  // freshman spring
    } else if (level < 250) {
      sem = 3;                  // sophomore fall
    } else if (level < 300) {
      sem = 4;                  // sophomore spring
    } else if (level < 350) {
      sem = 5;                  // junior fall
    } else if (level < 400) {
      sem = 6;                  // junior spring
    } else if (level < 450) {
      sem = 7;                  // senior fall
    } else {              
      sem = 8;                  // senior spring
    }
  }
  // push new course to semester array
  let newCourse = { code: code, title: title, credits: credits, areas: areas };
  getSemArray(sem).push(newCourse);
  // add course card to semester container
  document.getElementById("s" + sem).innerHTML += 
    `<div class="card drag" id="${code}" draggable="true" ondragstart="drag(event)" style="background-color: ${color(areas)};">
        <button class="delete is-small" onclick="deleteCourse('${code}');"></button>
        <div class="card-content">
            ${code}<br>
            ${title} (${credits})
        </div>
    </div>`;
  // clean up navigation bar
  document.getElementById("filter-records").innerHTML = ""; // close search results
  document.getElementById("txt-search").value = ""; // clear search field
  // recalculate credits for all semesters and total 
  for (let i = 1; i < 9; i++) {
    // update all credits <p> element 
    document.getElementById("cs" + i).innerHTML = getSemesterCredits(getSemArray(i)) + " credits";
  }
  document.getElementById("total").innerHTML = getTotalCredits() + " credits";
}

// delete a course card from its semester container 
function deleteCourse(code) {
  // delete course div from container
  document.getElementById(code).remove();
  // identify which semester contains course + remove from respective array
  let sem = 1;
  let courseInfo;
  let semesters = [s1, s2, s3, s4, s5, s6, s7, s8, sugg];
  // iterate through every course in semesters array 
  for (let i = 0; i < semesters.length; i++) {
    for (let j = 0; j < semesters[i].length; j++) {
      if (semesters[i][j].code == code) {
        courseInfo = semesters[i][j];
        semesters[i].splice(j, 1); // remove from respective array
        sem += i; // found semester number 
        break;
      }
    }
  }
  // update semester credit count and total credit count
  if (sem < 9) {
    document.getElementById("cs" + sem).innerHTML = getSemesterCredits(getSemArray(sem)) + " credits";
    document.getElementById("total").innerHTML = getTotalCredits() + " credits";
  }
  // return deleted course info
  return courseInfo;
}

// assigns color based on areas, also checks major req based on areas
function color(areas) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (areas.includes("H")) {
    // humanities - red
    r = 249;
    g = 111;
    b = 111;
  }
  if (areas.includes("N")) {
    // natural sciences - green
    if (r != 0) {
      // if double count, get average rgb values
      r = (r + 91) / 2;
      g = (g + 226) / 2;
      b = (b + 108) / 2;
    } else {
      r = 91;
      g = 226;
      b = 108;
    }
  }
  if (areas.includes("S")) {
    // social sciences - yellow
    if (r != 0) {
      r = (r + 255) / 2;
      g = (g + 246) / 2;
      b = (b + 107) / 2;
    } else {
      r = 255;
      g = 246;
      b = 107;
    }
  }
  if (areas.includes("Q")) {
    // quantitative sciences - purple
    if (r != 0) {
      r = (r + 205) / 2;
      g = (g + 161) / 2;
      b = (b + 255) / 2;
    } else {
      r = 205;
      g = 161;
      b = 255;
    }
  }
  if (areas.includes("E")) {
    // engineering - blue
    if (r != 0) {
      r = (r + 112) / 2;
      g = (g + 212) / 2;
      b = (b + 255) / 2;
    } else {
      r = 112;
      g = 212;
      b = 255;
    }
  }
  // return rgb string for style="background-color: color"
  let color = "rgb(" + r + "," + g + "," + b + ")";
  return color;
}

// calculate and return number of credits given semester
function getSemesterCredits(sem) {
  let sum = 0;
  for (let i = 0; i < sem.length; i++) {
    sum += parseInt(sem[i].credits);
  }
  return sum;
}

// calculate and return total credits 
function getTotalCredits() {
  let sum =
    getSemesterCredits(s1) +
    getSemesterCredits(s2) +
    getSemesterCredits(s3) +
    getSemesterCredits(s4) +
    getSemesterCredits(s5) +
    getSemesterCredits(s6) +
    getSemesterCredits(s7) +
    getSemesterCredits(s8);
  return sum.toFixed(1); // 1 decimal pt
}

// save snapshot of semesters container as pdf 
function download() {
  var elementHTML = document.getElementById("container");

  html2canvas(elementHTML, {
    useCORS: true,
    onrendered: function (canvas) {
      // format as landscape letter document
      var pdf = new jsPDF("l", "pt", "letter");
      var pageHeight = 1200;
      var pageWidth = 1500;
      var srcImg = canvas;

      // create canvas on document 
      window.onePageCanvas = document.createElement("canvas");
      onePageCanvas.setAttribute("width", pageWidth);
      onePageCanvas.setAttribute("height", pageHeight);
      var context = onePageCanvas.getContext("2d");
      context.drawImage(srcImg, 0, 0, pageWidth, pageHeight, 0, 0, pageWidth, pageHeight);
      var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
      // add site image to canvas  
      pdf.addImage(canvasDataURL, "PNG", 50, 0, pageWidth * 0.5, pageHeight * 0.5);
      // prompt pdf download 
      pdf.save("document.pdf");
    },
  });
}

// 
function getDegreeProgress() {
  // intial credit distribution
  let nCredits = 0;     // natural  
  let nDone = false;
  let qCredits = 0;     // quantitative
  let qDone = false;
  let hCredits = 0;     // humanities
  let hDone = false;
  let sCredits = 0;     // social
  let sDone = false;
  let totalCredits = getTotalCredits();

  // assuming student is here 8 semesters
  let semesters = [s1, s2, s3, s4, s5, s6, s7, s8];

  // for each course in a semester 
  for (let i = 0; i < semesters.length; i++) {
    let sem = semesters[i]; 
    for (let j = 0; j < sem.length; j++) {
      let course = sem[j]; 
      // parse areas string e.g. 'H' or "NS"
      for (let k = 0; k < course.areas.length; k++) {
        switch (course.areas.charAt(k)) {
          case "N": 
            nCredits += parseInt(course.credits);
            break;
          case "Q":
            qCredits += parseInt(course.credits);
            break;
          case "H":
            hCredits += parseInt(course.credits);
            break;
          case "S":
            sCredits += parseInt(course.credits);
            break;
        }
      }
    }
  }
  // check if distribution requirements met
  if (nCredits >= 8) nDone = true;
  if (qCredits >= 16) qDone = true;
  if (hCredits >= 9) hDone = true;
  if (sCredits >= 9) sDone = true;
  let canGraduate = nDone && qDone && hDone && sDone && (totalCredits >= 120);
  // message to output
  let message =
    "Your credits:\n\nBasic Sciences:  " +
    nCredits.toFixed(1) +
    " / 8\nMathematics:  " +
    qCredits.toFixed(1) +
    " / 16\nHumanities:  " +
    hCredits.toFixed(1) +
    " / 9\nSocial Sciences:  " +
    sCredits.toFixed(1) +
    " / 9\nTotal:  " +
    totalCredits +
    " / 120\n\n";
  if (canGraduate) {
    message += "Congratulations, you've fulfilled your degere requirements!\n";
  } else {
    message += "You cannot graduate at this moment. You need: \n\n";
    if (!nDone) message += 8 - nCredits + "  more Basic Sciences credits\n";
    if (!qDone) message += 16 - qCredits + "  more Mathematics credits\n";
    if (!hDone) message += 9 - hCredits + "  more Humanities credits\n";
    if (!sDone) message += 9 - sCredits + "  more Social Sciences credits\n";
    if (totalCredits < 120)
      message += 120 - totalCredits + " more credits overall\n";
  }
  // display degree progress message 
  alert(message);
}
