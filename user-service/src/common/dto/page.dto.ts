import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({
    type: () => PageMetaDto,
  })
  readonly meta: PageMetaDto;

  @ApiProperty()
  readonly extra?: Record<string, string | boolean | number>;

  constructor(
    data: T[],
    meta: PageMetaDto,
    extra?: Record<string, string | boolean | number>,
  ) {
    this.data = data;
    this.meta = meta;
    this.extra = extra;
  }
}
