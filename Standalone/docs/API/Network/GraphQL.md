## Methods
```javascript
GraphQL.reload();
```
```javascript
String GraphQL.get(Type type, String name, String[] fragments);
```
```javascript
String GraphQL.getEnum(String name);
```
```javascript
String GraphQL.getFragment(String name);
```
```javascript
String GraphQL.getQuery(String name, String[] fragments);
```
```javascript
String GraphQL.getMutation(String name, String[] fragments);
```
```javascript
String GraphQL.getSubscription(String name, String[] fragments);
```
```javascript
Promise GraphQL.call(GraphBuilder builder);
```

## Types
```javascript
Type.Query
Type.Mutation
Type.Subscription
```