import { getFirestore, collection, query, where, getDocs, getDoc } from './firebasein.js';
import { orderBy } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js';


const pages = {
  etusivu: `
    <!DOCTYPE html>
<html>
  <head>
    <title>Etusivu</title>
    <meta charset="utf-8">
 
  </head>
  <body>
  
 <div class="container2">
  <a href="#" onclick="window.app.loadContent('peruskoulu')">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/robot.png?alt=media');">
      <h2 data-lang="peruskoulu_title"></h2>
      <p data-lang="peruskoulu_description"></p>
    </div>
  </a>
  <a href="tuva.html" onclick="selectLevel('tuva')">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/tuva.PNG?alt=media');">
      <h2 data-lang="tuva_title"></h2>
      <p data-lang="tuva_description"></p>
    </div>
  </a>
  <a href="#" onclick="event.preventDefault(); app.loadCourses('Lyhyt matematiikka'); return false;">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/lyhyt.PNG?alt=media');">
      <h2 data-lang="lyhyt_matematiikka_title"></h2>
      <p data-lang="lyhyt_matematiikka_description"></p>
    </div>
  </a>
  <a href="#" onclick="event.preventDefault(); app.loadCourses('Pitkä matematiikka'); return false;">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/pitka.PNG?alt=media');">
      <h2 data-lang="pitka_matematiikka_title"></h2>
      <p data-lang="pitka_matematiikka_description"></p>
    </div>
  </a>
  <a href="luokkaan.html" onclick="selectLevel('luokkaan')">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/luokka.png?alt=media');">
      <h2 data-lang="liity_luokkaan_title"></h2>
      <p data-lang="liity_luokkaan_description"></p>
    </div>
  </a>
  <a href="omakurssi.html" onclick="selectLevel('omaKurssi')">
    <div class="box" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/testi-633d2.appspot.com/o/images%2Fmt.png?alt=media');">
      <h2 data-lang="oma_kurssi_title"></h2>
      <p data-lang="oma_kurssi_description"></p>
    </div>
  </a>
</div>



  </body>
</html>

  `,
 login: `
  <div class="container">
  <h2 data-lang="login_title">Kirjaudu sisään</h2>
  <form>
    <input type="email" placeholder="Sähköposti" id="email" data-lang="email_placeholder">
    <input type="password" placeholder="Salasana" id="password" data-lang="password_placeholder">
    <button type="button" id="signInButton" data-lang="sign_in">Kirjaudu sisään</button>
  </form>
  <p data-lang="no_account">Eikö sinulla ole tiliä? 
        <button data-page="register" onclick="loadContent('register.html')" data-lang="register_here">Rekisteröidy tästä</button>
</div>
`,

  userInfo: `
   <div class="user-info">
  <h1>Käyttäjätiedot</h1>
  <table>
    <tr>
      <td>Etunimi:</td>
      <td><span id="user-first-name"></span></td>
    </tr>
    <tr>
      <td>Sukunimi:</td>
      <td><span id="user-last-name"></span></td>
    </tr>
    <tr>
      <td>Sähköposti:</td>
      <td><span id="user-email"></span></td>
    </tr>
    <tr>
      <td>Kaupunki:</td>
      <td><span id="user-city"></span></td>
    </tr>
  </table>
</div>
  `,
  register: `
  <div class="container">
    <h2>Rekisteröidy</h2>
    <form id="register-form">
      <input type="email" placeholder="Sähköposti" id="email" required>
      <input type="text" placeholder="Etunimi" id="firstName" required>
      <input type="text" placeholder="Sukunimi" id="lastName" required>
      <input type="password" placeholder="Salasana" id="password" required>
      <input type="password" placeholder="Vahvista salasana" id="confirmPassword" required>
      <input type="text" placeholder="Kaupunki" id="city" required>
      <div>
        <input type="checkbox" id="consent" required>
        <label for="consent">Annan suostumukseni tietojeni tallentamiseen ja käyttöön sivuston personointiin, ja opintosuoritusten seuraamiseen opiskelukokemuksen parantamiseksi.</label>
      </div>
      <button type="submit" id="registerButton">Rekisteröidy</button>
    </form>
    <p id="error-message" class="error-message"></p>
    <p id="success-message" class="success-message" style="display: none;">Rekisteröinti onnistui! <br><button id="login-button" class="button">Kirjaudu sisään tästä</button></p>
    <p>Onko sinulla jo tili? <a href="#" data-page="login">Kirjaudu sisään tästä</a></p>
  </div>
  <script type="module">
    import { register } from './registerUser.js';

    document.getElementById("register-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      await register();
    });

    document.getElementById("login-button").addEventListener("click", () => {
      loadContent("login");
    });
  </script>
`,
peruskoulu: `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Peruskoulu</title>
      <style>
  .course-box {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px;
    display: inline-block;
    text-align: center;
  }
</style>

      <meta charset="utf-8">
    </head>
    <body>
      <h1 data-lang="peruskoulu_title"></h1>
      <div id="course-list"></div>
    </body>
  </html>
  `,
  lyhytMatematiikka: `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Lyhyt matematiikka</title>
      <style>
  .course-box {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px;
    display: inline-block;
    text-align: center;
  }
</style>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>Lyhyt matematiikka</h1>
      <div id="course-list-lyhyt-matematiikka"></div>
    </body>
  </html>
`,
pitkaMatematiikka: `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Pitkä matematiikka</title>
      <style>
  .course-box {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px;
    display: inline-block;
    text-align: center;
  }
</style>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>Pitkä matematiikka</h1>
      <div id="course-list-pitka-matematiikka"></div>
    </body>
  </html>
`,
courseContent: `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Kurssin sisältö</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1 id="course-title"></h1>
  <div class="menu-container">
  <button id="toggle-topic-list-button" class="toggle-topic-list-button">Aiheet</button>
  <div id="topic-list-container" class="topic-list-container">
    <ul id="topic-list" class="chapter-menu menu-button"></ul>
  </div>

  <div class="back-button-container">
    <!-- back-button-containerin sisältö tulee tähän -->
  </div>

  <button id="tasks-button" class="menu-button">Tehtävät</button>
  <button id="test-button" class="menu-button">Testi</button>
</div>

<div class="content-wrapper">
  <div id="theory-container">
    <!-- theory-containerin sisältö tulee tähän -->
  </div>
  <div id="right-container">
    <div id="media-container">
      <!-- media-containerin sisältö tulee tähän, kuten videon tai kuvan latauskoodi -->
    </div>
    <div id="formula-container">
      <!-- formula-containerin sisältö tulee tähän -->
    </div>
  </div>
</div>



      </body>
    </html>
  `,
  // Lisää muita sivuja tarpeen mukaan
};
export async function loadContent(pageName) {
  const contentElement = document.querySelector(".content");
  contentElement.innerHTML = pages[pageName] || "";

  if (pageName === 'peruskoulu') {
    await loadPeruskouluCourses();
  }

 
}

