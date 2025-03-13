
Once the client has been successfully connected, subscriptions can be registered:

```javascript
this.client.on('connected', () => {
    console.log('Successfully connected!');

    /* Register your Subscriptions here */
    this.client.addSubscription(new Notification, (data) => {
        console.log('Notification', data);
    });
});
```

The following notifications are received in the subscription:

[Quest](Quest.md)