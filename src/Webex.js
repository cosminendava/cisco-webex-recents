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
                webex.people.get('me').then((userInfo) => {
                    console.log('Webex SDK', userInfo);

                    webex.rooms.listWithReadStatus().then((response) => {
                        let rooms = response.items;

                        for (let room of rooms) {
                            room.status = room.lastActivityDate > room.lastSeenActivityDate ? 'unread' : 'read';
                        }

                        
                        console.log('Webex SDK', rooms);

                        LCC.sendMessage({
                            name: 'rooms:listWithReadStatus',
                            items: rooms
                        });
                    })

                    webex.messages.listen().then(() => {
                        console.log('Webex SDK', 'listening to message events');
                        webex.messages.on('created', (event) => {
                            if (event.data.personId !== userInfo.id) {
                                webex.rooms.getWithReadStatus(event.data.roomId).then((room) => {
                                    console.log('Webex SDK', room);

                                    if (room.lastActivityDate > room.lastSeenActivityDate) {
                                        let customEvent = {
                                            name: 'rooms:unread',
                                            roomId: event.data.roomId
                                        };
            
                                        console.log('Webex SDK', customEvent);
                                        
                                        LCC.sendMessage(customEvent);
                                    }
                                });
                            }

                            // let customData = {};
                            
                            // Promise.all([
                            //     webex.rooms.get(event.data.roomId),
                            //     webex.people.get(event.data.personId)
                            // ]).then((results) => {
                            //     customData.room = results[0];
                            //     customData.person = results[1];

                            //     event.customData = customData;
                            //     console.log('Webex SDK', event);
                                
                            //     LCC.sendMessage({
                            //         event
                            //     });
                            // });
                        });
                    });

                    webex.memberships.listen().then(() => {
                        console.log('Webex SDK', 'listening to membership events');
                        webex.memberships.on('seen', (event) => {
                            if (event.data.personId === userInfo.id) {
                                let customEvent = {
                                    name: 'rooms:read',
                                    roomId: event.data.roomId
                                };

                                console.log('Webex SDK', customEvent);
                                
                                LCC.sendMessage(customEvent);
                            }
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
