export function clasValidate(errors: any[]): string[] {
    const constraintMessages: Record<string, (field: string, value?: any) => string> = {
        isNotEmpty: (field) => `Field '${field}' is required.`,
        isString: (field) => `Field '${field}' must be a string.`,
        isEmail: (field) => `Field '${field}' must be a valid email address.`,
        isNumber: (field) => `Field '${field}' must be a number.`,
        min: (field, value) => `Field '${field}' must be at least ${value}.`,
        max: (field, value) => `Field '${field}' must not exceed ${value}.`,
    };

    return errors.flatMap((error) =>
        Object.entries(error.constraints || {}).map(([constraint, message]) =>
            constraintMessages[constraint]?.(error.property, message) || `Field '${error.property}' has an invalid value.`
        )
    );
}
