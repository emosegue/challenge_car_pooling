import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journeyRepository';
import { JourneyData } from '@models';

export class GetJourneyCarByGroupIdUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(groupId: number): Promise<JourneyData | null> {
        return await this.journeyRepository.getItemByField(DB_COLLECTION_FIELDS.JOURNEYS.GROUP, groupId, DB_COLLECTION.JOURNEYS);
    }

}