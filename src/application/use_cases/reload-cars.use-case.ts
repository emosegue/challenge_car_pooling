import { DB_COLLECTION } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Car } from '../../domain/entities';
import { mapDtoToCar } from '../mappers/car.mapper';

export class ReloadCarsUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(cars: Car[]): Promise<void> {
        await this.journeyRepository.removeAllItems(DB_COLLECTION.CARS);
        await this.journeyRepository.removeAllItems(DB_COLLECTION.JOURNEYS);
        const availableCars = cars.map((car) => mapDtoToCar(car, true))
        await this.journeyRepository.insertBulkItems(availableCars, DB_COLLECTION.CARS);
        await this.journeyRepository.removeAllItems(DB_COLLECTION.GROUPS);
        await this.journeyRepository.removeAllItems(DB_COLLECTION.JOURNEYS);
    }
}