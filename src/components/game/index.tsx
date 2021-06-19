import { FunctionalComponent, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

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
    if (round === settings.rounds) {
      setGameState(GAME_STATE.COMPLETED_ROUNDS);
      return;
    }
    setRound(round + 1);
  }

  return (
    <div class={s["game-container"]}>
      <h1 class={s.title}>Qur'an Quiz App</h1>
      {gameState === GAME_STATE.UNSTARTED && <button onClick={incrementRound}>Start Quiz</button>} 
      {gameState === GAME_STATE.IN_PROGRESS && currQuestion && (
        <Fragment>
          <p>Round: {round}</p>
          <p>Ayaah: {currQuestion && currQuestion.ayah.text}</p>
          <p>Answer: {currQuestion && currQuestion.answer.text}</p>
          <button onClick={incrementRound}>Next Ayah</button>
        </Fragment>
      )}
      {gameState === GAME_STATE.COMPLETED_EMPTY_BANK && <p>Game Over: No more Ayahs in the question bank</p>}
      {gameState === GAME_STATE.COMPLETED_ROUNDS && <p>Game Over!</p>}
    </div>
  )
}

export default Game;