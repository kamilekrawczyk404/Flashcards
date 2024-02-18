export default class TranslationsData {
  getAudioPath(translation, type) {
    switch (type) {
      case "term":
        return translation.term.hasOwnProperty("phonetics")
          ? translation.term?.phonetics?.filter((element) =>
              element.audio.includes(".mp3"),
            )[0]?.audio
          : "";

      case "definition":
        return translation.definition.hasOwnProperty("phonetics")
          ? translation.definition?.phonetics.filter((element) =>
              element.audio.includes(".mp3"),
            )[0]?.audio
          : "";
      default:
        break;
    }
  }

  getPhonetics(translation, type) {
    switch (type) {
      case "term":
        return translation.term.hasOwnProperty("phonetics")
          ? translation.term.phonetics[0].text
          : "";
      case "definition":
        return translation.definition.hasOwnProperty("phonetics")
          ? translation.definition.phonetics[0].text
          : "";
      default:
        return;
    }
  }

  getData(translation) {
    return {
      term: {
        word: translation.term.word,
        language: translation.term.language,
        phonetics: this.getPhonetics(translation, "term"),
        audioPath: this.getAudioPath(translation, "term"),
      },
      definition: {
        word: translation.definition.word,
        language: translation.definition.language,
        phonetics: this.getPhonetics(translation, "definition"),
        audioPath: this.getAudioPath(translation, "definition"),
      },
    };
  }

  constructor(translation) {
    console.log(translation);
    const data = this.getData(translation);

    this.id = translation.id;
    this.term = data.term;
    this.definition = data.definition;
    this.isFavourite = translation.isFavourite;
    this.status = translation.status;

    if (translation.hasOwnProperty("answers"))
      this.answers = translation.answers;
  }
}