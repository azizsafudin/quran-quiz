import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Button } from 'antd';


import { getRandomInt } from '../../util/main';

import s from './style.css';

type Props = {
  quran: Record<string, any>;
  translation: Record<string, any>;
  settings: Record<string, any>;
}

const GAME_STATE = Object.freeze({ 
  UNSTARTED: 1, 
  IN_PROGRESS: 2, 
  COMPLETED_ROUNDS: 3,
  COMPLETED_EMPTY_BANK: 4
})

const Game = (props: Props) => {
  const { 
    quran,
    translation,
    settings
  } = props;

  const [questionBank, setQuestionBank] = useState({});
  const [currQuestion, setCurrQuestion] = useState(null);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATE.UNSTARTED);

  useEffect(() => {
    const { surahs } = settings;
    const selectedSurahs = {}
    surahs.forEach(key => selectedSurahs[key] = translation.surahs[key]);
    setQuestionBank(selectedSurahs);
  }, [settings]);

  const getAyahFromQuran = (surah: number, ayah: number) => {
    return quran.surahs[surah].ayahs[ayah];
  }

  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      const surahArray = Object.keys(questionBank);
      if (surahArray.length === 0) {
        setGameState(GAME_STATE.COMPLETED_EMPTY_BANK);
        return;
      }

      const surahKey = surahArray[getRandomInt(0, surahArray.length)];
      const currSurah = questionBank[surahKey];

      const ayahKey = getRandomInt(0, currSurah.ayahs.length);
      const currAyah = currSurah.ayahs[ayahKey];

      const nextQuestion = { 
        surahKey, 
        ayahKey,
        surah: currSurah, 
        ayah: currAyah,
        answer: getAyahFromQuran(surahKey, ayahKey)
      }
      
      // After using the question, remove from the question bank.
      questionBank[surahKey].ayahs.splice(ayahKey, 1)
      if (questionBank[surahKey].ayahs.lengths === 0) {
        delete questionBank[surahKey]
      }
      
      setCurrQuestion(nextQuestion)
    }
  }, [round])

  const incrementRound = () => {
    if (round === 0) setGameState(GAME_STATE.IN_PROGRESS);
    if (round === settings.rounds && settings.rounds !== 0) {
      setGameState(GAME_STATE.COMPLETED_ROUNDS);
      return;
    }
    setRound(round + 1);
  }

  return (
    <div class={s["main-container"]}>
      <h1 class={s.title}>Qur'an Quiz App</h1>
      <div class={s["game-container"]}>
        {gameState === GAME_STATE.UNSTARTED && (
          <Button type="default" size="large" shape="round"onClick={incrementRound}>Begin Quiz</Button>
        )} 
        {gameState === GAME_STATE.IN_PROGRESS && currQuestion && (
          <Fragment>
            <div>
              <span class={s["main-text"]}>{round} out of {settings.rounds === 0 ? "∞" : settings.rounds} </span>
            </div>
            <div class={s["item-row"]}>
              <span class={s["content-text"]}>
                "{currQuestion && currQuestion.ayah.text}""
              </span>
            </div>
            <div class={s["item-row"]}>
              <span class={s["arabic-text"]}>
                {currQuestion && currQuestion.answer.text}
              </span>
            </div>
            <div class={s["item-row"]}>
              <Button type="default" size="large" shape="round" onClick={incrementRound}>Next Ayah</Button>
            </div>
          </Fragment>
        )}
        {gameState === GAME_STATE.COMPLETED_EMPTY_BANK && <p>Game Over: No more Ayahs in the question bank</p>}
        {gameState === GAME_STATE.COMPLETED_ROUNDS && <p>Game Over!</p>}
      </div>
    </div>
  )
}

export default Game;