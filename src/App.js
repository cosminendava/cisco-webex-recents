import React, {Component} from 'react';
import './App.css';
import RecentsWidget from '@webex/widget-recents';
import '@webex/widget-recents/src/momentum.scss';
import qs from 'querystring';
import LCC from 'lightning-container';

class App extends Component {
  constructor(props) {
    super(props);

    const searchString = this.props.location.search.replace('?', '');
    const searchParams = qs.parse(searchString);
    this.state = {
      accessToken: searchParams.accessToken
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <RecentsWidget accessToken={this.state.accessToken} onEvent={this.callback}/>
      </div>
    );
  }

  callback(name, detail) {
    console.log('React', name);
    console.log('React', detail);

    LCC.sendMessage({
      name,
      detail
    });
  }
}

export default App;
