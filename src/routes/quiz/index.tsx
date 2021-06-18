import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getEdition } from '../../api/quran';
import s from './style.css';

const Quiz: FunctionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [edition, setEdition] = useState({});

  useEffect(()=> {
    const init = async (): Promise<Record<string, any>> => {
      const data = await getEdition();
      console.log(data)
      setEdition(data);
      setIsLoading(false);
      return data;
    }
    init();
  }, []);


  return (
    <div class={s.home}>
      {isLoading ? <p>Loading</p> : <p>{JSON.stringify(edition)}</p>}
      
    </div>
  );
};

export default Quiz;
