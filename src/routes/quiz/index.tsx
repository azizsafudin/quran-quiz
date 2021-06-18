import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import s from './style.css';

const Quiz: FunctionalComponent = () => {
  useEffect(()=>{

  })
  return (
    <div class={s.home}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
    </div>
  );
};

export default Quiz;
