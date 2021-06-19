import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Select, Slider, Button } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import { getLanguages, getEdition } from '../../api/quran';

import s from './style.css';

type Props = {
  quran: any;
  lifelines: Record<string, any>;
  onStartQuiz: (settings: Record<string, any>) => void;
}

const Menu = (props: Props) => {
  const { 
    quran,
    lifelines,
    onStartQuiz
  } = props;

  const [progress, setProgress] = useState(1);

  const [languageList, setLanguageList] = useState([]);
  const [translationList, setTranslationList] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [selectedSurahs, setSelectedSurahs] = useState(new Set());
  const [selectedLifelines, setSelectedLifelines] = useState(new Set());
  const [rounds, setRounds] = useState(5);

  useEffect(() => { 
    const init = async (): Promise<void> => {
      const languageData = await getLanguages();
      setLanguageList(languageData);
      const editionData = await getEdition("text", selectedLanguage, "translation");
      setTranslationList(editionData);
    }
    init()
  }, []);

  const handleLanguageChange = async (lang: string): void => {
    setSelectedTranslation("")
    const editionData = await getEdition("text", lang, "translation");
    setTranslationList(editionData);
    setSelectedLanguage(lang);
    setProgress(progress >= 1 ? progress: 1);
  }

  const handleTranslationChange = (id: string): void => {
    setSelectedTranslation(id);
    setProgress(progress >= 2 ? progress: 2);
  }

  const onSelectSurah = (key: number) => {
    const newSet = new Set(selectedSurahs);
    newSet.add(key-1);
    setSelectedSurahs(newSet);
    setProgress(progress >= 3 ? progress: 3);
  }

  const onDeselectSurah = (key: number) => {
    const newSet = new Set(selectedSurahs);
    newSet.delete(key-1);
    setSelectedSurahs(newSet);
  }

  const onSelectLifeline = (key: string) => {
    const newSet = new Set(selectedLifelines);
    newSet.add(key);
    setSelectedLifelines(newSet);
    setProgress(progress >= 4 ? progress: 4);
  }

  const onDeselectLifeline = (key: string) => {
    const newSet = new Set(selectedLifelines);
    newSet.delete(key);
    setSelectedLifelines(newSet);
  }

  const startQuiz = () => {
    const pref = {
      language: selectedLanguage,
      translation: selectedTranslation,
      surahs: selectedSurahs,
      lifelines: selectedLifelines,
      rounds
    };
    onStartQuiz(pref);
  }

  return (
    <div class={s["menu-container"]}>
      <h1 class={s.title}>Qur'an Quiz App</h1>
        <div class={s["form-row"]}>
          <label class={s["form-label"]}>Language</label>
          <Select
            key={selectedLanguage}
            defaultValue={selectedLanguage}
            size="large"
            style={{ width: '100%' }}
            showArrow={true}
            placeholder="Select a language"
            onSelect={handleLanguageChange}
          >
            {languageList.map((val) => (
              <Select.Option 
                key={val} 
                value={val}
              >
                {val}
              </Select.Option>
            ))}
          </Select>
        </div>
        {progress > 0 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Translation</label>
            <Select
              key={selectedTranslation}
              defaultValue={selectedTranslation}
              showSearch={translationList.length > 10}
              size="large"
              style={{ width: '100%' }}
              showArrow={true}
              placeholder="Select a translation to use"
              onSelect={handleTranslationChange}
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
          </div>
        )}
        {progress > 1 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Surah</label>
            <Select
              mode="multiple"
              size="large"
              style={{ width: '100%' }}
              showArrow={true}
              placeholder="Select your Surahs to be quizzed on"
              onSelect={onSelectSurah}
              onDeselect={onDeselectSurah}
              filterOption={(val, opt) => opt.children.toLowerCase().includes(val)}
            >
              {quran.surahs.map(({ number, englishName, englishNameTranslation, name }) => (
                  <Select.Option 
                    key={number}
                    value={number}
                  >
                    {`${englishName} - ${englishNameTranslation} - ${name}`}
                  </Select.Option>
                ))}
            </Select>
          </div>
        )}
        {progress > 2 && (
          <div class={s["form-row"]}>
            <label class={s["form-label"]}>Lifelines</label>
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
              Continue <DoubleRightOutlined />
            </Button>
          </div>
        )}
    </div>
  )
}

export default Menu;