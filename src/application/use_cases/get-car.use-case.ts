import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Car } from '../../domain/entities';
import { CarDto } from '@dtos';
import { mapCarToDto } from '../mappers/car.mapper';

export class GetCarUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(carId: number): Promise<CarDto | null> {
        const car: Car = await this.journeyRepository.getItemByField(DB_COLLECTION_FIELDS.CARS.ID, carId, DB_COLLECTION.CARS)
        return mapCarToDto(car);
    }

}