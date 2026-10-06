const documentation = {
    openapi: '3.0.0',

    info: {
        title: 'Container API',
        version: '1.0.0',
        description: 'API para gerenciamento de containers de lixo'
    },

    servers: [
    {
        url: process.env.API_URL || 'http://localhost:3000',
        description: process.env.API_URL
            ? 'Servidor de produção'
            : 'Servidor de desenvolvimento'
    }
],

    tags: [
        {
            name: 'Auth',
            description: 'Autenticação'
        },
        {
            name: 'Users',
            description: 'Gerenciamento de usuários'
        },
        {
            name: 'Collection Points',
            description: 'Gerenciamento de pontos de coleta'
        },
        {
            name: 'Containers',
            description: 'Gerenciamento de containers'
        },
        {
            name: 'Container Allocations',
            description: 'Gerenciamento de alocações de containers'
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },

        schemas: {
            // =====================================================
            // USER
            // =====================================================

            User: {
                type: 'object',

                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },

                    name: {
                        type: 'string',
                        example: 'João Silva'
                    },

                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'joao@email.com'
                    },

                    role: {
                        type: 'string',
                        enum: [
                            'ADMIN',
                            'OPERATOR'
                        ],
                        example: 'OPERATOR'
                    },

                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    },

                    updated_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            // =====================================================
            // COLLECTION POINT
            // =====================================================

            CollectionPoint: {
                type: 'object',

                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },

                    name: {
                        type: 'string',
                        example: 'Ponto Centro 01'
                    },

                    address: {
                        type: 'string',
                        example: 'Rua Exemplo, 123'
                    },

                    latitude: {
                        type: 'number',
                        format: 'double',
                        example: -30.034647
                    },

                    longitude: {
                        type: 'number',
                        format: 'double',
                        example: -51.217658
                    },

                    accuracy: {
                        type: 'number',
                        format: 'double',
                        nullable: true,
                        example: 8.35
                    },

                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    },

                    updated_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            // =====================================================
            // CONTAINER
            // =====================================================

            Container: {
                type: 'object',

                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },

                    code: {
                        type: 'string',
                        example: 'CT-001'
                    },

                    status: {
                        type: 'string',

                        enum: [
                            'EM_USO',
                            'EM_TRANSITO',
                            'ESVAZIANDO',
                            'DISPONIVEL',
                            'MANUTENCAO',
                            'INATIVO'
                        ],

                        example: 'EM_USO'
                    },

                    fill_level: {
                        type: 'number',
                        format: 'double',
                        nullable: true,
                        minimum: 0,
                        maximum: 100,
                        example: 62
                    },

                    fill_status: {
                        type: 'string',
                        nullable: true,

                        enum: [
                            'VAZIO',
                            'BAIXO',
                            'MEDIO',
                            'ALTO',
                            'CHEIO'
                        ],

                        example: 'MEDIO'
                    },

                    last_reading_at: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2026-09-29T21:00:00'
                    },

                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    },

                    updated_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            // =====================================================
            // CONTAINER ALLOCATION
            // =====================================================

            ContainerAllocation: {
                type: 'object',

                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },

                    container_id: {
                        type: 'integer',
                        example: 1
                    },

                    container_code: {
                        type: 'string',
                        example: 'CT-001'
                    },

                    collection_point_id: {
                        type: 'integer',
                        example: 2
                    },

                    collection_point_name: {
                        type: 'string',
                        example: 'Ponto Centro 01'
                    },

                    start_at: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-09-22T10:00:00'
                    },

                    end_at: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: null
                    },

                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            }
        }
    },

    paths: {
        // =====================================================
        // AUTH
        // =====================================================

        '/api/auth/login': {
            post: {
                tags: ['Auth'],

                summary: 'Realizar login',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'email',
                                    'password'
                                ],

                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'adm@gmail.com'
                                    },

                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        example: '1234'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Login realizado com sucesso'
                    },

                    400: {
                        description: 'Email e senha são obrigatórios'
                    },

                    401: {
                        description: 'Email ou senha inválidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // =====================================================
        // USERS
        // =====================================================

        '/api/users': {
            get: {
                tags: ['Users'],

                summary: 'Listar usuários',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de usuários',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',

                                    items: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Users'],

                summary: 'Cadastrar usuário',

                description: 'Disponível apenas para ADMIN. Novos usuários recebem OPERATOR como role padrão.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'name',
                                    'email',
                                    'password'
                                ],

                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'Maria Silva'
                                    },

                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'maria@email.com'
                                    },

                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        example: '123456'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Usuário cadastrado com sucesso'
                    },

                    400: {
                        description: 'Dados obrigatórios não informados'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    409: {
                        description: 'Email já cadastrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/api/users/{id}': {
            get: {
                tags: ['Users'],

                summary: 'Buscar usuário pelo ID',

                description: 'OPERATOR pode consultar a própria conta. ADMIN pode consultar qualquer usuário.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuário encontrado',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Sem permissão para acessar este usuário'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Users'],

                summary: 'Editar usuário',

                description: 'OPERATOR pode editar apenas a própria conta. ADMIN pode editar qualquer usuário. A senha é opcional. A role não pode ser alterada por este endpoint.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'name',
                                    'email'
                                ],

                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'Maria Silva'
                                    },

                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'maria@email.com'
                                    },

                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        nullable: true,
                                        example: 'novaSenha123'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Usuário atualizado com sucesso'
                    },

                    400: {
                        description: 'Nome e email são obrigatórios'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Sem permissão para editar este usuário'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    409: {
                        description: 'Email já cadastrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Users'],

                summary: 'Remover usuário',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    204: {
                        description: 'Usuário removido com sucesso'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/api/users/{id}/role': {
            patch: {
                tags: ['Users'],

                summary: 'Alterar role do usuário',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'role'
                                ],

                                properties: {
                                    role: {
                                        type: 'string',

                                        enum: [
                                            'ADMIN',
                                            'OPERATOR'
                                        ],

                                        example: 'ADMIN'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Role atualizada com sucesso'
                    },

                    400: {
                        description: 'Role inválida'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // =====================================================
        // COLLECTION POINTS
        // =====================================================

        '/api/collection-points': {
            get: {
                tags: ['Collection Points'],

                summary: 'Listar pontos de coleta',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de pontos de coleta',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',

                                    items: {
                                        $ref: '#/components/schemas/CollectionPoint'
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Collection Points'],

                summary: 'Cadastrar ponto de coleta',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'name',
                                    'address',
                                    'latitude',
                                    'longitude'
                                ],

                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'Ponto Centro 01'
                                    },

                                    address: {
                                        type: 'string',
                                        example: 'Rua Exemplo, 123'
                                    },

                                    latitude: {
                                        type: 'number',
                                        format: 'double',
                                        example: -30.034647
                                    },

                                    longitude: {
                                        type: 'number',
                                        format: 'double',
                                        example: -51.217658
                                    },

                                    accuracy: {
                                        type: 'number',
                                        format: 'double',
                                        nullable: true,
                                        example: 8.35
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Ponto de coleta criado com sucesso'
                    },

                    400: {
                        description: 'Dados inválidos'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/api/collection-points/{id}': {
            get: {
                tags: ['Collection Points'],

                summary: 'Buscar ponto de coleta pelo ID',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    200: {
                        description: 'Ponto de coleta encontrado',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CollectionPoint'
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    404: {
                        description: 'Ponto de coleta não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Collection Points'],

                summary: 'Editar ponto de coleta',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'name',
                                    'address',
                                    'latitude',
                                    'longitude'
                                ],

                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'Ponto Centro 01'
                                    },

                                    address: {
                                        type: 'string',
                                        example: 'Rua Exemplo, 123'
                                    },

                                    latitude: {
                                        type: 'number',
                                        format: 'double',
                                        example: -30.034647
                                    },

                                    longitude: {
                                        type: 'number',
                                        format: 'double',
                                        example: -51.217658
                                    },

                                    accuracy: {
                                        type: 'number',
                                        format: 'double',
                                        nullable: true,
                                        example: 8.35
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Ponto de coleta atualizado com sucesso'
                    },

                    400: {
                        description: 'Dados inválidos'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Ponto de coleta não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Collection Points'],

                summary: 'Remover ponto de coleta',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    204: {
                        description: 'Ponto de coleta removido com sucesso'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Ponto de coleta não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // =====================================================
        // CONTAINERS
        // =====================================================

        '/api/containers': {
            get: {
                tags: ['Containers'],

                summary: 'Listar containers',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de containers',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',

                                    items: {
                                        $ref: '#/components/schemas/Container'
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Containers'],

                summary: 'Cadastrar container',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'code'
                                ],

                                properties: {
                                    code: {
                                        type: 'string',
                                        example: 'CT-001'
                                    },

                                    status: {
                                        type: 'string',

                                        enum: [
                                            'EM_USO',
                                            'EM_TRANSITO',
                                            'ESVAZIANDO',
                                            'DISPONIVEL',
                                            'MANUTENCAO',
                                            'INATIVO'
                                        ],

                                        example: 'DISPONIVEL'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Container cadastrado com sucesso',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Container'
                                }
                            }
                        }
                    },

                    400: {
                        description: 'Código obrigatório ou status inválido'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    409: {
                        description: 'Código de container já cadastrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/api/containers/{id}': {
            get: {
                tags: ['Containers'],

                summary: 'Buscar container pelo ID',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    200: {
                        description: 'Container encontrado',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Container'
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    404: {
                        description: 'Container não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Containers'],

                summary: 'Editar container',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'code',
                                    'status'
                                ],

                                properties: {
                                    code: {
                                        type: 'string',
                                        example: 'CT-001'
                                    },

                                    status: {
                                        type: 'string',

                                        enum: [
                                            'EM_USO',
                                            'EM_TRANSITO',
                                            'ESVAZIANDO',
                                            'DISPONIVEL',
                                            'MANUTENCAO',
                                            'INATIVO'
                                        ],

                                        example: 'EM_USO'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Container atualizado com sucesso',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Container'
                                }
                            }
                        }
                    },

                    400: {
                        description: 'Código e status obrigatórios ou status inválido'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Container não encontrado'
                    },

                    409: {
                        description: 'Código de container já cadastrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Containers'],

                summary: 'Remover container',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    204: {
                        description: 'Container removido com sucesso'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Container não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // =====================================================
        // CONTAINER FILL LEVEL
        // =====================================================

        '/api/containers/{id}/fill-level': {
            patch: {
                tags: ['Containers'],

                summary: 'Atualizar nível de preenchimento do container',

                description: 'Atualiza o percentual de preenchimento, calcula automaticamente a classificação e registra a data/hora da leitura.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'fill_level'
                                ],

                                properties: {
                                    fill_level: {
                                        type: 'number',
                                        format: 'double',
                                        minimum: 0,
                                        maximum: 100,
                                        example: 62
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Nível de preenchimento atualizado com sucesso',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Container'
                                }
                            }
                        }
                    },

                    400: {
                        description: 'Nível de preenchimento deve estar entre 0 e 100'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Container não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // =====================================================
        // CONTAINER ALLOCATIONS
        // =====================================================

        '/api/container-allocations': {
            get: {
                tags: ['Container Allocations'],

                summary: 'Listar alocações de containers',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de alocações',

                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',

                                    items: {
                                        $ref: '#/components/schemas/ContainerAllocation'
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Container Allocations'],

                summary: 'Cadastrar alocação',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'container_id',
                                    'collection_point_id'
                                ],

                                properties: {
                                    container_id: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    collection_point_id: {
                                        type: 'integer',
                                        example: 2
                                    },

                                    start_at: {
                                        type: 'string',
                                        format: 'date-time',
                                        nullable: true,
                                        example: '2026-09-22T10:00:00'
                                    },

                                    end_at: {
                                        type: 'string',
                                        format: 'date-time',
                                        nullable: true,
                                        example: null
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Alocação criada com sucesso',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ContainerAllocation'
                                }
                            }
                        }
                    },

                    400: {
                        description: 'Dados obrigatórios não informados ou datas inválidas'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Container ou ponto de coleta não encontrado'
                    },

                    409: {
                        description: 'Container já possui uma alocação ativa'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/api/container-allocations/{id}': {
            get: {
                tags: ['Container Allocations'],

                summary: 'Buscar alocação pelo ID',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    200: {
                        description: 'Alocação encontrada',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ContainerAllocation'
                                }
                            }
                        }
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    404: {
                        description: 'Alocação não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Container Allocations'],

                summary: 'Editar alocação',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'container_id',
                                    'collection_point_id',
                                    'start_at'
                                ],

                                properties: {
                                    container_id: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    collection_point_id: {
                                        type: 'integer',
                                        example: 2
                                    },

                                    start_at: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2026-09-22T10:00:00'
                                    },

                                    end_at: {
                                        type: 'string',
                                        format: 'date-time',
                                        nullable: true,
                                        example: '2026-09-22T15:00:00'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Alocação atualizada com sucesso',

                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ContainerAllocation'
                                }
                            }
                        }
                    },

                    400: {
                        description: 'Dados obrigatórios não informados ou datas inválidas'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Alocação, container ou ponto de coleta não encontrado'
                    },

                    409: {
                        description: 'Container já possui outra alocação ativa'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Container Allocations'],

                summary: 'Remover alocação',

                description: 'Disponível apenas para ADMIN.',

                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        }
                    }
                ],

                responses: {
                    204: {
                        description: 'Alocação removida com sucesso'
                    },

                    401: {
                        description: 'Token inválido ou não informado'
                    },

                    403: {
                        description: 'Acesso permitido apenas para administradores'
                    },

                    404: {
                        description: 'Alocação não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = documentation;