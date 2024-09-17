import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journeyRepository';
import { GroupData } from '@models';

export class GetGroupByGroupIdUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(groupId: number): Promise<GroupData | null> {
        return await this.journeyRepository.getItemByField(DB_COLLECTION_FIELDS.GROUPS.ID, groupId, DB_COLLECTION.GROUPS);
    }
}