import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';

export class DropOffJourneyUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(groupId: number): Promise<void> {
        await this.journeyRepository.removeItemByField(DB_COLLECTION_FIELDS.JOURNEYS.GROUP, groupId, DB_COLLECTION.JOURNEYS);
    }

}