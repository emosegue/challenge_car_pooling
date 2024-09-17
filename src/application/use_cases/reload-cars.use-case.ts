import { DB_COLLECTION } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journeyRepository';
import { CarData } from '@models';

export class ReloadCarsUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(cars: CarData[]): Promise<void> {
        await this.journeyRepository.removeAllItems(DB_COLLECTION.CARS);
        await this.journeyRepository.insertBulkItems(cars, DB_COLLECTION.CARS);
    }
}