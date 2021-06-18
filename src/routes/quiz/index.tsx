import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Select, Button, Spin } from 'antd';
import { getEdition, getQuran } from '../../api/quran';
import Menu from "../../components/menu";

import s from './style.css';

const Quiz: FunctionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [translationList, setTranslationList] = useState([]);
  const [quran, setQuran] = useState({});
  const [surahMap, setSurahMap] = useState({})
  const [translation, setTranslation] = useState({});

  const lifelines = {
    getsurahenglish: "Get the translation of the surah the ayah is from.",
    getsuraharabic: "Get the Arabic name of the surah the ayah is from.",
    getbefore: "Get the ayah before.",
    getafter: "Get the ayah after.",
    getjuz: "Get which Juz the ayah is from.",
    getrandomword: "Get a random Arabic word from the ayah.",
    getlocation: "Get ayah is Meccan and Medinan.",
    getnumber: "Get the number of the ayah in the surah."
  };

  const init = async (): Promise<void> => {
    const editionData = await getEdition();
    const quranData = await getQuran();
    setTranslationList(editionData);
    setQuran(quranData);
    const newSurahMap = {};
    quranData.surahs.forEach(({ 
      number, 
      englishName, 
      englishNameTranslation, 
      name 
    }) => {
      newSurahMap[`${englishName} - ${englishNameTranslation} - ${name}`] = number;
    })
    setSurahMap(newSurahMap);
    setIsLoading(false);
  }

  useEffect(()=> {
    init();
  }, []);

  const onSelectTranslation = async (id: string): Promise<void> => {
    const translationData = await getQuran(id);
    setTranslation(translationData);
  }

  const onStartQuiz = (settings: Record<string, any>) => {
    console.log(settings)
  }

  return (
    <div class={s["quiz-container"]}>
      {isLoading
        ? 
        <Spin size="large" />
        :
        <Menu
          quran={quran} 
          translationList={translationList} 
          surahMap={surahMap}
          onSelectTranslation={onSelectTranslation}
          onStartQuiz={onStartQuiz}
          lifelines={lifelines}
        />
      }
    </div>
  );
};

export default Quiz;
