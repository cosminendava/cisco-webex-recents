import React, {Component} from 'react';
import './Space.css';
import SpaceWidget, {destinationTypes} from '@webex/widget-space';
import '@webex/widget-space/src/momentum.scss';
import qs from 'querystring';
import LCC from 'lightning-container';

class App extends Component {
  constructor(props) {
    super(props);

    const searchString = this.props.location.search.replace('?', '');
    const searchParams = qs.parse(searchString);
    this.state = {
      accessToken: searchParams.accessToken,
      destinationType: destinationTypes.SPACEID,
      destinationId: searchParams.destinationId,
      activities: {
        files: false,
        meet: false,
        message: true,
        people: true
      },
      initialActivity: 'message'
    };

    LCC.addMessageHandler(this.messageHandler.bind(this));
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="Space">
        <SpaceWidget accessToken={this.state.accessToken} destinationType={this.state.destinationType} destinationId={this.state.destinationId} activities={this.state.activities} initialActivity={this.state.initialActivity} onEvent={this.callback}/>
      </div>
    );
  }

  callback(name, detail) {
    LCC.sendMessage({
      name,
      detail
    });
  }

  messageHandler(message) {
  }
}

export default App;
