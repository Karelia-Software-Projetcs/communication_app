// Application elements from index.html.
var settingsButton = document.getElementById("settingsButton");
var profileDialog = document.getElementById("profileDialog");
var profileForm = document.getElementById("profileForm");
var studentNameInput = document.getElementById("studentNameInput");
var ageInput = document.getElementById("ageInput");
var dateOfBirthInput = document.getElementById("dateOfBirthInput");
var genderInput = document.getElementById("genderInput");
var languageInput = document.getElementById("languageInput");
var needButtons = document.querySelectorAll(".need-button");
var selectedMessage = document.getElementById("selectedMessage");
var sendButton = document.getElementById("sendButton");
var welcomeMessage = document.getElementById("welcomeMessage");
var studentImage = document.getElementById("studentImage");
var tiredImage = document.getElementById("tiredImage");
var angryImage = document.getElementById("angryImage");
var profileSummaryButton = document.getElementById("profileSummaryButton");
var studentSummaryDialog = document.getElementById("studentSummaryDialog");
var closeSummaryButton = document.getElementById("closeSummaryButton");
var summaryName = document.getElementById("summaryName");
var summaryAge = document.getElementById("summaryAge");
var summaryDateOfBirth = document.getElementById("summaryDateOfBirth");
var summaryGender = document.getElementById("summaryGender");
var summaryLanguage = document.getElementById("summaryLanguage");

var profileStorageKey = "communicationAidProfile";
var currentLanguage = "english";
var currentStudent = "boy";
var selectedNeed = "";
var activeAudio = null;

// Text is kept in one place so the selected profile language updates the full screen.
var translations = {
  english: {
    welcome: "Hello {name}, Welcome",
    instruction: "What do you want?",
    messageTitle: "Your message",
    startMessage: "Tap an icon above to select",
    sendButton: "Send to Teacher",
    sendMessage: "This function is not available yet.",
    water: "I need water",
    waterLabel: "Water",
    food: "I need food",
    foodLabel: "Food",
    toilet: "I need to use the toilet",
    toiletLabel: "Toilet",
    tired: "I am tired",
    tiredLabel: "Tired",
    angry: "I am angry",
    angryLabel: "Angry",
  },
  finnish: {
    welcome: "Hei {name}, tervetuloa",
    instruction: "Mitä haluat?",
    messageTitle: "Viestisi",
    startMessage: "Valitse yläpuolelta kuvake",
    sendButton: "Lähetä opettajalle",
    sendMessage: "Tämä toiminto ei ole vielä käytettävissä.",
    water: "Tarvitsen vettä",
    waterLabel: "Vesi",
    food: "Tarvitsen ruokaa",
    foodLabel: "Ruoka",
    toilet: "Minun täytyy mennä vessaan",
    toiletLabel: "Vessa",
    tired: "Olen väsynyt",
    tiredLabel: "Väsynyt",
    angry: "Olen vihainen",
    angryLabel: "Vihainen",
  },
};

// Each key points to an existing local recording in kids_voices.
var voiceFiles = {
  boy: {
    english: {
      water: "en_water.mp3",
      food: "en_food.mp3",
      toilet: "en_toilet.mp3",
      tired: "en_tired.mp3",
      angry: "en_angry.mp3",
    },
    finnish: {
      water: "fi_vesi.mp3",
      food: "fi_ruoka.mp3",
      toilet: "fi_vettä.mp3",
      tired: "fi_väsynyt.mp3",
      angry: "fi_vihainen.mp3",
    },
  },
  girl: {
    english: {
      water: "en_water.mp3",
      food: "en_food.mp3",
      toilet: "en_toilet.mp3",
      tired: "en_tired.mp3",
      angry: "en_angry.mp3",
    },
    finnish: {
      water: "fi_vesi.mp3",
      food: "fi_ruokaa.mp3",
      toilet: "fi_vessa.mp3",
      tired: "fi_väsynyt.mp3",
      angry: "fi_vihainen.mp3",
    },
  },
};

function playLocalAudio(filePath) {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }

  activeAudio = new Audio(filePath);
  activeAudio.play().catch(function () {
    // Browsers may block automatic sound until the teacher clicks Settings.
    // The setup prompt is tried again when the dialog is opened by that click.
  });
}

function playTileAudio(needName) {
  var fileName = voiceFiles[currentStudent][currentLanguage][needName];

  if (fileName) {
    playLocalAudio("kids_voices/" + currentStudent + "/" + fileName);
  }
}

