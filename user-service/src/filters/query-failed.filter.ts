import { STATUS_CODES } from 'node:http';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { findKey } from 'lodash';
import { QueryFailedError } from 'typeorm';

import { MetaResponseDto, ResponseDto } from '../common/dto/response.dto';
import { CONSTRAINT_ERRORS, ERROR_SYSTEM } from './constraint-errors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  private readonly logger = new Logger(QueryFailedFilter.name);

  constructor(public reflector: Reflector) {}

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(status);
    this.logger.error(STATUS_CODES[status]);
    const metaResponseDto = new MetaResponseDto(
      status,
      STATUS_CODES[status],
      exception.constraint ??
        findKey(CONSTRAINT_ERRORS, (value) => value === ERROR_SYSTEM),
    );

    response.status(status).json(new ResponseDto(null, metaResponseDto));
  }
}
