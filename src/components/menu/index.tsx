import { FunctionalComponent, Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Select, Slider, Button } from 'antd';

import s from './style.css';

type Props = {
  quran: any;
  translationList: Record<string, any>[];
  surahMap: Record<string, any>;
  lifelines: Record<string, any>;
  onSelectTranslation: (id: string) => void;
  onStartQuiz: (settings: Record<string, any>) => void;
}

const Menu = (props: Props) => {
  const { 
    quran,
    surahMap,
    lifelines,
    translationList,
    onSelectTranslation,
    onStartQuiz
  } = props;
  
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [selectedSurahs, setSelectedSurahs] = useState(new Set());
  const [selectedLifelines, setSelectedLifelines] = useState(new Set());

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

  const onSelectLifeline = (key: string) => {
    const newSet = new Set(selectedLifelines);
    newSet.add(key);
    setSelectedLifelines(newSet);
  }

  const onDeselectLifeline = (key: string) => {
    const newSet = new Set(selectedLifelines);
    newSet.delete(surahMap[key]);
    setSelectedLifelines(newSet);
  }

  const renderTranslationList = (): JSX.Element => (
    <Select
      showSearch
      size="large"
      style={{ width: '100%' }}
      showArrow={true}
      placeholder="Select a translation to use"
      onSelect={id => {
        onSelectTranslation(id)
        setSelectedTranslation(id);
      }}
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

  const renderLifelineList = () => {
    return (
      <Select
        mode="multiple"
        size="large"
        style={{ width: '100%' }}
        showArrow={true}
        placeholder="Select Lifelines"
        onSelect={onSelectLifeline}
        onDeselect={onDeselectLifeline}
      >
        {Object.entries(lifelines).map(([key, value]) => (
          <Select.Option 
            key={key}
            value={key}
          >
            {value}
          </Select.Option>
        ))}
      </Select>
    )
  }

  const startQuiz = () => {
    const pref = {
      translation: selectedTranslation,
      surahs: selectedSurahs,
      lifelines: selectedLifelines
    };
    onStartQuiz(pref);
  }

  return (
    <div class={s["menu-container"]}>
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
          <Fragment>
            <div class={s["form-row"]}>
              <label class={s["form-label"]}>Lifelines</label>
              {renderLifelineList()}
            </div>
            <div class={s["button-container"]}>
              <Button onClick={startQuiz} type="default" size="large" shape="round">
                Start Quiz!
              </Button>
            </div>
          </Fragment>
        )}
    </div>
  )
}

export default Menu;