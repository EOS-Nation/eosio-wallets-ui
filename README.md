## .gems Wallet

> .gems Wallet React component

### Install (Browser)

```html
<!-- React -->
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>

<!-- Babel -->
<script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- .gems Wallet -->
<script crossorigin src="https://unpkg.com/@dotgems/wallet/dist/wallet.umd.development.js"></script>

<div id="wallet"></div>

<script type="text/babel">
  const { Wallet } = globalThis["@dotgems/wallet"]
  ReactDOM.render(<Wallet />, document.getElementById('root'))
</script>
```