import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from '../routes/home';
import Quiz from '../routes/quiz';
import NotFoundPage from '../routes/notfound';

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Router>
        <Route path="/" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <NotFoundPage default />
      </Router>
    </div>
  );
};

export default App;
