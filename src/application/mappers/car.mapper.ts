import { Car } from '@entities';
import { CarDto } from '@dtos';

export function mapCarToDto(car: Car): CarDto {
    return {
        id: car.id,
        seats: car.seats
    };
}

export function mapDtoToCar(carDto: CarDto, isAvailable: boolean): Car {
    return {
        id: carDto.id,
        seats: carDto.seats,
        is_available: isAvailable
    };
}