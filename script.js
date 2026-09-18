// Get the buttons and text areas from the HTML page.
var languageButton = document.getElementById("languageButton");
var needButtons = document.querySelectorAll(".need-button");
var selectedMessage = document.getElementById("selectedMessage");
var sendButton = document.getElementById("sendButton");

// Store the language currently shown on the screen.
var currentLanguage = "english";

// Store the selected need. It is empty until the student selects a tile.
var selectedNeed = "";

// English and Finnish text used by the application.
var translations = {
  english: {
    appTitle: "Communication Aid",
    welcome: "Hello Alex, Welcome",
    instruction: "What do you want?",
    messageTitle: "Your message",
    startMessage: "Tap an icon above to select",
    sendButton: "Send to Teacher",
    sendMessage: "This function is not availble yet.",
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
    sleep: "I need to sleep",
    sleepLabel: "Sleep",
  },
  finnish: {
    appTitle: "Kommunikoinnin apuväline",
    welcome: "Hei Alex, tervetuloa",
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
    sleep: "Minun täytyy nukkua",
    sleepLabel: "Nukkumaan",
  },
};

// Change all normal screen text and the image descriptions.
function changeLanguage() {
  var pageText = translations[currentLanguage];
  var imageNumber;
  var needName;

  document.querySelector(".app-header h1").textContent = pageText.appTitle;
  document.querySelector(".student-screen > h2").textContent = pageText.welcome; //h2 inside the student-screen class
  document.querySelector(".instruction").textContent = pageText.instruction;
  document.querySelector(".message-area h2").textContent =
    pageText.messageTitle;
  sendButton.textContent = pageText.sendButton;

  // Update the selected sentence, or show the starting instruction.
  if (selectedNeed === "") {
    selectedMessage.textContent = pageText.startMessage;
  } else {
    selectedMessage.textContent = pageText[selectedNeed];
  }

  // Update the alt text label for icons.
  for (imageNumber = 0; imageNumber < needButtons.length; imageNumber++) {
    needName = needButtons[imageNumber]
      .getAttribute("data-message")
      .toLowerCase();
    needButtons[imageNumber].querySelector("img").alt = pageText[needName]; //helps screen readers.
    needButtons[imageNumber].querySelector(".tile-label").textContent =
      pageText[needName + "Label"];
  }

  // Show the language that the button will change to.
  if (currentLanguage === "english") {
    languageButton.textContent = "FI";
  } else {
    languageButton.textContent = "EN";
  }
}

// Read the selected sentence aloud using the browser's speech feature.
function playAudio(message) {
  var speech = new SpeechSynthesisUtterance(message);

  if (currentLanguage === "finnish") {
    speech.lang = "fi-FI";
  } else {
    speech.lang = "en-US";
  }

  speech.pitch = 1.5;
  speech.rate = 0.5;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

// Switch between English and Finnish when the language button is clicked.
languageButton.addEventListener("click", function () {
  if (currentLanguage === "english") {
    currentLanguage = "finnish";
  } else {
    currentLanguage = "english";
  }

  changeLanguage();
});

// Display and speak the message when a student selects a need tile.
for (var buttonNumber = 0; buttonNumber < needButtons.length; buttonNumber++) {
  needButtons[buttonNumber].addEventListener("click", function () {
    // Remove the highlight from every icon.
    for (
      var selectedButtonNumber = 0;
      selectedButtonNumber < needButtons.length;
      selectedButtonNumber++
    ) {
      needButtons[selectedButtonNumber].classList.remove("selected");
    }

    // Add the highlight to the icon that was clicked.
    this.classList.add("selected");
    selectedNeed = this.getAttribute("data-message").toLowerCase();
    selectedMessage.textContent = translations[currentLanguage][selectedNeed];
    playAudio(translations[currentLanguage][selectedNeed]);
  });
}

// Stage 1 only: the message is not sent to a teacher yet.
sendButton.addEventListener("click", function () {
  alert(translations[currentLanguage].sendMessage);
});

// Set the first screen text when the page opens.
changeLanguage();
