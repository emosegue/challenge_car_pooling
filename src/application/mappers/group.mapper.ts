import { Group } from '@entities';
import { GroupDto } from '@dtos';

export function mapGroupToDto(group: Group): GroupDto {
    return {
        id: group.id,
        people: group.people,
    };
}

export function mapDtoToGroup(groupDto: GroupDto, isTraveling: boolean): Group {
    return {
        id: groupDto.id,
        people: groupDto.people,
        is_traveling: isTraveling
    };
}