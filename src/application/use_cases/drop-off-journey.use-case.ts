import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Journey } from '@entities';

export class DropOffJourneyUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(groupId: number): Promise<void> {
        const journey: Journey = await this.journeyRepository.getItemByField<Journey>(DB_COLLECTION_FIELDS.JOURNEYS.GROUP, groupId, DB_COLLECTION.JOURNEYS);
        await this.journeyRepository.removeItemByField(DB_COLLECTION_FIELDS.JOURNEYS.GROUP, groupId, DB_COLLECTION.JOURNEYS);
        await this.journeyRepository.removeItemByField(DB_COLLECTION_FIELDS.GROUPS.ID, groupId, DB_COLLECTION.GROUPS);
        await this.journeyRepository.updateFieldItemById(DB_COLLECTION.CARS, journey.car, DB_COLLECTION_FIELDS.CARS.IS_AVAILABLE, true);
    }
}