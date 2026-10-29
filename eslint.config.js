'use strict';

var globals = require('globals');

module.exports = [{
    files: ['src/**/*.js'],
    languageOptions: {
        ecmaVersion: 2015,
        sourceType: 'script',
        globals: Object.assign({}, globals.browser, globals.node, {
            angular: 'readonly',
            $: 'readonly',
            jQuery: 'readonly'
        })
    },
    rules: {
        'no-undef': 'error',
        'no-unreachable': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-unexpected-multiline': 'error',
        'valid-typeof': 'error',
        'no-eval': 'error'
    }
}];
