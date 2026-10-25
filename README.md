# Communication Aid App

An Electron desktop communication aid for students who benefit from selecting clear visual needs. The student can choose an icon, see the related sentence, and hear it spoken aloud.

## Version

The current version is **1.3.0**. It builds on the original 1.0.0 interface with profile setup, local recorded audio, and transparent tile artwork.

## Current features

- Five visual communication tiles: Water, Food, Toilet, Tired, and Angry.
- A teacher profile-setup dialog for student name, age, date of birth, gender, and language.
- English and Finnish interface translations selected from the saved profile.
- Local boy/girl voice recordings for each active tile in both languages.
- A first-time setup prompt using `kids_voices/user_profile_setup.mp3`.
- The student picture opens a profile summary with an option to edit the profile.
- Age is calculated automatically from the student's date of birth.
- The selected-message area is hidden and "Send to Teacher" is disabled.
- Electron desktop application window.

## Screenshots

| English                                              | Finnish                                              |
| ---------------------------------------------------- | ---------------------------------------------------- |
| ![English Communication Aid screen](App_demo_en.png) | ![Finnish Communication Aid screen](App_demo_fi.png) |

## Run the app

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm

### Installation and start

From the `comm_app` folder, install the dependencies and start Electron:

```bash
npm install
npm start
```

## How to use

1. On first use, enter the student details in the profile setup dialog. Age is calculated from the date of birth.
2. Select **Save** to load the matching profile image, language, and local voice recordings.
3. Select a need tile to play its recorded message.
4. Select the student picture to view the profile and choose **Edit Profile** to change it.
5. The message area is hidden and **Send to Teacher** is disabled.

## Project structure

```text
comm_app/
├── index.html        # Application structure and communication tiles
├── style.css         # Layout, colours, tile styling, and responsive rules
├── script.js         # Translations, tile interaction, and speech synthesis
├── index.js          # Electron main process and window configuration
├── images/           # Student, original, and transparent communication-tile images
├── kids_voices/      # Local English and Finnish recordings for boy and girl profiles
├── App_demo_en.png   # English screen example
├── App_demo_fi.png   # Finnish screen example
└── package.json      # Electron dependency and npm start command
```

## Version 1.1.0 changes

Version 1.1.0 introduced personalisation and layout improvements:

- Remove the app title from the header to create more space for the communication screen.
- Enable a Boy/Girl toggle button so the student version can be selected.
- Remove the face from the Water tile image.
- Improve responsive layouts, including a mobile breakpoint so the tiles and controls fit smaller screens.
- Default Electro title/taskbar logo replaced with custom windows icon.

## Authors

Roshan, Darshika, and Nimesha.

## Links

- [GitHub repository](https://github.com/Karelia-Software-Projetcs/communication_app)
- [Online demo](https://karelia-software-projetcs.github.io/communication_app/)

## Version 1.2.0 changes

- Replaced the header language and gender controls with one **Settings** button.
- Added a student profile setup form for name, age, date of birth, gender, and language.
- Saved the student profile locally so the selected profile loads when the app opens again.
- Added a clickable student profile image and welcome message that display a summary of the saved student details.
- Added local boy and girl voice recordings for every need tile in English and Finnish.
- Added `user_profile_setup.mp3` for the profile setup prompt.
- Added transparent tile-image versions so the Water, Food, Toilet, Tired, and Angry tile colours are clearly visible.
- Simplified the Electron menu bar by removing the **Edit** and **Window** menus while keeping **File** and **View**.

## Version 1.3.0 changes

Changes dated 25 October 2026:

- Open profile setup automatically when no saved student profile exists.
- Remove the Settings button; view and edit the saved profile through the student picture.
- Calculate the read-only age from the date of birth, including when an existing profile is reopened.
- Play the setup voice prompt only during initial profile setup; if autoplay is blocked, retry on the teacher's first interaction.
- Keep the message area hidden and Send to Teacher disabled, as requested by the lecturer.
- Preserve the team's updated tile images, alignment, and Water/Tired background colours.
