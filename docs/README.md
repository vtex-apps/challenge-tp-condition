# Challenge Trade Policy Condition

> Challenge that checks if an user can access the current Trade Policy based on a specified condition rule.

## Usage

Add this app to your theme dependencies:

```js
// manifest.json
// ...
  "dependencies": {
    // ...
    "vtex.challenge-tp-condition": "0.x"
  }
```

Add the block `challenge.trade-policy-condition` to all pages that you want to protect as a `parent` component.

Example:

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

This component will check if the logged in user has all conditions rules specified in the Trade Policy configuration. If not the user will be redirected to `/login`. If allowed, it will render the page.

## API

`challenge.trade-policy-condition` has some props that can be set.

| Prop name                | Default value | Possible values       | Description                                                                |
| ------------------------ | ------------- | --------------------- | -------------------------------------------------------------------------- |
| redirectPath             | `/login`      | (anything)            | Path which the user will be redirected if not allowed                      |
| defaultContentVisibility | `visible`     | `visible` or `hidden` | Should the content be visible or hidden while checking the user condition? |

> _Important:_ Using `hidden` will make all the page content be rendered on the client, that is, the page will not be Server Side Rendered (SSR). That is due to the fact that this check is user-based, making it impossible to cache.
