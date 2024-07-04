import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray()
  readonly page: T[];

  readonly meta: PageMetaDto;

  constructor(page: T[], meta: PageMetaDto) {
    this.page = page;
    this.meta = meta;
  }
}