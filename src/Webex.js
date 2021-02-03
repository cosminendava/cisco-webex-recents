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
                            room.c__status = room.lastActivityDate > room.lastSeenActivityDate ? 'unread' : 'read';
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
                                        room.c__status = 'unread';
                                        let customEvent = {
                                            name: 'rooms:unread',
                                            room
                                        };
            
                                        console.log('Webex SDK', customEvent);
                                        
                                        LCC.sendMessage(customEvent);
                                    }
                                });
                            }
                        });
                    });

                    webex.memberships.listen().then(() => {
                        console.log('Webex SDK', 'listening to membership events');
                        webex.memberships.on('seen', (event) => {
                            if (event.data.personId === userInfo.id) {
                                webex.rooms.getWithReadStatus(event.data.roomId).then((room) => {
                                    console.log('Webex SDK', room);

                                    if (room.lastActivityDate <= room.lastSeenActivityDate) {
                                        room.c__status = 'read';
                                        let customEvent = {
                                            name: 'rooms:read',
                                            room
                                        };
            
                                        console.log('Webex SDK', customEvent);
                                        
                                        LCC.sendMessage(customEvent);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });

        LCC.addMessageHandler(async (message) => {
            console.log('Webex SDK', message);
        });
    }

    render() {
        return (
            <div>Webex SDK</div>
        );
    }
}

export default App;
