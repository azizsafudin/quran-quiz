import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

import s from './style.css';

const Home: FunctionalComponent = () => {
  return (
    <div class={s.home}>
      <div class={s.container}>
        <h1 class={s.title}>Qur'an Quiz App</h1>
        <p class={s.subtitle}>Challenge your Quranic understanding and memorisation!</p>
        <Link href="/quiz">
          <button class={s["start-button"]} type="button">Start Quiz!</button>
        </Link>
      </div>      
    </div>
  );
};

export default Home;
