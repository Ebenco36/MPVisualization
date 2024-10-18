export function getKeyList(listOfObjects) {
    if (listOfObjects.length > 0) {
        // Get the keys from the first object in the list
        const firstObject = listOfObjects[0];
        const keys = Object.keys(firstObject);
        return keys
    } else {
        return []
    }
}

export const joinStringArray = (input) => {
    if (typeof input === 'string') {
        return input; // If input is already a string, return it
    } else if (Array.isArray(input)) {
        // If input is an array, join its string elements
        return input.filter(item => typeof item === 'string').join('');
    } else {
        // Handle other types of input (optional)
        return ''; // Return empty string if input is neither string nor array
    }
};

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}