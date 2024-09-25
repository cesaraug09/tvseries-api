import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { TVSeries } from './series.model';
import { join } from 'path';

const dataFilePath = join(__dirname, '../../data/series.json');

@Injectable()
export class SeriesService {
  private data: TVSeries[];

  constructor() {
    this.readJsonFile();
  }

  private readJsonFile(): void {
    this.data = JSON.parse(readFileSync(dataFilePath, 'utf8')) as TVSeries[];
  }

  findOne(id: string): any {
    const serie = this.data.find((item) => item.id === Number(id));
    if (!serie) {
      throw new NotFoundException(`Série com ID ${id} não encontrada`);
    }
    return serie;
  }

  findByTitle(title: string, pagina: number, limite: number) {
    const filtered = title
      ? this.data.filter((series) =>
          series.titulo.toLowerCase().includes(title.toLowerCase()),
        )
      : this.data;
    const start = (pagina - 1) * limite;
    const end = start + limite;
    return { total: filtered.length, series: filtered.slice(start, end) };
  }
}
