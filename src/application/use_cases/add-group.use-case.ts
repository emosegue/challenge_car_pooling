import { DB_COLLECTION } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Group } from '../../domain/entities';
import { mapDtoToGroup } from '../mappers/group.mapper';

export class AddGroupUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(data: Group): Promise<void> {
        const notTravelingGroup = mapDtoToGroup(data, false);
        await this.journeyRepository.insertItem(notTravelingGroup, DB_COLLECTION.GROUPS)
    }

}