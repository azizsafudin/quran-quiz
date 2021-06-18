import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Select, Button, Spin } from 'antd';
import { getEdition, getQuran } from '../../api/quran';

import s from './style.css';

const Quiz: FunctionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [translationList, setTranslationList] = useState([]);
  const [quran, setQuran] = useState({});
  const [surahMap, setSurahMap] = useState({})


  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [translation, setTranslation] = useState({});
  const [selectedSurahs, setSelectedSurahs] = useState(new Set());

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
    setSelectedTranslation(id);
    const translationData = await getQuran(id);
    setTranslation(translationData);
  }

  const onSelectSurah = (key: string) => {
    const newSet = new Set(selectedSurahs);
    newSet.add(surahMap[key]);
    setSelectedSurahs(newSet);
  }

  const onDeselectSurah = (key: string) => {
    const newSet = new Set(selectedSurahs);
    newSet.delete(surahMap[key]);
    setSelectedSurahs(newSet);
  }

  const onStartQuiz = () => {

  }

  const renderTranslationList = (): JSX.Element => (
    <Select
      showSearch
      size="large"
      style={{ width: '100%' }}
      showArrow={true}
      placeholder="Select a translation to use"
      onSelect={onSelectTranslation}
    >
      {translationList.map(({ identifier, englishName }) => (
        <Select.Option 
          key={identifier} 
          value={identifier}
        >
          {englishName}
        </Select.Option>
      ))}
    </Select>
  );

  const renderSurahList = () => (
    <Select
      mode="multiple"
      size="large"
      style={{ width: '100%' }}
      showArrow={true}
      placeholder="Select your Surahs to be quizzed on"
      onSelect={onSelectSurah}
      onDeselect={onDeselectSurah}
    >
      {quran.surahs.map(({ number, englishName, englishNameTranslation, name }) => (
          <Select.Option 
            key={number}
            value={`${englishName} - ${englishNameTranslation} - ${name}`}
          >
            {englishName} - {englishNameTranslation} - {name}
          </Select.Option>
        ))}
    </Select>
  )

  return (
    <div class={s["quiz-container"]}>
      {isLoading
        ? 
        <Spin size="large" />
        :
        <Fragment>
          <h1 class={s.title}>Qur'an Quiz App</h1>
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Translation</label>
            {renderTranslationList()}
          </div>
          {selectedTranslation && (
            <div class={s["form-row"]}>
              <label class={s["form-label"]}>Surah</label>
              {renderSurahList()}
            </div>
          )}
          {selectedTranslation && selectedSurahs.size > 0 && (
            <div class={s["button-container"]}>
              <Button onClick={onStartQuiz} type="default" size="large" shape="round">
                Start Quiz!
              </Button>
            </div>
          )}
        </Fragment>
      }
    </div>
  );
};

export default Quiz;
