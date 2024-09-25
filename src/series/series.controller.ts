import { Controller, Get, Param, Query } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findByTitle(
    @Query('titulo') title: string,
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10,
  ) {
    const { total, series } = this.seriesService.findByTitle(
      title,
      pagina,
      limite,
    );
    return {
      total,
      data: series,
    };
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    const serie = this.seriesService.findOne(id);
    return {
      id,
      data: serie,
    };
  }
}
