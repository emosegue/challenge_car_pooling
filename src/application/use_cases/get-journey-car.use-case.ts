import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Journey } from '../../domain/entities';

export class GetJourneyCarByGroupIdUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(groupId: number): Promise<Journey | null> {
        return await this.journeyRepository.getItemByField(DB_COLLECTION_FIELDS.JOURNEYS.GROUP, groupId, DB_COLLECTION.JOURNEYS);
    }

}