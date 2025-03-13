## Methods
```javascript
boolean Config.exists();
```
Check if the `config.json` exists.

```javascript
Object Config.get(String key, [Object defaults]);
```
Getting a Properties value.

If the parameter `defaults` is set (`optional`), then the value is returned if the `key` was not found, otherwise `null`.

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

```
UserCredentials getUser(int index);
```
Get an user from the config.
### Examples
```
let user = Config.getUser(0);

console.log('User:', {
    nickname: user.nickname,
    password: user.password
});
```