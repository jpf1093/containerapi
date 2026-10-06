const swaggerUi = require('swagger-ui-express');

const documentation = require('./documentation');

function setupSwagger(app) {

    const options = {
        swaggerOptions: {

            responseInterceptor: (response) => {

                if (
                    response.url &&
                    response.url.includes('/api/auth/login') &&
                    response.status === 200
                ) {
                    try {
                        const body = JSON.parse(response.text);

                        if (body.token) {
                            window.ui.preauthorizeApiKey(
                                'bearerAuth',
                                body.token
                            );
                        }

                    } catch (error) {
                        console.error(
                            'Erro ao capturar token JWT',
                            error
                        );
                    }
                }

                return response;
            }
        }
    };

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(documentation, options)
    );
}

module.exports = setupSwagger;