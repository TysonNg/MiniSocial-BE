export class SearchUserDto {
    query: {
        match: {
            name: {
                query: string;
                fuzziness: string;
            };
        };
    };
    _source: string[];
}