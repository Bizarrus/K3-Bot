You can determine the client versions yourself. All data is stored in the `client.json` file.

> [!NOTE]
> If the `client.json` file does not exist, an attempt is made to establish a connection to load the latest version. This is automatically saved in the `client.json`.

### Version `7.7.5`
```json
{
    "build":    "275395b049410a38e72188a5f4852b4b0774cf76",
    "version":  "7.7.5",
    "platform": "Web",
    "type":     "K3GraphQl",
    "browser": {
        "name":         "Firefox",
        "version":      132,
        "useragent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"
    },
    "urls": {
        "login":        "https://www.knuddels.de/logincheck.html",
        "graph":        "https://api-de.knuddels.de/mono/graphql",
        "subscription": "wss://api-de.knuddels.de/mono/subscriptions",
        "origin":       "https://app.knuddels.de",
        "referer":      "https://app.knuddels.de"
    }
}
```