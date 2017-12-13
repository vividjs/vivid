<h1 align="center">Unstable. Still in Development</h1>

<p align="center">
  <img src="/../repo-assets/images/vivid-logo-with-text-500.png" width="200" style="text-align: center" alt="Vivid Logo"/>
</p>

---

# Vivid

Vivid is a fast, flexible, and secure template engine that provides the full JavaScript API to the developer.

## Installation

via npm

```bash
npm install vivid --save
```

## Usage

There are three types of delimiters:

#### 1. Statement: `{% statement %}`
This is where you place your regular JavaScript to be evaluated. Want to store a temporary variable, you can!

#### 2. Output: `{{ output }}`
Use this when you want something output to your result.
The is "safe by default," meaning it will escape HTML automatically.

You can also use inline helpers here to modify the output.
For example, if you don't want your HTML escaped, you would do the following: `{{raw output}}`.
While `raw` is available out of the box, you can create your own inline helpers. 

#### 3. Block Helper: `{# helperName [...arguments] #}`
For common code chunks, and to eliminate repeating syntax. [Needs reference to block helpers section]

### Basic Example:

JavaScript:
```javascript
const template = `
    <ul>
        {% this.forEach(person => { %}
            <li>{{ person.name }}</li>
        {% }); %}
    </ul>
`;


const people = [
    {name: 'Sally'},
    {name: 'Kyle'}
];

Vivid
    .compile(template)
    .render(people)
    .html('#source-container');
```

Result:
```html
<div id="source-container">
    <ul>
        <li>Sally</li>
        <li>Kyle</li>
    </ul>
</div>
```
