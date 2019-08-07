const swaggerJsdoc = require('swagger-jsdoc');

const DisableTryItOutPlugin = function() {
    return {
      statePlugins: {
        spec: {
          wrapSelectors: {
            allowTryItOutFor: () => () => false
          }
        }
      }
    }
  }

const options = {
    swaggerDefinition: {
        components: {},
        info: {
            title: 'Atlas API',
            version: '1.0.0',
            description: 'DSM Central API',
            customCss: '.try-out__btn {display: none}'
        },
    },
    apis: ['./config/models.yaml', './routes/auth.js', './routes/api/cw/endpoints/*.js'],
}

module.exports = swaggerJsdoc(options);