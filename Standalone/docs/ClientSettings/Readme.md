
Once the client has been successfully connected, subscriptions can be registered:

```javascript
this.client.on('connected', () => {
    console.log('Successfully connected!');

    /* Register your Subscriptions here */
    this.client.addSubscription(new ClientSettings, (data) => {
        console.log('ClientSettings', data);
    });
});
```

The following data will be received in the subscription:
```json
ClientSettings {
  settings: {
    conversationListFilterType: 'ALL_MESSAGES',
    initialJoinBehavior: 'DISABLED',
    enabledSoundEvents: [
      'NewMessageReceived',
      'FriendRequestAccepted',
      'EngagementSystemApp',
      'VipApp',
      'Global',
      'LoyaltyApp'
    ],
    mentorBarExtended: false,
    contactListTabs: { tabs: [Array], __typename: 'ContactListTabs' },
    privateMessageReplyBehavior: 'MESSENGER',
    macroBoxQuickAccessEntries: [ [Object], [Object], [Object] ],
    macroBoxInteractionEntries: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
    ],
    macroBoxEnabled: true,
    channelListCategories: { categories: [Array], __typename: 'ChannelListCategories' },
    navIconSlot: null,
    __typename: 'ClientSettings'
  }
}
```