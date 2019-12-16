📢 Use, [contribute](https://github.com/vtex-apps/challenge-tp-condition/edit/master/docs/README.md) or open issues for this project through [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Challenge Trade Policy Condition

The Challenge Trade Policy Condition is an app responsible for verifiyng users condition to access a given store. 

## Configuration

1. Import the Challenge Trade Policy Condition app to your theme's dependencies in the `manifest.json`, for example:

```json
  dependencies: {
   "vtex.challenge-tp-condition": "0.x"
  }
```

2. Add the `challenge.trade-policy-condition` block to all pages that you want to protect as a `parent` component. For example:

```diff
 "store.home": {
   "blocks": [
     "shelf#home",
     "flex-layout.row#deals",
     "info-card#home",
     "rich-text#question",
     "rich-text#link",
     "newsletter"
   ],
+   "parent": {
+     "challenge": "challenge.trade-policy-condition"
+   }
 },
```

_You can check the block’s available props at the end of the configuration instructions._

3. In the account’s admin, use the `Condition Rule` field in the desired trade policy to define whether specific users are allowed to access that trade policy in the store, based on the profile data contained in Master Data.


![challenge-tp-condition](https://user-images.githubusercontent.com/52087100/70941978-7615a000-202c-11ea-8939-0617cec09b46.png)
_In the image above, only users whose profiles were tagged as approved will be able to access the EUA trade policy_.


| Prop name    | Type            | Description    | Default value                                                                                                                               |
| ------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | 
| `redirectPath`             | `String`     | Path which users will be redirected if they are not allowed to access the store based on the trade policy condition rule     |  `/login`                         |
| `defaultContentVisibility` | `Enum`    | Whether the store content should be visible or hidden while the app is verifying the user's condition  | `visible` or `hidden` |


- Possible values for `defaultContentVisibility`: 

| Value    |  Description    |                                                                                               
| ------------ | --------------- | 
| `visible`    | Displays the store's content while the user's condition is being verified.  | 
| `hidden`     | Hides the store's content while the user's condition is being verified. Notice: Using `hidden` will make all the page content be rendered on the client, that is, the page will not be Server Side Rendered (SSR). That is due to the fact that this verification is user-based, making it impossible to cache the pages. | 



