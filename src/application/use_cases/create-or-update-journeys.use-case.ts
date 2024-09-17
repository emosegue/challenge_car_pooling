import { DB_COLLECTION, DB_COLLECTION_FIELDS } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { Car, Group, Journey } from '@entities';
import { LoggerService } from '@services';

export class CreateOrUpdateJourneysUseCase {
    private logger = LoggerService.getInstance();

    constructor(private journeyRepository: JourneyRepository) { }

    async execute(): Promise<any> {
        const cars: Car[] = await this.journeyRepository.getItemsByCondition(
            DB_COLLECTION_FIELDS.CARS.IS_AVAILABLE, true, DB_COLLECTION.CARS, DB_COLLECTION_FIELDS.CARS.SEATS);
        const groups: Group[] = await this.journeyRepository.getItemsByCondition(
            DB_COLLECTION_FIELDS.GROUPS.IS_TRAVELING, false, DB_COLLECTION.GROUPS, DB_COLLECTION_FIELDS.GROUPS.ID);

        //  For future iterations we can improve this implementation with some kind of tree to avoid O(n2).
        for (const group of groups) {
            let bestCar: Car | null = null;
            let minDifference = Infinity;

            for (const car of cars) {
                if (!bestCar) {
                    const difference = car.seats - group.people;
                    if (difference >= 0 && difference < minDifference) {
                        minDifference = difference;
                        bestCar = car;
                    }
                }
            }

            if (bestCar) {
                const newJourney: Journey = { car: bestCar.id, group: group.id }
                this.journeyRepository.insertItem(newJourney, DB_COLLECTION.JOURNEYS);
                this.journeyRepository.updateFieldItemById(DB_COLLECTION.CARS, bestCar.id, DB_COLLECTION_FIELDS.CARS.IS_AVAILABLE, false);
                this.journeyRepository.updateFieldItemById(DB_COLLECTION.GROUPS, group.id, DB_COLLECTION_FIELDS.GROUPS.IS_TRAVELING, true);
                this.logger.info(`The best car for groupId ${group.id} is the carId  ${bestCar.id}`)
                cars.splice(cars.indexOf(bestCar), 1)
            }

            if (!bestCar) {
                console.log(`There is no car available for groupId ${group.id}`)
            }

            bestCar = undefined;

        }
    }

}
