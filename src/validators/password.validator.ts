
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        // Minimum length of 8 characters
        // Contains at least 1 letter
        // Contains at least 1 number
        // Contains at least 1 special character
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character.';
    }
}

export function IsStrongPassword() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: 'Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character.',
            },
            constraints: [],
            validator: PasswordValidator,
        });
    };
}