function updateMathJax() {
  return new Promise((resolve) => {
    const element = document.querySelector('.swal2-html-container');
    MathJax.typesetPromise([element]).then(() => {
      setTimeout(resolve, 100);
    });
  });
}





window.app = {
  loadContent,
   loadCourses,
};
async function readCourseJsonFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.error('Error loading JSON file:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching JSON file:', error);
  }
  return null;
}


async function loadPeruskouluCourses() {
  console.log("loadPeruskouluCourses called");

  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';

  // Lue kurssit JSON-tiedostosta
  const courseData = await readCourseJsonFile('/MTdev/Content/peruskoulu.json');
  if (!courseData) {
    console.error('Kurssitietoja ei voitu ladata.');
    return;
  }

  const sortedCourses = courseData.kurssit;

  // Luo kurssilaatikot järjestetyille kursseille.
  for (const course of sortedCourses) {
    const courseBox = await createCourseBox({ course: course });
    console.log('Luotu kurssilaatikko', course);

    courseList.appendChild(courseBox);
  }
}

async function fetchCourseJsonFiles(courseName) {
  try {
    const response = await fetch(`/MTdev/Content/${courseName}_manifest.json`);
	console.log('response:', response);
    if (response.ok) {
      const manifest = await response.json();
      const courseFiles = manifest.files;
      const fileDataPromises = courseFiles.map(file => fetch(`/MTdev/Content/${file}`).then(res => res.json()));
      const fileData = await Promise.all(fileDataPromises);
      return fileData;
    } else {
      console.error('Error loading manifest file:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching manifest file:', error);
  }
  console.log('jsonFiles:', jsonFiles);
  return [];
}



async function loadCourses(courseCategory) {
  // Päivitä courseList-muuttuja kurssikategorian perusteella
  let pageName = '';
  let courseListId = '';
  switch (courseCategory) {
    case 'Peruskoulu':
      pageName = 'peruskoulu';
      courseListId = 'course-list';
      break;
    case 'Lyhyt matematiikka':
      pageName = 'lyhytMatematiikka';
      courseListId = 'course-list-lyhyt-matematiikka';
      break;
    case 'Pitkä matematiikka':
      pageName = 'pitkaMatematiikka';
      courseListId = 'course-list-pitka-matematiikka';
      break;
  }

  // Lataa sivun sisältö ja päivitä DOM
  await loadContent(pageName);

  const courseList = document.getElementById(courseListId);
  if (courseList) {
    courseList.innerHTML = '';
  } else {
    console.error('Element not found:', courseListId);
  }

  // Lue kurssit JSON-tiedostoista
  const courseData = await fetchCourseJsonFiles(courseCategory);
  if (!courseData) {
    console.error('Kurssitietoja ei voitu ladata.');
    return;
  }

  // Järjestä kurssit nimen mukaan
  const sortedCourses = courseData.sort((a, b) => {
    if (a.course === 'MAY1') return -1;
    if (b.course === 'MAY1') return 1;
    return a.course.localeCompare(b.course);
  });

  // Luo kurssilaatikot järjestetyille kursseille.
  for (const course of sortedCourses) {
    const courseBox = await createCourseBox({ course: course });

    courseList.appendChild(courseBox);
  }
}


async function getTopicsForCourse(courseName, storedLanguage) {
  const response = await fetch(`/MTdev/Content/${courseName}_manifest.json`);
  
  if (response.ok) {
    const manifest = await response.json();
    const topics = [];
    
    manifest.files.forEach((fileObj) => {
      const file = fileObj.name;
      const fileNameParts = file.split('_');
      const topicName = fileNameParts[1];
      const language = fileNameParts[2].split('.')[0];

      if (language === storedLanguage) {
        topics.push({
          name: topicName,
          order: fileObj.order // Käytä järjestysnumeroa manifest-tiedostosta
        });
      }
    });
    console.log(`Found ${topics.length} topics for course '${courseName}':`);
    topics.forEach((topic) => console.log(topic.name));
    return topics.sort((a, b) => a.order - b.order);
  } else {
    console.error(`Error fetching manifest file for course '${courseName}': ${response.statusText}`);
    throw new Error(`Error fetching manifest file for course '${courseName}': ${response.statusText}`);
  }
}












async function loadCourseData(courseName, storedLanguage) {
  console.log(`Trying to load course data for '${courseName}' and language '${storedLanguage}'`);

  const manifest = await fetchManifestFile(courseName);
  console.log('manifest:', manifest);
        console.log('Stored language:', storedLanguage); // Lisää tämä

  manifest.files.forEach(file => console.log('File:', file.name));
  
  const jsonFileName = manifest.files.find(file => {
    console.log('Checking file:', file.name);
    return file.name.includes(storedLanguage);
  });
  console.log('jsonFileName:', jsonFileName);

  if (jsonFileName) {
    const jsonFile = await fetchJsonFile(jsonFileName.name);
    console.log('jsonFile:', jsonFile);

    return jsonFile;
  } else {
    console.error(`No valid course data found for course name '${courseName}' and language '${storedLanguage}'`);
    throw new Error(`No valid course data found for course name '${courseName}' and language '${storedLanguage}'`);
  }
}



async function fetchManifestFile(courseName) {
  const response = await fetch(`/MTdev/Content/${courseName}_manifest.json`);
  console.log('response:', response);

  if (!response.ok) {
    console.error(`Failed to fetch manifest file for '${courseName}'. Status code: ${response.status}`);
    throw new Error(`Failed to fetch manifest file for '${courseName}'. Status code: ${response.status}`);
  }

  const manifest = await response.json();
  console.log('manifest:', manifest);
console.log('Manifest JSON:', JSON.stringify(manifest, null, 2));

  return manifest;
}

async function fetchJsonFile(jsonFileName) {
  const response = await fetch(`/MTdev/Content/${jsonFileName}`);
  console.log('response:', response);

  if (!response.ok) {
    console.error(`Failed to fetch JSON file '${jsonFileName}'. Status code: ${response.status}`);
    throw new Error(`Failed to fetch JSON file '${jsonFileName}'. Status code: ${response.status}`);
  }

  const jsonFile = await response.json();
  console.log('jsonFile:', jsonFile);

  return jsonFile;
}












async function createBackButton(textContent) {
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.addEventListener('click', () => {
    loadContent('peruskoulu');
  });
  backButton.textContent = textContent;
  return backButton;
}

const storedLanguage = localStorage.getItem('language') || 'fi';

let answerDiv;

function createAnswerDiv() {
  if (!answerDiv) {
    answerDiv = document.createElement('div');
    answerDiv.id = 'answer1';
    answerDiv.className = 'editor-container';
    answerDiv.setAttribute('contenteditable', true);
    answerDiv.setAttribute('spellcheck', false);
  }
}

createAnswerDiv();
let additionalContent;

function createAdditionalContent() {
  if (!additionalContent) {
    additionalContent = document.createElement('div');
    additionalContent.className = 'additional-content';
    additionalContent.setAttribute("data-lang", "editor_instructions");
  }
}

createAdditionalContent();
function hideEditor() {
  additionalContent.style.display = 'none';
  answerDiv.style.display = 'none';
}
let editorAttached = false;

function reattachEditor() {
    console.log('reattachEditor called');

    if (editorAttached) {
        return;
    }

    // Kiinnitä Quill-editori additionalContent-diviin
    editor.setContents(JSON.parse(additionalContentInput.value));
    additionalContentInput.parentElement.insertBefore(editor.root, additionalContentInput);
    additionalContentInput.style.display = 'none';

    editorAttached = true;
}

function saveTestResults(correctAnswers, incorrectAnswers) {
  // Muodosta tulosobjekti
  const testResults = {
    correctAnswers: correctAnswers,
    incorrectAnswers: incorrectAnswers,
  };

  // Tallenna tulokset LocalStorageen
  localStorage.setItem('testResults', JSON.stringify(testResults));
}
function calculateOverallScore() {
  // Hae lista suoritetuista testeistä
  const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
  let totalScore = 0;

  // Käy läpi jokainen testi ja lisää sen osaamisprosentti kokonaissummaan
  completedTests.forEach((testName) => {
    const testScore = parseFloat(localStorage.getItem(testName + 'Osaaminen')) || 0;
    totalScore += testScore;
  });

  // Laske ja palauta keskiarvo
  return completedTests.length > 0 ? totalScore / completedTests.length : 0;

}

function updateSkillProgressCircle() {
  const overallScore = calculateOverallScore();
  console.log('Overall score:', overallScore);
    localStorage.setItem('skillProgressPercentage', JSON.stringify(overallScore));

  // Poista vanha edistymiskiekko
  const oldSkillProgress = document.querySelector('#skill-progress2');
  if (oldSkillProgress) {
    oldSkillProgress.remove();
  }

 // Luo uusi edistymiskiekko
const newSkillProgress = document.createElement('div');
newSkillProgress.id = 'skill-progress2';
// Luo uusi otsikko
const newSkillProgressTitle = document.createElement('div');
newSkillProgressTitle.className = 'progress-text';
newSkillProgressTitle.textContent = 'Osaaminen'; // Korvaa tämä halutulla tekstillä

// Lisää otsikko edistymiskiekkoon
newSkillProgress.appendChild(newSkillProgressTitle);
// Hae progress-container elementti
const progressContainer = document.querySelector('.progress-container');

// Lisää uusi edistymiskiekko progress-container -elementin sisälle
progressContainer.appendChild(newSkillProgress);

  // Luo uusi CircleProgress-objekti
  const skillProgress = new CircleProgress('#skill-progress2', {
    max: 100,
    value: overallScore,
    textFormat: 'percent'
  });
}



function updateTestProgressCircle() {
  const totalQuestionsAsked = parseInt(localStorage.getItem('totalQuestionsAsked') || 0);
  console.log('Total questions asked:', totalQuestionsAsked);

  const testProgress = new CircleProgress('#test-progress', {
    max: 100,
    value: totalQuestionsAsked,
    textFormat: 'percent'
  });
}




async function displayTests() {
  try {
    // Get course name from localStorage "CourseName" key
    let courseName = localStorage.getItem('courseName');

    // Form request path using course name
    const response = await fetch(`/MTdev/tests/${courseName}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('JSON file loaded:', data);

    // Get already completed tests from localStorage or empty array if not defined
    let completedTests = JSON.parse(localStorage.getItem('completedTests')) || [];

    // Generate HTML for each test
    let testListHTML = '<table><thead><tr><th>Testit</th><th></th><th>Osaaminen</th><th></th></tr></thead><tbody>';
    data.tests.forEach((test, index) => {
      let competencePercentage = localStorage.getItem(test.title + 'Osaaminen');
      let percentageDisplay = competencePercentage ? `: ${competencePercentage}%` : '';
let checkImage = competencePercentage && competencePercentage >= 70 ? '<img src="/MTdev/check.svg" alt="Completed" width="20" height="20">' : '';
      testListHTML += `
        <tr>
          <td>${test.title}</td>
          <td><button id="startTestButton" onclick="startTest('${test.url}', '${test.title}')">Aloita testi</button></td>
          <td>${percentageDisplay}</td>
          <td>${checkImage}</td>
        </tr>
      `;
    });
    testListHTML += '</tbody></table>';

    // Display the tests in a popup
    Swal.fire({
      title: 'Tests',
      html: testListHTML,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
}



// Adjust the startTest function to accept url and title
async function startTest(url, title) {
  try {
    // Hae kurssin nimi localStoragen "CourseName" avaimesta
    let courseName = localStorage.getItem('courseName');

    // Muodosta pyyntöpolku käyttäen kurssin nimeä
    const response = await fetch(`/MTdev/tests/${courseName}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('JSON-tiedosto ladattu:', data);

   // Hae jo suoritetut testit localStoragesta tai tyhjä taulukko, jos sitä ei ole määritelty
    let completedTests = JSON.parse(localStorage.getItem('completedTests')) || [];

    // Etsi ensimmäinen testi, jota ei ole vielä suoritettu
 //   let nextTest = data.tests.find(test => !completedTests.includes(test.title));

   //if (!nextTest) {
  // Kaikki testit on suoritettu
  //Swal.fire('Kaikki testit on suoritettu!', 'Osaamisesi näytetään...', 'info');

  // Hae kaikki osaamisprosentit localStoragesta ja näytä ne
  //let osaamisprosentit = '';
  //for (let i = 0; i < completedTests.length; i++) {
    //let osaaminen = localStorage.getItem(completedTests[i] + 'Osaaminen');
    //osaamisprosentit += `${completedTests[i]}: ${osaaminen}%\n`;
  //}
  //Swal.fire('Osaamisesi:', osaamisprosentit, 'info');
  
 // return;
//}


    console.log(`Aloitetaan testi: ${title}`);

    // Hae testin tiedot sen JSON-tiedostosta
    const testResponse = await fetch(url);


      if (!testResponse.ok) {
        throw new Error(`HTTP error! Status: ${testResponse.status}`);
      }

      const testData = await testResponse.json();

      var tasks = testData.tehtävät;
    var currentLevel = 1;
    var correctAnswers = 0;
    var questionsAsked = 0;
    var incorrectAnswers = 0;
	
 // Lisää funktio näyttämään kuvauksen ja Aloita testi -napin
    async function showTestDescription() {
      await Swal.fire({
        title: 'Lähtötasotesti',
        text: data.kuvaus,
        confirmButtonText: 'Aloita testi',
      });
    }
function createQuestion(task) {
  var question = task.tehtävä + " ";
  var answer = task.vastaus;
  return { question, answer };
}
let questionCircle; // Määritellään globaalin tason muuttujat
let skillCircle;
async function updateTest() {
  if (questionsAsked >= 10) { // Lisää tämä tarkistus
    Swal.fire('Testi päättyi', 'Sait ' + correctAnswers + ' oikein.', 'info');
	// Laske osaamisprosentti
let competencePercentage = (correctAnswers / 10) * 100;

// Hae aiempi paras suoritus
    let previousBest = parseFloat(localStorage.getItem(title + 'Osaaminen')) || 0;

    // Päivitä paras suoritus, jos uusi suoritus on parempi
    if (competencePercentage > previousBest) {
      localStorage.setItem(title + 'Osaaminen', competencePercentage);
    }

    completedTests.push(title);
    localStorage.setItem('completedTests', JSON.stringify(completedTests));
    return;
  }


  var tasksWithCurrentLevel = tasks.filter(function (task) {
    return task.vaikeustaso === currentLevel;
  });

  if (tasksWithCurrentLevel.length > 0) {
    var randomIndex = Math.floor(Math.random() * tasksWithCurrentLevel.length);
    var nextTask = tasksWithCurrentLevel[randomIndex];

    var { question, answer } = createQuestion(nextTask);

const { value: userAnswer, dismiss: dismissReason } = await Swal.fire({
  title: 'Question',
 
html: `
<p style="font-size: 25px;">${question}</p>
<div style="display: flex; justify-content: center;">
  <input id="user-input" class="swal2-input" type="text" placeholder="Kirjoita vastaus tähän">
</div>
<p style="font-size: 20px; text-align: center;">Vastauksesi tulkittiin muodossa:</p>
<div id="math-preview" style="display: flex; justify-content: center;"></div>
<div style="display: flex; justify-content: center; margin-top: 20px;">
  <div id="question-circle" style="width: 200px; height: 200px; margin-right: 10px;">
    <p class="progress-text"></p>
  </div>
  <div id="skill-circle" style="width: 200px; height: 200px;">
    <p class="progress-text"></p>
  </div>
</div>`,



  showCancelButton: true,
  confirmButtonText: 'Vastaa',
  cancelButtonText: 'Peruuta',
  customClass: {
    container: 'my-swal-container',
    popup: 'my-swal-popup',
    confirmButton: 'my-swal-confirm-button',
    cancelButton: 'my-swal-cancel-button'
  },
 
  preConfirm: () => {
    return document.querySelector('#user-input').value;
  },
 
    
didOpen: (modal) => {
	MathJax.typesetPromise();
  const userInput = modal.querySelector('#user-input');
    const mathPreview = modal.querySelector('#math-preview');

  userInput.addEventListener('input', () => {
  const userInputValue = userInput.value
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}') // Muunna murtoluvut
    .replace(/sqrt\((\d+)\)/g, '\\sqrt{$1}');  // Muunna neliöjuuret

  mathPreview.textContent = '\\(' + userInputValue + '\\)';
  MathJax.typesetPromise();
});
  const questionCircleElement = modal.querySelector('#question-circle');
  const skillCircleElement = modal.querySelector('#skill-circle');

  const questionCircle = new CircleProgress(questionCircleElement, {
    max: 100,
    value: 0,
    textFormat: 'percent'
  });

  const skillCircle = new CircleProgress(skillCircleElement, {
    max: 100,
    value: 0,
    textFormat: 'percent'
  });
  const questionTextElement = questionCircleElement.querySelector('.progress-text');
  questionTextElement.textContent = 'Kysymykset';

  const skillTextElement = skillCircleElement.querySelector('.progress-text');
  skillTextElement.textContent = 'Osaaminen';
  const updateProgress = () => {
    if (questionCircleElement) {
      questionCircle.value = Math.round((questionsAsked / 10) * 100);
    }

    if (skillCircleElement) {
      skillCircle.value = Math.round((correctAnswers / 10) * 100);
    }
  };

  updateProgress();
}







    });
if (dismissReason === Swal.DismissReason.cancel) {
  // Käyttäjä painoi "Peruuta"-nappia
  return;
}


    if (userAnswer === answer) {
      correctAnswers++;
      currentLevel++;
	   if (questionCircle) {
  questionCircle = new CircleProgress('#question-circle', {
    value: questionsAsked / 10,
    textFormat: 'percent',
    textValue: function(value) {
      return Math.round(value * 100) + '%';
    }
  });
}

if (skillCircle) {
  skillCircle = new CircleProgress('#skill-circle', {
    value: correctAnswers / 10,
    textFormat: 'percent',
    textValue: function(value) {
      return Math.round(value * 100) + '%';
    }
  });
}

      Swal.fire('Oikein!', 'Siirrytään vaikeustasolle ' + currentLevel, 'success');
      questionsAsked++; // Kasvata kysyttyjen kysymysten määrää vasta oikean vastauksen jälkeen
      updateTest();
    } else if (userAnswer !== undefined) { // Lisää tämä tarkistus
      incorrectAnswers++;
	  Swal.fire('Väärin!', 'Jatketaan vaikeustasolla ' + currentLevel, 'error');
      questionsAsked++; // Kasvata kysyttyjen kysymysten määrää vasta väärän vastauksen jälkeen
      updateTest();
    } else { // Lisää tämä tarkistus
      Swal.fire('Testi peruttu', '', 'info');
	      saveTestResults(correctAnswers, incorrectAnswers); // Tallenna testitulokset perutun testin tapauksessa
    return; // Lopeta testi, kun se perutaan

    }
  } else {
    Swal.fire('Testi päättyi', 'Sait ' + correctAnswers + ' oikein.', 'info');
  }
  if (questionsAsked >= 10) {
    Swal.fire('Testi päättyi', 'Sait ' + correctAnswers + ' oikein.', 'info');
    saveTestResults(correctAnswers, incorrectAnswers); // Tallenna testitulokset testin päättyessä
	const totalCorrectAnswers = parseInt(localStorage.getItem('totalCorrectAnswers') || 0);
    const totalQuestionsAsked = parseInt(localStorage.getItem('totalQuestionsAsked') || 0);
    localStorage.setItem('totalCorrectAnswers', totalCorrectAnswers + correctAnswers);
    localStorage.setItem('totalQuestionsAsked', totalQuestionsAsked + questionsAsked);
 console.log('Total correct answers:', totalCorrectAnswers);
  console.log('Total questions asked:', totalQuestionsAsked);
  updateTestProgressCircle();
    updateSkillProgressCircle();
    return;
  }

  

}

	
    // Aloita testi näyttämällä kuvauksen
    await showTestDescription();
    updateTest();
  } catch (error) {
    console.error('Virhe ladattaessa JSON-tiedostoa:', error);
  }
}

 
function checkIfTaskIsDone(taskElement) {
    // Hae kurssin nimi localStoragesta
    const courseName = localStorage.getItem('courseName');

    // Hae aiheen nimi localStoragesta
    const topicName = localStorage.getItem('topicName');

    // Hae tehtävän nimi localStoragesta
    const taskName = localStorage.getItem('taskName');

    // Muodosta tehtävän tunnistetieto
    const taskId = `${courseName}_${topicName}_${taskName}`;
    console.log(`Tehtävän tunniste: ${taskId}`); // Tulostaa tehtävän tunnisteen

    // Tarkista localStoragesta, onko tehtävä merkitty tehdyksi
    const isDone = localStorage.getItem(taskId);
    console.log(`Tehtävä merkitty tehdyksi localStoragessa: ${isDone}`); // Tulostaa onko tehtävä merkitty tehdyksi

    // Jos tehtävä on merkitty tehdyksi, näytä popup
    if (isDone === 'true') {
        Swal.fire({
            title: 'Olet jo tehnyt tämän tehtävän!',
            text: 'Haluatko tehdä sen uudestaan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Kyllä, haluan!',
            cancelButtonText: 'Ei, en halua'
        }).then((result) => {
            if (result.isConfirmed) {
               
            }
        });
    }
}




async function showCourseContent(courseName) {
  try {
    await loadContent('courseContent');
     // Lisää kielten käsittely tässä
    
        console.log('Stored language:', storedLanguage); // Lisää tämä
const courseData = await loadCourseData(courseName, storedLanguage);

    let backButtonLabel = 'Takaisin kurssilistaan';

    try {
      const response = await fetch(`./lang/${storedLanguage}.json`);
      const translations = await response.json();
            console.log('Translations:', translations); // Lisää tämä

      backButtonLabel = translations['back_to_course_list'];
            console.log('Back button label:', backButtonLabel); // Lisää tämä

    } catch (error) {
      console.error('Virhe ladattaessa kielitiedostoa:', error);
    }
    const tasksButton = document.getElementById('tasks-button');
    const theoryContainer = document.getElementById('theory-container');

const testButton = document.getElementById('test-button');
testButton.addEventListener('click', function() {
  console.log('Testi käynnistyy...');
  displayTests();
});


let isFirstTask = true;
const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
let isButtonContainerAdded = false;


const saveButton = document.createElement('button');
saveButton.innerText = 'Tallenna';
buttonContainer.appendChild(saveButton);
console.log('Tallenna-nappi lisätty:', saveButton);

function saveEditorContent() {
  const content = answerDiv.innerHTML;
  const timestamp = new Date().toISOString();
  const date = timestamp.substring(0, 10);
  const time = timestamp.substring(11, 19);
  const key = `editori.${courseName}_${currentTopicName}_${date}_${time}`;
  localStorage.setItem(key, content);
  console.log('Sisältö tallennettu:', key);
  Swal.fire({
    icon: 'success',
    title: 'Tallennettu!',
    text: 'Sisältö on tallennettu.',
    timer: 1500,
    showConfirmButton: false,
  });
}

function attachButtonContainer() {
  console.log('attachButtonContainer called');
  if (!isButtonContainerAdded) {
    answerDiv.insertAdjacentElement('afterend', buttonContainer);
    isButtonContainerAdded = true;
  } else {
    buttonContainer.remove();
    answerDiv.insertAdjacentElement('afterend', buttonContainer);
  }
}


saveButton.addEventListener('click', saveEditorContent);
function clearTaskContent() {
  const taskContent = document.querySelector('.task-content');
  if (taskContent) {
    taskContent.remove();
  }
}
function createPDF(content, fileName) {
  const pdf = new jsPDF();
  pdf.text(content, 10, 10);
  pdf.save(fileName);
}
const openJsonButton = document.createElement('button');
openJsonButton.innerHTML = "Avaa tallennus";
buttonContainer.appendChild(openJsonButton);
openJsonButton.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      openJsonFile(file);
    }
  });

  fileInput.click();
});
async function openJsonFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const jsonContent = event.target.result;
    try {
      const data = JSON.parse(jsonContent);
      if (data.key && data.content) {
        answerDiv.innerHTML = data.content;
      } else {
        Swal.fire('Virhe', 'JSON-tiedoston muoto ei ole oikea.', 'error');
      }
    } catch (error) {
      Swal.fire('Virhe', 'JSON-tiedoston luku epäonnistui.', 'error');
    }
  };
  reader.readAsText(file);
}

