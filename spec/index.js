// require all `project/test/src/components/**/index.js`
const testsContext = require.context('./', true, /[a-z]+\.spec\.js$/i);

testsContext.keys().forEach(testsContext);

// require all `project/src/components/**/index.js`
const componentsContext = require.context('../src', true, /index\.js$/);

componentsContext.keys().forEach(componentsContext);