// import logo from './logo.svg';
import './App.css';
import RecentsWidget from '@webex/widget-recents';
import '@webex/widget-recents/src/momentum.scss';

function App() {
  return (
    <div className="App">
      <RecentsWidget accessToken='ZDhmN2ZlNzEtYWRiNC00ZWViLTllYjEtN2FjZTdkZDAyZTlhNDQ4MDFiZjctZmM0_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f' />
    </div>
  );
}

export default App;
