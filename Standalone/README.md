# K3-Bot

> [!WARNING]
> Since **August 2025**, Knuddels.de seems to be engaging in a kind of “catching.”
> IP addresses that are known to be used **only** by bots are either responded to with a “nickname does not exist” message (authentication process) or simply forwarded to a “fake server” that only returns junk responses (i.e., no real data).
>
> If this phenomenon occurs, the IP address must be changed. If the bots are running on a server with a static IPv4 address, it is best to simply ask another use and/or the provider to reassign a different IP address.

# Features
- [x] Automatic response to ping-Events
- [x] Subscriptionable Events
- [x] Automatic Session-Renewing
- [x] Automatic Keep-Online Events
- [x] Full `GraphQL` fragments, querys, enums, subscriptions & mutations (See [Protocol](./Protocol/))

# Implemented Subscriptions
- [ ] ChannelEvents
- [ ] AppEvents
- [ ] ClientSettings
- [ ] Notification
- [ ] SystemEvents
- [ ] MentorEvents
- [ ] HasKnuddelsPlusChanged
- [ ] TanSystemSubscription
- [ ] SmileyboxChanged
- [ ] PromotionEvents
- [ ] FriendRequestEvents
- [ ] FriendStateChangedEvent
- [ ] ContactListChanged (Friends, Watchlist, Fotomeet)
- [ ] PaymentSubscription
- [ ] FriendRecommendationSubscription
- [ ] CanSendImagesChanged
- [ ] MessengerSubscription
- [ ] happyMomentEvents
- [ ] UserKnuddelUpdated
- [ ] OwnProfilePictureChanged
- [ ] OwnProfilePictureOverlaysChanged
- [ ] EvergreenDataChanged
- [ ] profileVisitEvents
- [ ] MultipleUserOnlineUpdated
- [x] AdFreeAcquired (Ignoring Ads)

# Implemented Bots
- [x] StayOnline (sends each 4 Minutes a random Text)
- [x] DailyLogin (automatically collects the daily login)
- [ ] QuestSolver (automatically solve quests)