let isLoadButtonAdded = false; 
function checkPreviousSave() {
	
  console.log('Checking previous save...');
  console.log(localStorage);
  console.log('Button container:', buttonContainer);
  console.log('isLoadButtonAdded before:', isLoadButtonAdded);
  setTimeout(() => {
    const key = `editori.${courseName}_${currentTopicName}_${new Date().toISOString().substring(0, 10)}`;
    const previousContent = localStorage.getItem(key);

    if (!isLoadButtonAdded) {
      const loadButton = document.createElement('button');
      loadButton.setAttribute('data-action', 'load-saved-content');
      loadButton.innerText = 'Edelliset tallennukset';
      buttonContainer.appendChild(loadButton);
      console.log('Edelliset tallennukset -nappi lisätty:', loadButton);
      isLoadButtonAdded = true;
      console.log('isLoadButtonAdded after:', isLoadButtonAdded);

      loadButton.addEventListener('click', () => {
        const keys = Object.keys(localStorage);
        const savedContents = keys
          .filter(function (key) {
            return key.startsWith('editori.' + courseName + '_' + currentTopicName);
          })
          .map(function (key) {
            return {
              key: key,
              content: localStorage.getItem(key),
            };
          })
          .sort(function (a, b) {
            return new Date(b.key.split('_').slice(-2).join('T')) - new Date(a.key.split('_').slice(-2).join('T'));
          });

        if (savedContents.length > 0) {
          let savedContentHTML = '<div class="saved-contents">';
          savedContents.forEach(function (savedContent) {
            savedContentHTML += `
<div class="saved-content">
              <h4>${savedContent.key.replace(/_/g, ' ')}</h4>
              <p>${savedContent.content}</p>
              <div class="saved-content-buttons">
                <button class="open-saved-content" data-key="${savedContent.key}">
                  <img src="open.svg" title="Avaa">
                </button>
                <button class="delete-saved-content" data-key="${savedContent.key}">
                  <img src="delete.svg" title="Poista">
                </button>
                <button class="pdf-saved-content" data-key="${savedContent.key}">
                  <img src="pdf.svg" title="PDF">
                </button>
                <button class="json-saved-content" data-key="${savedContent.key}">
                  <img src="file.svg" title="Tallenna tiedostoon">
                </button>
              </div>
            </div>`;
          });
          savedContentHTML += '</div>';

          Swal.fire({
            title: 'Edelliset tallennukset',
            html: savedContentHTML,
            confirmButtonText: 'Sulje',
            didOpen: () => {
// Rest of the code for handling buttons inside the modal
const removeButtons = document.querySelectorAll('.delete-saved-content');
removeButtons.forEach((removeButton, index) => {
  removeButton.addEventListener('click', () => {
    Swal.fire({
      title: 'Haluatko varmasti poistaa tallennuksen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Kyllä, poista',
      cancelButtonText: 'Peruuta',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(savedContents[index].key);
        Swal.fire('Poistettu!', 'Tallennus on poistettu.', 'success');
        checkPreviousSave();
      }
    });
  });
});

function getKeyFromEvent(event) {
  const target = event.target.tagName === 'BUTTON' ? event.target : event.target.closest('button');
  return target.getAttribute('data-key');
}
const jsonButtons = document.querySelectorAll('.json-saved-content');
jsonButtons.forEach((jsonButton, index) => {
  jsonButton.addEventListener('click', () => {
    const content = savedContents[index].content;
    const fileName = `Tallennus_${savedContents[index].key}.json`;

    const data = {
      key: savedContents[index].key,
      content: content
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  });
});

// Lisää käsittelijä "Avaa" -napille
document.querySelectorAll('.open-saved-content').forEach((button) => {
  button.addEventListener('click', (event) => {
    const key = getKeyFromEvent(event);
    const content = localStorage.getItem(key);
    answerDiv.innerHTML = content;
    Swal.close();
  });
});

document.querySelectorAll('.pdf-saved-content').forEach((button) => {
  button.addEventListener('click', async (event) => { // Lisää async tässä
    const key = getKeyFromEvent(event);
    const content = localStorage.getItem(key);

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = content;
    await window.MathJax.typesetPromise([contentDiv]);

    const opt = {
      margin: 10,
      filename: `Tallennus_${key}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    setTimeout(() => {
      html2pdf().from(contentDiv).set(opt).save();
    }, 500);
  });
});
            },
          });
        } else {
          Swal.fire('Ei tallennuksia', 'Ei löydetty yhtään tallennusta.', 'info');
        }
      });
    }
  }, 1000);
}







let storedLanguage2 = localStorage.getItem('storedLanguage');


  async function fetchJSONFile(courseName, storedLanguage2) {
	        console.log('Stored language:', storedLanguage); // Lisää tämä
  
  const response = await fetch(`/MTdev/tasks/${courseName}_tasks_${storedLanguage}.json`);
  const data = await response.json();
  return data;
}





tasksButton.addEventListener("click", async () => {
  const topicName = currentTopicName;

  console.log("Aloitetaan tehtävien haku, aihe:", topicName);
  checkPreviousSave();
let skillProgressPercentage = parseInt(localStorage.getItem('skillProgressPercentage')) || 0;
console.log("Osaamisprosentti:", skillProgressPercentage);
  const tasksData = await fetchJSONFile(courseName);

  let taskNumber = 1;
console.log(tasksData);
  mediaContainer.innerHTML = "";
  theoryContainer.innerHTML = "";
let isAppended = false;

  const filteredTasks = tasksData.tasks.filter(
  (task) =>
    task.course === courseName &&
    task.topic === topicName &&
    task.language === storedLanguage
);

  if (filteredTasks.length === 0) {
    console.log("Ei tehtäviä löytynyt aiheelle:", topicName);
  } else {
    filteredTasks.sort((a, b) => a.difficulty - b.difficulty);
// Divide tasks into difficulty levels
let difficultyTasks = Array.from({length: 10}, () => []);
for (let task of filteredTasks) {
  difficultyTasks[task.difficulty - 1].push(task);
}

// Select one task from each difficulty level
let selectedTasks = [];
let skillLevelIndex = Math.floor(skillProgressPercentage / 10) - 1;

for (let i = 0; i < difficultyTasks.length; i++) {
  if (difficultyTasks[i].length > 0) {
    let taskIndex = Math.floor(Math.random() * difficultyTasks[i].length);
    selectedTasks.push(difficultyTasks[i].splice(taskIndex, 1)[0]);
  }
}

// Determine the indices of the levels one and two below and above the current skill level
let indices = [
  Math.max(0, skillLevelIndex - 2),
  Math.max(0, skillLevelIndex - 1),
  skillLevelIndex,
  Math.min(9, skillLevelIndex + 1),
  Math.min(9, skillLevelIndex + 2),
];

// Add one more task from each of the determined levels
for (let i of indices) {
  if (selectedTasks.length >= 20) {
    break;
  }
  if (difficultyTasks[i].length > 0) {
    let taskIndex = Math.floor(Math.random() * difficultyTasks[i].length);
    selectedTasks.push(difficultyTasks[i].splice(taskIndex, 1)[0]);
  }
}

// If there are less than 20 tasks, fill up with tasks from the current level, one level below, and one level above
let fillIndices = [
  Math.max(0, skillLevelIndex - 1),
  skillLevelIndex,
  Math.min(9, skillLevelIndex + 1),
];

for (let i of fillIndices) {
  while (selectedTasks.length < 20 && difficultyTasks[i].length > 0) {
    let taskIndex = Math.floor(Math.random() * difficultyTasks[i].length);
    selectedTasks.push(difficultyTasks[i].splice(taskIndex, 1)[0]);
  }
  if (selectedTasks.length >= 20) {
    break;
  }
}

// Sort selected tasks by difficulty
selectedTasks.sort((a, b) => a.difficulty - b.difficulty);


    selectedTasks.forEach((taskData) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task difficulty-" + taskData.difficulty;
      const truncatedName =
        taskData.name.length > 100
          ? taskData.name.slice(0, 100) + "..."
          : taskData.name;
      taskElement.innerHTML = taskNumber + ". " + truncatedName;
      mediaContainer.appendChild(taskElement);
      taskNumber++;

                // Lisää klikkaustapahtuma tehtävälle
                taskElement.addEventListener('click', () => {
					localStorage.setItem('taskName', taskData.name);
					checkIfTaskIsDone();
                    // Tyhjennä theoryContainer ennen uuden tehtävän sisällön lisäämistä
                    clearTaskContent();

					
 if (!isAppended) {
    theoryContainer.appendChild(additionalContent);
	console.log('Appending editor to theoryContainer');
    theoryContainer.appendChild(answerDiv);
    isAppended = true;
  } else {
    // Varmista, että additionalContent ja answerDiv ovat teoriaContainerissa
    if (additionalContent.parentElement !== theoryContainer) {
      theoryContainer.appendChild(additionalContent);
    }
    if (answerDiv.parentElement !== theoryContainer) {
		console.log('Appending editor to theoryContainer');
      theoryContainer.appendChild(answerDiv);
    }
	
  }

  additionalContent.style.display = '';
answerDiv.style.display = '';

                   // Lisää ylempi div-elementti tehtävän nimellä ja kuvauksella
const taskContent = document.createElement('div');
taskContent.className = 'task-content';
const taskName = document.createElement('p');
taskName.innerHTML =  taskData.name;

const difficultyLevel = taskData.difficulty;
const difficultyBar = document.createElement('progress');
difficultyBar.className = 'difficulty-bar';
difficultyBar.max = 10; // Vaikeustaso maksimiarvo
difficultyBar.value = difficultyLevel; // Aseta vaikeustaso palkin arvoksi


	
const taskDescription = document.createElement('p');
taskDescription.innerHTML = `Vaikeustaso: ${difficultyLevel}`;

const taskButtonsContainer = document.createElement('div');
taskButtonsContainer.className = 'task-buttons-container';

 const taskAnswerButton = document.createElement('button');
  taskAnswerButton.id = 'task-answer-button';
  taskAnswerButton.textContent = 'Vastaus';
  taskButtonsContainer.appendChild(taskAnswerButton);

 const taskSolutionButton = document.createElement('button');
  taskSolutionButton.id = 'task-solution-button';
  taskSolutionButton.textContent = 'Ratkaisu';
  taskButtonsContainer.appendChild(taskSolutionButton);

const taskSaveButton = document.createElement('button');
taskSaveButton.id = 'task-save-button';
taskSaveButton.textContent = 'Lisää editoriin';
taskButtonsContainer.appendChild(taskSaveButton);

const taskMarkDoneButton = document.createElement('button');
taskMarkDoneButton.id = 'task-mark-done-button';
taskMarkDoneButton.textContent = 'Merkitse tehdyksi';
					  

// Lisää nappi DOMiin
taskButtonsContainer.appendChild(taskMarkDoneButton);



taskContent.appendChild(taskName);
taskContent.appendChild(taskDescription);
taskContent.appendChild(difficultyBar);

taskContent.appendChild(taskButtonsContainer);
taskSaveButton.addEventListener('click', async () => {
  console.log('Tallenna-painiketta klikattu');

  // Olettaen, että sinulla on jo viittaus tehtävään
  const taskContent = taskName; // Tämä on tehtävän sisältö
  console.log('Tehtävän sisältö:', taskContent.outerHTML);

  // Lataa tehtävän sisältö suoraan editoriin
  const answer = document.querySelector('#answer1');
  console.log('Ennen sisällön asettamista, editorin sisältö:', answer.innerHTML);

  // Kloonaa taskContent
  const taskContentClone = taskContent.cloneNode(true);

  // Lisää taskContentClone answer-elementin sisälle
  answer.appendChild(taskContentClone);

  // Luo uusi p-elementti, joka sisältää kaksi rivinvaihtoa
  const emptyLines = document.createElement('p');
  emptyLines.innerHTML = '<br><br>';

  // Lisää tyhjät rivit editoriin
  answer.appendChild(emptyLines);

  console.log('Sisällön asettamisen jälkeen, editorin sisältö:', answer.innerHTML);
});




taskSolutionButton.addEventListener('click', async () => {
  
  const taskSolution = taskData.solution;

  // Avaa Swal-popup tehtävän ratkaisulla
  Swal.fire({
    title: 'Tehtävän ratkaisu',
    html: `<p class="MathJax">${taskSolution}</p>`,
    didOpen: () => {
      MathJax.typesetPromise();
    }
  });
});

taskAnswerButton.addEventListener('click', async () => {
  
  const taskAnswer = taskData.answer;

  // Avaa Swal-popup tehtävän ratkaisulla
  Swal.fire({
    title: 'Tehtävän vastaus',
    html: `<p class="MathJax">${taskAnswer}</p>`,
    didOpen: () => {
      MathJax.typesetPromise();
    }
  });
});
  taskSaveButton.addEventListener('click', async () => {
    console.log('Tallenna-painiketta klikattu');
  });

taskMarkDoneButton.addEventListener('click', async () => {
  console.log('Merkitse tehdyksi -painiketta klikattu');
  
  // Muodosta tehtävän tunnistetieto
  const courseId = courseName; // Vaihda kurssin nimi haluamaksesi
  const topicNam = topicName // Vaihda aiheen nimi haluamaksesi
  const taskName = taskData.name; // Vaihda tehtävän nimi haluamaksesi
  const taskId = `${courseId}_${topicNam}_${taskName}`;
  
  // Tallenna tiedot local storageen
  const isDone = true; // Merkkaa tehtävä tehdyksi
  localStorage.setItem(taskId, isDone);
  
  // Päivitä napin ulkoasu
  taskMarkDoneButton.classList.add('done');
  
  // Tulosta tallennetut tiedot konsoliin
  console.log(`Tehtävä ${taskId} on tallennettu: ${isDone}`);
});




 

function reattachEditor() {
	console.log('reattachEditor called');

  if (additionalContent.parentElement !== theoryContainer) {
    theoryContainer.appendChild(additionalContent);
  }
  if (answerDiv.parentElement !== theoryContainer) {
    theoryContainer.appendChild(answerDiv);
  }
}


theoryContainer.appendChild(taskContent);
if (additionalContent.parentElement === theoryContainer) {
  theoryContainer.insertBefore(taskContent, additionalContent);
} else {
  theoryContainer.appendChild(taskContent);
}

attachButtonContainer();

 checkPreviousSave();
const answer = document.querySelector('#answer1')

  makeRichText(answer, {
    screenshotSaver: ({data, type}) =>
      new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = evt => resolve(evt.target.result.replace(/^(data:image)(\/[^;]+)(;.*)/,'$1$3'))
        reader.readAsDataURL(new Blob([data], { type }))
      }),
    baseUrl: 'https://math-demo.abitti.fi',
    updateMathImg: ($img, latex) => {
      $img.prop({
        src: "data:image/svg+xml;base64," + getSvg(latex),
        alt: latex.replace(/</g, '\\lt ').replace(/>/g, '\\gt ')
      })
      $img.closest('[data-js="answer"]').trigger('input')
    }
  })

  const getSvg = function(latex) {
	  var MathJax = window.MathJax
    const node = MathJax.tex2svg(latex);
    if (node.querySelector("[data-mjx-error]")) {
      return (window.btoa(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="305px" height="20px" viewBox="0 0 305 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Group 2</title>
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-241.000000, -219.000000)">
            <g transform="translate(209.000000, 207.000000)">
                <rect x="-1.58632797e-14" y="0" width="80" height="40"></rect>
                <g transform="translate(32.000000, 12.000000)">
                    <polygon id="Combined-Shape" fill="#9B0000" fill-rule="nonzero" points="0 18 8.04006 2 16.08012 18"></polygon>
                    <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 14 9 14 9 16 7 16"></polygon>
                    <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 7 9 7 9 12 7 12"></polygon>
                </g>
            </g>
        </g>
    </g>
    <text x="25" y="16" fill="red">Virhe LaTeX-koodissa / Fel i LaTeX-koden</text>
</svg>`));
    } else {
      return btoa(
        encodeURIComponent(node.firstChild.outerHTML).replace(/%([0-9A-F]{2})/g, (match, p1) =>
          String.fromCharCode('0x' + p1)
        )
      )
    }
  }



          
 // Päivitä MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }	  
                });
            
        });
    }

    // Päivitä MathJax
  if (window.MathJax) {
        MathJax.typesetPromise();
      }
    });
  












// Luo ja lisää backButton
    const backButton = await createBackButton();
const backButtonContainer = document.querySelector('.back-button-container');
createBackButton(backButtonLabel).then((backButton) => {
  backButtonContainer.appendChild(backButton);
  
});


    const loadedCourseData = await loadCourseData(courseName, storedLanguage);
const topicListContainer = document.getElementById('topic-list-container');
const toggleTopicListButton = document.getElementById('toggle-topic-list-button');
const courseTitleElement = document.getElementById('course-title');
const topicListElement = document.getElementById('topic-list');
const theoryContentElement = document.getElementById('theory-container');
const mediaContainer = document.getElementById('media-container');

courseTitleElement.textContent = courseData.course;

  const topics = await getTopicsForCourse(courseName, storedLanguage);
let currentTopicName = topics[0].name;

topics.forEach((topic, index) => {
  const topicListItem = document.createElement('li');

  const topicButton = document.createElement('button');
  topicButton.textContent = topic.name;
  topicButton.addEventListener('click', async () => {
	
    topicListContainer.classList.remove('open');
    theoryContainer.innerHTML = '';
    currentTopicName = topic.name;
    theoryContentElement.innerHTML = '';
	localStorage.setItem('topicName', topic.name);


    try {
      const courseData = await loadCourseData(courseName, topic.name, storedLanguage);
      theoryContentElement.innerHTML = courseData.theory;
      await renderMathJax();
      await loadMedia(courseData);
    } catch (error) {
      console.error(`Error loading theory content for '${courseName}', topic '${topic.name}', and language '${storedLanguage}':`, error);
    }
  });

  topicListItem.appendChild(topicButton);
  topicListElement.appendChild(topicListItem);
});




// Lisää tämä koodi aiemman koodin tilalle
toggleTopicListButton.addEventListener('click', function () {
  topicListContainer.classList.toggle('open');
});



    async function renderMathJax() {
      if (window.MathJax) {
        window.MathJax.typesetPromise();
      } else {
        console.error('MathJax is not loaded.');
      }
    }

    const firstTopic = topics.find(topic => topic.order === 0);
	
if (firstTopic) {
  console.log('First topic:', firstTopic);

  const jsonFileName = `${courseName}_${firstTopic.name}_${storedLanguage}.json`;
  const firstTopicData = await fetchJsonFile(jsonFileName);

  if (firstTopicData) {
    console.log('First topic data:', firstTopicData);

    theoryContentElement.innerHTML = firstTopicData.theory;
    await renderMathJax();
    await loadMedia(firstTopicData);
  } else {
    console.error(`Error loading course content for '${courseName}', topic '${firstTopic.name}': Data not found`);
  }
}







  } catch (error) {
    console.error(`Error loading course content for '${courseName}':`, error);
  }
 
}

async function loadMedia(chapterData) {
  const mediaContainer = document.getElementById('media-container');
  mediaContainer.innerHTML = '';

  if (chapterData.video) {
    const videoId = extractYouTubeVideoId(chapterData.video);

    if (videoId) {
      const iframeElement = document.createElement('iframe');
      iframeElement.src = `https://www.youtube.com/embed/${videoId}`;
      iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframeElement.allowFullscreen = true;
       iframeElement.style.width = '100%';
      iframeElement.style.height = '100%';
      iframeElement.classList.add('video-fit')
      mediaContainer.appendChild(iframeElement);
    }
  } else {
    const imageUrl = await getImageUrl('mt');
    if (imageUrl) {
      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      mediaContainer.appendChild(imageElement);
    }
  }
}

function extractYouTubeVideoId(url) {
  const videoIdRegex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(videoIdRegex);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return null;
}









// Päivitä window.app.loadCourses ja export { loadCourses } kutsut
window.app = {
  loadContent,
  loadCourses,
};






async function getImageUrl(courseId) {
  const { getStorage, ref, getDownloadURL } = await import('./firebasein.js');
  const storage = getStorage();

  try {
    const imageRef = ref(storage, `images/${courseId}.png`);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error(`Error fetching image for course '${courseId}':`, error);
    return null;
  }
}

function updateHeaderCourseInfo() {
  const courseName = localStorage.getItem('currentCourse');
  const courseInfoElement = document.getElementById('course-info');
  if (courseName) {
    courseInfoElement.textContent = `Suoritat kurssia: ${courseName}`;
  } else {
    courseInfoElement.textContent = '';
  }
}
async function onCourseInfoClick() {
  const courseName = localStorage.getItem('currentCourse');
  if (!courseName) return;

  const result = await Swal.fire({
    title: 'Poistu kurssilta',
    text: `Haluatko poistua kurssilta ${courseName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Kyllä',
    cancelButtonText: 'Ei'
  });

  if (result.isConfirmed) {
    // Poistetaan tallennettu kurssi, jos käyttäjä valitsi "Kyllä"
    localStorage.removeItem('currentCourse');
    updateHeaderCourseInfo();
  }
}

 


async function createCourseBox(courseData) {
  const courseBox = document.createElement('div');
  courseBox.className = 'course-box';


  // Hae taustakuva Firebase Storagesta
  const imageUrl = await getImageUrl(courseData.course);
  if (imageUrl) {
    courseBox.style.backgroundImage = `url(${imageUrl})`;
  }

  const courseTitle = document.createElement('h3');
  courseTitle.textContent = courseData.course;
  courseBox.appendChild(courseTitle);

  const courseDescription = document.createElement('p');
  courseDescription.textContent = courseData.description;
  courseBox.appendChild(courseDescription);
 courseBox.addEventListener('click', () => {
    showCourseContent(courseData.course);
    localStorage.setItem('courseName', courseData.course);
	async function onCourseClick(courseName) {
  const result = await Swal.fire({
    title: 'Aloita kurssi',
    text: `Haluatko aloittaa kurssin ${courseName}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Kyllä',
    cancelButtonText: 'Ei'
  });

  if (result.isConfirmed) {
    // Tallennetaan kurssin tiedot, jos käyttäjä valitsi "Kyllä"
    localStorage.setItem('currentCourse', courseName);
    updateHeaderCourseInfo();
  }
}
document.getElementById('course-list').addEventListener('click', (event) => {
  if (event.target.matches('.course-box')) {
    onCourseClick(event.target.dataset.courseName);
  }
});

document.getElementById('course-info').addEventListener('click', onCourseInfoClick);

  });
  return courseBox;
}

async function loadTasks(courseName, topicName, storedLanguage) {
  console.log('Hakee tehtäviä kurssilta:', courseName, 'luku:', topicName, 'kieli:', storedLanguage);

  const { getFirestore, collection, query, where, getDocs } = await import('./firebasein.js');
  const db = getFirestore();
  const tasksRef = collection(db, 'tasks');
 console.log('Stored language:', storedLanguage);
  const tasksQuery = query(
    tasksRef,
    where('course', '==', courseName),
    where('topic', '==', topicName),
    where('language', '==', storedLanguage),
    orderBy('difficulty')
  );
  const tasksSnap = await getDocs(tasksQuery);

  console.log('Tehtävät haettu:', tasksSnap.docs);

  const tasks = tasksSnap.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data };
  });

  console.log('Tehtävät:', tasks);

  return tasks;
}



export { pages };


document.addEventListener('DOMContentLoaded', async () => {
	console.log('DOMContentLoaded event triggered'); // Lisää tämä rivi
	
  loadContent('etusivu');
 updateTestProgressCircle();
    updateSkillProgressCircle();
	// Attach the function to the window object to make it globally accessible
window.startTest = startTest;

});

