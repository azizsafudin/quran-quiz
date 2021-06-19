import { Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Button } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

import { getRandomInt } from '../../util/main';

import s from './style.css';

// type Props = {
//   quran: Record<string, any>;
//   translation: Record<string, any>;
//   settings: Record<string, any>;
//   onResetQuiz: () => void;
// }

const GAME_STATE = Object.freeze({ 
  UNSTARTED: 1, 
  IN_PROGRESS: 2, 
  COMPLETED_ROUNDS: 3,
  COMPLETED_EMPTY_BANK: 4
})

const Game = (props) => {
  const { 
    quran,
    translation,
    settings,
    onResetQuiz
  } = props;

  const [questionBank, setQuestionBank] = useState({});
  const [currQuestion, setCurrQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATE.UNSTARTED);

  useEffect(() => {
    const { surahs } = settings;
    const selectedSurahs = {}
    surahs.forEach(key => selectedSurahs[key] = translation.surahs[key]);
    setQuestionBank(selectedSurahs);
  }, [settings]);

  const getAyahFromQuran = (
    surah, 
    ayah, 
    numberInSurah
  ) => {
    let candidateAyah = quran.surahs[surah].ayahs[ayah];
    if (candidateAyah.numberInSurah !== numberInSurah) {
      candidateAyah = quran.surahs[surah].ayahs.find(ay => ay.numberInSurah === numberInSurah)
    }
    return candidateAyah;
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

      const answer = getAyahFromQuran(Number(surahKey), ayahKey, currAyah.numberInSurah);

      const nextQuestion = { 
        surahKey, 
        ayahKey,
        surah: currSurah, 
        ayah: currAyah,
        answer: {
          ...answer, 
          surah: 
          {
            englishName: currSurah.englishName,
            englishNameTranslation: currSurah.englishNameTranslation,
            name: currSurah.name,
          } 
        }
      }
      
      // After using the question, remove from the question bank.
      questionBank[surahKey].ayahs.splice(ayahKey, 1)
      if (questionBank[surahKey].ayahs.length === 0) {
        delete questionBank[surahKey]
      }
      
      setCurrQuestion(nextQuestion)
    }
  }, [round])

  const nextRound = () => {
    setShowAnswer(false);
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
          <Button type="default" size="large" shape="round"onClick={nextRound}>Begin Quiz</Button>
        )} 
        {gameState === GAME_STATE.IN_PROGRESS && currQuestion && (
          <Fragment>
            <div>
              <span class={s["main-text"]}>{round} out of {settings.rounds === 0 ? "∞" : settings.rounds} </span>
            </div>
            <span class={s["translation-text"]}>
                "{currQuestion && currQuestion.ayah.text}"
              </span>
            {showAnswer && currQuestion && (
              <div class={s.answer}>
                <span class={s["arabic-text"]}>
                  {currQuestion.answer.text}
                </span>
                <div class={s["more-info-container"]}>
                  <span class={s["more-info-text"]} >
                    Surah: {`${currQuestion.answer.surah.englishName} - ${currQuestion.answer.surah.englishNameTranslation} - ${currQuestion.answer.surah.name}`}
                  </span>
                  <span class={s["more-info-text"]} >
                    Ayah: {currQuestion.answer.numberInSurah}
                  </span>
                  <span class={s["more-info-text"]} >
                    Juz: {currQuestion.answer.juz}
                  </span>
                </div>
              </div>
            )}
            <div class={s["button-container"]}>
              {!showAnswer ? 
                <Button type="default" size="large" shape="round" onClick={() => setShowAnswer(true)}>Reveal Answer</Button>
                :
                <Button type="default" size="large" shape="round" onClick={nextRound}>
                  Next Ayah <DoubleRightOutlined />
                </Button>
              }
            </div>           
          </Fragment>
        )}
        {gameState === GAME_STATE.COMPLETED_EMPTY_BANK && (
          <div class={s.gameover}>
            <span class={s["gameover-text"]}>Quiz Over!</span>
            <span class={s["gameover-text"]}>No more Ayahs in the question bank.</span>
            <Button type="default" size="large" shape="round" onClick={onResetQuiz}>
              Play Again?
            </Button>
          </div>
        )}
        {gameState === GAME_STATE.COMPLETED_ROUNDS && (
          <div class={s.gameover}>
            <span class={s["gameover-text"]}>Game Over!</span>
            <Button type="default" size="large" shape="round" onClick={onResetQuiz}>
              Play Again?
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game;