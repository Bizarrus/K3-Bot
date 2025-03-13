## Constructor
```javascript
AuthSession(JSON {
    expiry: int,
    token:  String
});
```

## Methods
```javascript
String getToken();
```
```javascript
boolean isExpired();
```
```javascript
void update(JSON {
    expiry: int,
    token:  String
});
```
```javascript
void check();
```
```javascript
JSON toJSON();
```

## Events
```javascript
void on('expired', (state) => {

});
```