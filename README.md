## Flashcards app 📚

A language-learning app inspired by [Quizlet](https://quizlet.com/en-gb), built with **Laravel** and **React**. Designed to assist users in learning and memorizing foreign languages through flashcard-based games and quizzes. Completely free and open source, it focuses on delivering an intuitive, customizable, and engaging experience.

|                                                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------|
| <img style="border-radius: .5rem" alt="Main page" src="./storage/app/public/screenshots/newReadMe/set-preview.png"/> |

### Table of content 👨‍

- [Key features](#key-features)
- [Tech Stack](#tech-stack)
- [Gallery](#gallery)
- [Installation](#installation)
- [Contribution](#contribution)

### Key Features

This app provides you wide opportunities to learn in more effective way foreign languages:

- **Custom Flashcards** - create personalized flashcards for any language.creating flexible tests based on your preferences,
- **Intelligent Learning Sets** - automatically generate learning sets based on user difficulties, focusing on problematic words from previous spelling or translation attempts.
- **Test Modes** - challenge yourself with translation quizzes, spelling tests, and more.
- **Game-Like Interface** - interactive design with animations and a smooth user experience.
- **Time-Based Challenges** - improve retention with timed exercises.
- **Phonetics Support** - Access phonetic transcriptions to improve pronunciation.

### Tech Stack

- **Backend**: Laravel v10.26.2, PHP v8.2.10
- **Frontend**: React v18.2.0, InertiaJS v1.0.0, TailwindCSS v3.0
- **Build Tools**: Vite v4.0.0

### Installation

1. Clone the repository:
    ```
   git clone https://github.com/kamilekrawczyk404/Flashcards.git
   ```
2. Install dependencies:
    ```
    npm install
    composer install
    ```
3. Set up the environment:
    ```
   cp .env.example .env
    php artisan key:generate
   ```
4. Run the development server:
    ```
    npm run dev
    php artisan serve
    ```

### Gallery


|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                                            
|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                                                                                                                                                                                         <img style="border-radius: .5rem" alt="Learn preparing" src="./storage/app/public/screenshots/newReadMe/learn-preparing-v2.png"/>  <img style="border-radius: .5rem" alt="Learn example" src="./storage/app/public/screenshots/newReadMe/learn-example.png"/>                                                                                                                                                                                         |
|                                                                                                                                                           <img style="border-radius: .5rem" alt="Test preparing" src="./storage/app/public/screenshots/newReadMe/test-preparing.png"/>                                                                     <img style="border-radius: .5rem" alt="Test example" src="./storage/app/public/screenshots/newReadMe/test-example.png"/>                                                                                                                                                           |
|
|                                                                                                                               <img style="border-radius: .5rem" alt="Explore sets" src="./storage/app/public/screenshots/newReadMe/explore.png"/>                                                                                                                                                   <img style="border-radius: .5rem" alt="Match" src="./storage/app/public/screenshots/newReadMe/match.png"/>                                                                                                                                |
|
|                                                                                                                                                                                                 <img style="border-radius: .5rem" alt="Creating set" src="./storage/app/public/screenshots/newReadMe/creating-set.png"/> <img style="border-radius: .5rem" alt="Account settings" src="./storage/app/public/screenshots/newReadMe/user.png"/>                                                                                                                                                                                                 |


### Contribution
Feel free to submit issues, create pull requests, or suggest new features!