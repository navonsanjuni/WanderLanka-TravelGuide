// Simple client side form validators for potential future inputs
export const validators = {
    isRequired: (value) => {
        return value !== null && value.trim() !== '' ? null : 'This field is required';
    },
    isEmail: (value) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase()) ? null : 'Invalid email address';
    }
};
