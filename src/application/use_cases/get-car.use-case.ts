import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journeyRepository';
import { CarData } from '@models';

export class GetCarUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(carId: number): Promise<CarData | null> {
        return await this.journeyRepository.getItemByField(DB_COLLECTION_FIELDS.CARS.ID, carId, DB_COLLECTION.CARS)
    }

}