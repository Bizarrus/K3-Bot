## Constructor
```javascript
ClientProperties();
```

## Methods
```javascript
boolean ClientProperties.exists();
```
Check if the `client.json` exists.

```javascript
Promise ClientProperties.resolve();
```
Try to fetch and parse live data to create `client.json`.

```javascript
Object ClientProperties.get(String key);
```
Getting a Properties value.
### Examples
```
let example = ClientProperties.get('name');
```
```
let example = ClientProperties.get('name.subname');
```
```
let example = ClientProperties.get('name.subname.other');
```