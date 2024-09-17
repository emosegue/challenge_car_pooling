import { DB_COLLECTION } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journeyRepository';
import { CarData, GroupData } from '@models';

export class AddGroupUseCase {
    constructor(private journeyRepository: JourneyRepository) { }

    async execute(data: GroupData): Promise<void> {
        await this.journeyRepository.insertItem(data, DB_COLLECTION.GROUPS)
    }

}