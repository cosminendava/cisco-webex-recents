import React, { Component } from 'react';
// import { init as initWebex } from 'webex';
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
        const webex = (window.webex = window.Webex.init({
            credentials: {
                access_token: this.state.accessToken
            }
        }));

        webex.once('ready', () => {
            if (webex.canAuthorize) {
                webex.messages.listen().then(() => {
                    console.log('listening to message events');
                    webex.messages.on('created', (event) => {
                        let customData = {};
                        Promise.all([
                            webex.rooms.get(event.data.roomId),
                            webex.people.get(event.data.personId)
                        ]).then((results) => {
                            customData.room = results[0];
                            customData.person = results[1];

                            event.customData = customData;
                            console.log('React', event);
                            
                            LCC.sendMessage({
                                event
                            });
                        });
                    });
                });

                webex.memberships.listen().then(() => {
                    console.log('listening to membership events');
                    webex.memberships.on('seen', (event) => {
                        console.log(event);

                        LCC.sendMessage({
                            event
                        });
                    });
                });
            }
        });

        LCC.addMessageHandler((message) => {
            console.log(message);
            console.log(JSON.stringify(message));
        });
    }

    render() {
        return (
            <div>Webex SDK</div>
        );
    }
}

export default App;
