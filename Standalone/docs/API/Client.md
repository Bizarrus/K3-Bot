## Constructor
```javascript
Client(Instance core);
```

## Methods
```javascript
connect();
```
```javascript
login([boolean force]);
```
```javascript
AuthSession getSession();
```
```javascript
refreshSession(String token);
```
```javascript
addSubscription(clazz, callback);
```
```javascript
checkClientProperties();
```

## Events
```javascript
void on('connect', (data) => {

});
```
```javascript
void on('connected', (data) => {

});
```
```javascript
void on('auth', (data) => {

});
```
```javascript
void on('request', (data) => {

});
```
```javascript
void on('response', (data) => {

});
```
