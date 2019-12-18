📢 Use this project, [contribute](https://github.com/vtex-apps/challenge-tp-condition) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Challenge Trade Policy Condition

This component will check if the logged in user has all conditions rules specified in the Trade Policy configuration. If the user is not logged in they will be redirected to `redirectPath`. If the user is logged in but not authorized, they will be redirected to `forbiddenRedirectPath`. If allowed, it will render the page.

## Configuration

1. Import the app to your theme's dependencies in the `manifest.json`, for example:

```json
  "dependencies": {
    // ...
    "vtex.challenge-tp-condition": "0.x"
  }
```

2. Add the block `challenge.trade-policy-condition` to all pages that you want to protect as a `parent` component:

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

| Prop name                | Default value | Possible values       | Description                                                                |
| ------------------------ | ------------- | --------------------- | -------------------------------------------------------------------------- |
| redirectPath             | `/login`      | (anything)            | Path which the not logged in user will be redirected                       |
| forbiddenRedirectPath    | `/login`      | (anything)            | Path which the logged in user will be redirected if not allowed            |
| defaultContentVisibility | `visible`     | `visible` or `hidden` | Should the content be visible or hidden while checking the user condition? |

> _Important:_ Using `hidden` will make all the page content be rendered on the client, that is, the page will not be Server Side Rendered (SSR). That is due to the fact that this check is user-based, making it impossible to cache.
