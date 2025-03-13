```javascript
/* Fetch all Channels */
this.client.getChannels().then((channels) => {
    console.warn(channels);
});
```

## Output
```json
{
    "id":       120,
    "name":     "Psssst",
    "style":    {
        "image":    "",
        "color":    "10,10,100,255", // RGBA-Color: <r>,<g>,<b>,<a>
        "topic":    "Example"
    },
    "channels": [
        { "id": "120:1", "name": "Psssst" },
        { "id": "120:2", "name": "Psssst 2" },
        { "id": "120:2", "name": "Psssst 3" }
    ]
}
```