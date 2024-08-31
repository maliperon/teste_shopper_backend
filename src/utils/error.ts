export const handleErrorResponse = (error: unknown, defaultMessage: string) => {
    let statusCode = 500;
    let errorCode = 'SERVER_ERROR';
    let errorDescription = defaultMessage;
  
    if (error instanceof Error) {
      switch (error.message) {
        case 'INVALID_DATA':
          statusCode = 400;
          errorCode = error.message;
          errorDescription = 'Os dados fornecidos no corpo da requisição são inválidos';
          break;
        case 'DOUBLE_REPORT':
          statusCode = 409;
          errorCode = error.message;
          errorDescription = 'Leitura do mês já realizada';
          break;
        case 'MEASURE_NOT_FOUND':
          statusCode = 404;
          errorCode = error.message;
          errorDescription = 'Leitura não encontrada';
          break;
        case 'CONFIRMATION_DUPLICATE':
          statusCode = 409;
          errorCode = error.message;
          errorDescription = 'Leitura do mês já realizada';
          break;
        case 'MEASURES_NOT_FOUND':
          statusCode = 404;
          errorCode = error.message;
          errorDescription = 'Nenhuma leitura encontrada';
          break;
        case 'INVALID_NUMBER':
          statusCode = 422;
          errorCode = error.message;
          errorDescription = 'Falha ao transformar em valor numérico';
          break;
        case 'IMAGE_FAILED':
          statusCode = 422;
          errorCode = error.message;
          errorDescription = 'Falha ao processar a imagem';
          break;
      }
    }
  
    return { statusCode, errorCode, errorDescription };
};
  