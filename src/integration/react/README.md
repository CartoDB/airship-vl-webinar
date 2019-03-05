## Airship widget wrapper in React

This example shows a map rendered with CARTO.js and a category widget using React.

The widget from Airship is wrapped in a React component and can be used in any React app as any other component. The same pattern for wrapping this widget can be used for wrapping any other web component from Airship.

### Getting started

To run the example:

- `npm install`
- `npm start`

### Wrapping the component

The key is to add a `ref` attribute in the wrapper web component.

```
  render() {
    return (
      <as-category-widget ref={node => { this.widget = node; }} />
    );
  }
```

Then, in `componentDidMount()` you can pass the props to the component and add event listeners.

The file where it's wrapped in this example is at `src/CategoryWidget`.

### Using the component

Once you have the Airship component wrapped, you can use it as a standard React component.

```
<CategoryWidget
  heading="Business Volume"
  description="Description"
  categories={categories}
  onSelectedChanged={this.onSelectedChanged}
  showClearButton={!!filter}
/>
```
