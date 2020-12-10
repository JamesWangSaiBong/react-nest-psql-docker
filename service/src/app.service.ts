import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './app.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!!';
  }

  async saveTest(data: { title: string }) {
    let entry = await this.testRepository.create(data);
    await this.testRepository.save(entry);

    return entry;
  }

  async getTestById(id: number) {
    let entry = await this.testRepository.findOne(id);

    return entry;
  }

  async getTestsByTitle(title: string) {
    let entry = await this.testRepository.find({ title });

    return entry;
  }

  async getAllTests() {
    let entries = await this.testRepository.find();

    return entries;
  }
}
