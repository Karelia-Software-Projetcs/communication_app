// Application elements from index.html.
var profileDialog = document.getElementById("profileDialog");
var profileForm = document.getElementById("profileForm");
var profileDialogTitle = document.getElementById("profileDialogTitle");
var cancelProfileButton = document.getElementById("cancelProfileButton");
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
var editProfileButton = document.getElementById("editProfileButton");
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
var setupPromptAudio = null;

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
      // These two boy recordings are named differently from the needs they say.
      water: "fi_vettä.mp3",
      food: "fi_ruoka.mp3",
      toilet: "fi_vesi.mp3",
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
    // Audio may be unavailable or blocked by the browser.
  });
}

// 2026-10-25, v1.3: play the initial setup prompt once; retry after a gesture if autoplay is blocked.
function playInitialSetupPrompt() {
  setupPromptAudio = new Audio("kids_voices/user_profile_setup.mp3");
  activeAudio = setupPromptAudio;
  setupPromptAudio.play().catch(function (error) {
    if (error.name === "NotAllowedError" && profileDialog.open && !localStorage.getItem(profileStorageKey)) {
      document.addEventListener("pointerdown", retrySetupPrompt, true);
      document.addEventListener("keydown", retrySetupPrompt, true);
    }
  });
}

function removeSetupPromptListeners() {
  document.removeEventListener("pointerdown", retrySetupPrompt, true);
  document.removeEventListener("keydown", retrySetupPrompt, true);
}

function retrySetupPrompt() {
  removeSetupPromptListeners();
  if (setupPromptAudio && profileDialog.open) {
    setupPromptAudio.play().catch(function () {});
  }
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
  // 2026-10-25, v1.3: lecturer feedback requires Send to Teacher to stay disabled.
  sendButton.disabled = true;
  document.body.classList.toggle("profile-required", !isEnabled);
}

function todayAsInputDate() {
  var today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
}

// 2026-10-25, v1.3: calculate completed years locally and reject future/invalid dates.
function calculateAge(dateOfBirth) {
  if (!dateOfBirth || dateOfBirth > todayAsInputDate()) {
    return null;
  }

  var parts = dateOfBirth.split("-");
  if (parts.length !== 3) {
    return null;
  }
  var year = Number(parts[0]);
  var month = Number(parts[1]);
  var day = Number(parts[2]);
  var birthDate = new Date(year, month - 1, day);
  if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
    return null;
  }

  var today = new Date();
  var age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
    age--;
  }
  return age;
}

function updateAgeInput() {
  var age = calculateAge(dateOfBirthInput.value);
  ageInput.value = age === null ? "" : age;
}

function fillProfileForm(profile) {
  studentNameInput.value = profile.name || "";
  dateOfBirthInput.value = profile.dateOfBirth || "";
  updateAgeInput();
  genderInput.value = profile.gender || "boy";
  languageInput.value = profile.language || "english";
}

function applyProfile(profile) {
  currentLanguage = profile.language;
  currentStudent = profile.gender;
  selectedNeed = "";
  for (var buttonNumber = 0; buttonNumber < needButtons.length; buttonNumber++) {
    needButtons[buttonNumber].classList.remove("selected");
  }
  changeStudentImages();
  updateScreenText(profile.name);
  updateProfileSummary(profile);
  setAppEnabled(true);
}

function updateProfileSummary(profile) {
  summaryName.textContent = profile.name;
  var age = calculateAge(profile.dateOfBirth);
  summaryAge.textContent = age === null ? "-" : age;
  summaryDateOfBirth.textContent = profile.dateOfBirth;
  summaryGender.textContent = profile.gender === "girl" ? "Female" : "Male";
  summaryLanguage.textContent = profile.language === "finnish" ? "Finnish" : "English";
}

// 2026-10-25, v1.3: reuse the profile form for first-time setup and later editing.
function openProfileSetup(isInitialSetup) {
  var savedProfile = localStorage.getItem(profileStorageKey);

  dateOfBirthInput.max = todayAsInputDate();
  profileDialogTitle.textContent = isInitialSetup ? "Student profile setup" : "Edit student profile";
  cancelProfileButton.hidden = isInitialSetup;
  if (savedProfile) {
    fillProfileForm(JSON.parse(savedProfile));
  }
  if (!profileDialog.open) {
    profileDialog.showModal();
  }
  if (isInitialSetup) {
    playInitialSetupPrompt();
  }
}

// 2026-10-25, v1.3: open setup only when there is no saved profile.
function loadSavedProfile() {
  var savedProfile = localStorage.getItem(profileStorageKey);

  if (savedProfile) {
    applyProfile(JSON.parse(savedProfile));
    return;
  }

  // A new device must have a student profile before tiles can be used.
  setAppEnabled(false);
  openProfileSetup(true);
}

// 2026-10-25, v1.3: only the profile picture opens the summary; the greeting is plain text.
profileSummaryButton.addEventListener("click", function () {
  var savedProfile = localStorage.getItem(profileStorageKey);
  if (savedProfile && !studentSummaryDialog.open) {
    updateProfileSummary(JSON.parse(savedProfile));
    studentSummaryDialog.showModal();
  }
});

closeSummaryButton.addEventListener("click", function () {
  studentSummaryDialog.close();
});

// 2026-10-25, v1.3: edit the profile from its summary without replaying the setup voice.
editProfileButton.addEventListener("click", function () {
  studentSummaryDialog.close();
  openProfileSetup(false);
});

cancelProfileButton.addEventListener("click", function () {
  profileDialog.close();
  studentSummaryDialog.showModal();
});

profileDialog.addEventListener("cancel", function (event) {
  if (!localStorage.getItem(profileStorageKey)) {
    event.preventDefault();
  }
});

dateOfBirthInput.addEventListener("input", updateAgeInput);
dateOfBirthInput.addEventListener("change", updateAgeInput);
studentNameInput.addEventListener("input", function () {
  studentNameInput.setCustomValidity("");
});

profileForm.addEventListener("submit", function (event) {
  var profile;

  event.preventDefault();
  dateOfBirthInput.max = todayAsInputDate();
  updateAgeInput();
  studentNameInput.setCustomValidity(studentNameInput.value.trim() ? "" : "Please enter a student name.");
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
  removeSetupPromptListeners();
  if (setupPromptAudio) {
    setupPromptAudio.pause();
    setupPromptAudio = null;
  }
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

loadSavedProfile();
