export const forbidden = {
  description: 'Acesso a API não permitido',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}