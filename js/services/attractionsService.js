export const fetchAttractions = async () => {
    // Simulate network delay for realistic experience
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch('data/attractions.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, 800);
    });
};
