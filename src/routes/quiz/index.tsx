import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Spin } from 'antd';
import { getLanguages, getQuran } from '../../api/quran';
import Menu from "../../components/menu";
import Game from "../../components/game";

import s from './style.css';

export const lifelines = {
  getbefore: "Get the ayah before",
  getafter: "Get the ayah after",
  getsurahenglish: "Get the English translation of the name of the surah the ayah is from",
  getsuraharabic: "Get the Arabic name of the surah the ayah is from",
  getjuz: "Get which Juz the ayah is from",
  getrandomword: "Get a random Arabic word from the ayah",
  getlocation: "Get ayah is Meccan and Medinan",
  getnumber: "Get the number of the ayah in the surah"
};

const Quiz: FunctionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [quran, setQuran] = useState({});
  const [translation, setTranslation] = useState({});
  const [settings, setSettings] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const init = async (): Promise<void> => {
    const quranData = await getQuran();
    setQuran(quranData);

    setIsLoading(false);
  }

  useEffect(()=> {
    init();
  }, []);

  const getTranslations = async (id: string): Promise<void> => {
    const translationData = await getQuran(id);
    setTranslation(translationData);
  }

  const onStartQuiz = async (settings: Record<string, any>) => {
    await getTranslations(settings.translation);
    setSettings(settings);
    setIsGameStarted(true);
  }

  const ActivePanel = () => {
    return isGameStarted 
      ? <Game quran={quran} translation={translation} settings={settings} />
      : <Menu
          quran={quran}
          onStartQuiz={onStartQuiz}
          lifelines={lifelines}
        />  
  }

  return (
    <div class={s["quiz-container"]}>
      {isLoading
        ? 
        <div class={s.spinner}>
          <Spin size="large" />
        </div>
        :
        <ActivePanel />
      }
    </div>
  );
};

export default Quiz;
