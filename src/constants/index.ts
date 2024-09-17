import { ids } from "webpack";

const HTTP_STATUS_CODE = {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

const DB_COLLECTION = {
    CARS: 'cars',
    JOURNEYS: 'journeys',
    GROUPS: 'groups'
}

const DB_COLLECTION_FIELDS = {
    CARS: {
        ID: 'id',
        SEATS: 'seats',
        IS_AVAILABLE: 'is_available'
    },
    GROUPS: {
        ID: 'id',
        PEOPLE: 'people',
        IS_TRAVELING: 'is_traveling'
    },
    JOURNEYS: {
        CAR: 'people',
        GROUP: 'group'
    }

}

export { HTTP_STATUS_CODE, DB_COLLECTION, DB_COLLECTION_FIELDS };