function changeStudentImages() {
  if (currentStudent === "boy") {
    studentImage.src = "images/boy.jpg";
    studentImage.alt = "Boy student";
    tiredImage.src = "images/transparent/tired-boy.png";
    angryImage.src = "images/transparent/angry-boy.png";
  } else {
    studentImage.src = "images/girl.jpg";
    studentImage.alt = "Girl student";
    tiredImage.src = "images/transparent/tired-girl.png";
    angryImage.src = "images/transparent/angry-girl.png";
  }
}

function updateScreenText(studentName) {
  var pageText = translations[currentLanguage];
  var imageNumber;
  var needName;

  welcomeMessage.textContent = pageText.welcome.replace("{name}", studentName);
  document.querySelector(".instruction").textContent = pageText.instruction;
  document.querySelector(".message-area h2").textContent = pageText.messageTitle;
  sendButton.textContent = pageText.sendButton;

  if (selectedNeed === "") {
    selectedMessage.textContent = pageText.startMessage;
  } else {
    selectedMessage.textContent = pageText[selectedNeed];
  }

  for (imageNumber = 0; imageNumber < needButtons.length; imageNumber++) {
    needName = needButtons[imageNumber].getAttribute("data-message").toLowerCase();
    needButtons[imageNumber].querySelector("img").alt = pageText[needName];
    needButtons[imageNumber].querySelector(".tile-label").textContent = pageText[needName + "Label"];
  }
}

function setAppEnabled(isEnabled) {
  var buttonNumber;

  for (buttonNumber = 0; buttonNumber < needButtons.length; buttonNumber++) {
    needButtons[buttonNumber].disabled = !isEnabled;
  }
  sendButton.disabled = !isEnabled;
  document.body.classList.toggle("profile-required", !isEnabled);
}

function fillProfileForm(profile) {
  studentNameInput.value = profile.name || "";
  ageInput.value = profile.age || "";
  dateOfBirthInput.value = profile.dateOfBirth || "";
  genderInput.value = profile.gender || "boy";
  languageInput.value = profile.language || "english";
}

function applyProfile(profile) {
  currentLanguage = profile.language;
  currentStudent = profile.gender;
  selectedNeed = "";
  changeStudentImages();
  updateScreenText(profile.name);
  updateProfileSummary(profile);
  setAppEnabled(true);
}

function updateProfileSummary(profile) {
  summaryName.textContent = profile.name;
  summaryAge.textContent = profile.age;
  summaryDateOfBirth.textContent = profile.dateOfBirth;
  summaryGender.textContent = profile.gender === "girl" ? "Female" : "Male";
  summaryLanguage.textContent = profile.language === "finnish" ? "Finnish" : "English";
}

function openProfileSetup(playSetupPrompt) {
  var savedProfile = localStorage.getItem(profileStorageKey);

  if (savedProfile) {
    fillProfileForm(JSON.parse(savedProfile));
  }
  if (!profileDialog.open) {
    profileDialog.showModal();
  }
  if (playSetupPrompt) {
    playLocalAudio("kids_voices/user_profile_setup.mp3");
  }
}

function loadSavedProfile() {
  var savedProfile = localStorage.getItem(profileStorageKey);

  if (savedProfile) {
    applyProfile(JSON.parse(savedProfile));
    return;
  }

  // A new device has no student selected yet. The teacher opens Settings to begin.
  setAppEnabled(false);
}

settingsButton.addEventListener("click", function () {
  openProfileSetup(true);
});

profileSummaryButton.addEventListener("click", function () {
  if (localStorage.getItem(profileStorageKey) && !studentSummaryDialog.open) {
    studentSummaryDialog.showModal();
  }
});

closeSummaryButton.addEventListener("click", function () {
  studentSummaryDialog.close();
});

profileForm.addEventListener("submit", function (event) {
  var profile;

  event.preventDefault();
  if (!profileForm.checkValidity()) {
    profileForm.reportValidity();
    return;
  }

  profile = {
    name: studentNameInput.value.trim(),
    age: ageInput.value,
    dateOfBirth: dateOfBirthInput.value,
    gender: genderInput.value,
    language: languageInput.value,
  };

  localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  applyProfile(profile);
  profileDialog.close();
});

for (var buttonNumber = 0; buttonNumber < needButtons.length; buttonNumber++) {
  needButtons[buttonNumber].addEventListener("click", function () {
    var selectedButtonNumber;

    for (selectedButtonNumber = 0; selectedButtonNumber < needButtons.length; selectedButtonNumber++) {
      needButtons[selectedButtonNumber].classList.remove("selected");
    }

    this.classList.add("selected");
    selectedNeed = this.getAttribute("data-message").toLowerCase();
    selectedMessage.textContent = translations[currentLanguage][selectedNeed];
    playTileAudio(selectedNeed);
  });
}

sendButton.addEventListener("click", function () {
  alert(translations[currentLanguage].sendMessage);
});

loadSavedProfile();
