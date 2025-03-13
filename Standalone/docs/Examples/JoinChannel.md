```javascript
/* Get a specific Channel */
this.client.getChannel('Flirt 3').then((channel) => {
    /* Register event to read messages */
    channel.on('message', (message) => {
        console.log(message);
    });

    /* Join the Channel */
    channel.join().then(() => {
        console.log('Joining complete,...');

        // Info: If you want Channel-Users without join into a channel, see <client>.getUsers(channel);
        console.log('Users:', channel.getUsers()); 

        // Send a public message into the channel
        channel.sendMessage('Hello World!');
    }).catch((error) => {
        console.error('Can\'t join channel:', error);
    });

    // or with Channel-Password:
    // channel.join('cHaNNelPa$$woRd');

}).catch((error) => {
    console.warn('Can\'t find Channel:', error);
});
```