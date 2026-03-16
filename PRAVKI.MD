ПРАВКИ ОТ МЕНЯ

1) НЕЛЬЗЯ КЛИЕНТА ДОБАВЛЯТЬ ЧЕРЕЗ КОНТАКТЫ 
2) ТГ И НОМЕР ЭТО РАЗНОЕ БЛЯТЬ 
3) НЕУДОБНО ВНОСИТЬ ДАННЫЕ 
4) НЕУДОБНО РЕДАКТИРОВАТЬ 
5) ШРИФТЫ НЕ ТЕ
6) СТИЛИ НЕ ОТ MATERIAL DESIGN - ВОТ README ОТТУДА - 


Quick start
CDN
For fast prototyping, we recommend using esm.run, a CDN that allows you to use @material/web without installing and building from NPM.

<head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
  </script>
  <script type="module">
    import '@material/web/all.js';
    import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  </script>
</head>
<body>
  <h1 class="md-typescale-display-medium">Hello Material!</h1>
  <form>
    <p class="md-typescale-body-medium">Check out these controls in a form!</p>
    <md-checkbox></md-checkbox>
    <div>
      <md-radio name="group"></md-radio>
      <md-radio name="group"></md-radio>
      <md-radio name="group"></md-radio>
    </div>
    <md-outlined-text-field label="Favorite color" value="Purple"></md-outlined-text-field>
    <md-outlined-button type="reset">Reset</md-outlined-button>
  </form>
  <style>
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  </style>
</body>
For production, follow the install and build steps below.

Install
Install Material web components using npm and node.

npm install @material/web
Import
Import element definitions from @material/web/<component>/<component-variant>.js.

// index.js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
Usage
Use the <component-name> tag in HTML markup. Refer to the component docs for more guidance on using each component.

Playground

<script type="module" src="./index.js"></script>

<label>
  Material 3
  <md-checkbox checked></md-checkbox>
</label>

<md-outlined-button>Back</md-outlined-button>
<md-filled-button>Next</md-filled-button>
Building
Material web components uses bare module specifiers that must be resolved with tools until import maps are adopted.

We recommend following lit.dev's modern build for production for a more in-depth build guide.

Rollup quick start
For a quick start, we recommend using Rollup to resolve bare module specifiers into a bundled file.

Install Rollup and a plugin to resolve bare module specifiers.

npm install rollup @rollup/plugin-node-resolve
Create a bundle from an entrypoint index.js file and use it in a <script> "src" attribute.

npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
<script src="./bundle.js"></script>