class SanitizationService {
    static removeFields(data, ...fields) {
        for(const field of fields) {
            data[field] = undefined;
        }
    }
}

export default SanitizationService;