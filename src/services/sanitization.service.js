class SanitizationService {
    static getSanitizer(...fields) {
        return (data) => {
            for(const field of fields) {
                data[field] = undefined;
            }
        } ;
    }
}

export default SanitizationService;