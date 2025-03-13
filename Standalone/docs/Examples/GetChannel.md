```javascript
/* Get a specific Channel */
this.client.getChannel('Flirt 3').then((channel) => {
    console.warn(channel);
}).catch((error) => {
    console.warn('Can\'t find Channel:', error);
});
```

## Output
```javascript
Channel {
  ID: '104',
  Name: 'Flirt',
  Topic: null,
  Style: {
    Image: 'https://cdnc.knuddelscom.de/cdn-cgi/image/width=120/pics/k3_flirt_bg_v2.jpg',
    Color: [ 13, 27, 35, 255 ]
  },
  Subchanels: [
    Channel {
      ID: '104:1',
      Name: 'Flirt',
      // [...]
    },
    Channel {
      ID: '104:2',
      Name: 'Flirt 2',
      // [...]
    },
    Channel {
      ID: '104:3',
      Name: 'Flirt 3',
      // [...]
    }
  ]
}
```