import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Select, Button, Spin } from 'antd';
import { getEdition, getLanguages, getQuran } from '../../api/quran';
import Menu from "../../components/menu";

import s from './style.css';

const Quiz: FunctionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [languageList, setLanguageList] = useState([]);
  const [translationList, setTranslationList] = useState([]);
  const [quran, setQuran] = useState({});
  const [translation, setTranslation] = useState({});

  const lifelines = {
    getbefore: "Get the ayah before",
    getafter: "Get the ayah after",
    getsurahenglish: "Get the English translation of the name of the surah the ayah is from",
    getsuraharabic: "Get the Arabic name of the surah the ayah is from",
    getjuz: "Get which Juz the ayah is from",
    getrandomword: "Get a random Arabic word from the ayah",
    getlocation: "Get ayah is Meccan and Medinan",
    getnumber: "Get the number of the ayah in the surah"
  };

  const init = async (): Promise<void> => {
    const quranData = await getQuran();
    setQuran(quranData);

    const languageData = await getLanguages();
    setLanguageList(languageData);

    const editionData = await getEdition();
    setTranslationList(editionData);

    setIsLoading(false);
  }

  useEffect(()=> {
    init();
  }, []);

  const onSelectLanguage = async (lang: string): Promise<void> => {
    const editionData = await getEdition("text", lang, "translation");
    setTranslationList(editionData);
  }

  const getTranslations = async (id: string): Promise<void> => {
    const translationData = await getQuran(id);
    setTranslation(translationData);
  }

  const onStartQuiz = (settings: Record<string, any>) => {
    console.log(settings)
    getTranslations(settings.translation);
  }

  return (
    <div class={s["quiz-container"]}>
      {isLoading
        ? 
        <Spin size="large" />
        :
        <Menu
          quran={quran}
          languageList={languageList}
          translationList={translationList} 
          onSelectLanguage={onSelectLanguage}
          onStartQuiz={onStartQuiz}
          lifelines={lifelines}
        />
      }
    </div>
  );
};

export default Quiz;
