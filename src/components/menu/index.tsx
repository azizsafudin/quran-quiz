import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
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

  const [progress, setProgress] = useState(0);
  
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [selectedSurahs, setSelectedSurahs] = useState(new Set());
  const [selectedLifelines, setSelectedLifelines] = useState(new Set());
  const [rounds, setRounds] = useState(1);

  const onSelectSurah = (key: string) => {
    const newSet = new Set(selectedSurahs);
    newSet.add(surahMap[key]);
    setSelectedSurahs(newSet);
    setProgress(progress >= 2 ? progress: 2);
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
    setProgress(progress >= 3 ? progress: 3);
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
        setProgress(progress >= 1 ? progress: 1);
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
        {progress > 0 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Surah</label>
            {renderSurahList()}
          </div>
        )}
        {progress > 1 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Lifelines</label>
            {renderLifelineList()}
          </div>
        )}
        {progress > 2 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>No. of Rounds</label>
            <Slider
              tipFormatter={(val: number): string => { return val === 0 ? "Unlimited Rounds ∞" : String(val)}}
              style={{ width: '100%' }}
              min={0}
              max={100}
              marks={{0: "∞", 5: "5", 25: "25", 50: "50", 100: "100" }}
              onChange={setRounds}
              value={rounds}
            />
          </div>
        )}
        {progress > 2 && (
          <div class={s["button-container"]}>
            <Button onClick={startQuiz} type="default" size="large" shape="round" disabled={!(selectedTranslation && selectedSurahs.size > 0)}>
              Start Quiz!
            </Button>
          </div>
        )}
    </div>
  )
}

export default Menu;