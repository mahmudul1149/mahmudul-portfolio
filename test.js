function numbers(arr, query) {
    return arr.filter((el) => {
        return el.toLowerCase().includes(query.toLowerCase())
    })
}

function displayResults() {
    const searchInput = document.getElementById('searchInput').value;
    const colors = ['Orange', 'Red', 'Blue', 'Yellow'];
    const filteredColors = numbers(colors, searchInput);
    
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    
    if (filteredColors.length === 0) {
        resultsList.innerHTML = '<li>No results found</li>';
    } else {
        filteredColors.forEach(color => {
            const listItem = document.createElement('li');
            listItem.textContent = color;
            resultsList.appendChild(listItem);
        });
    }
}

// Initialize the display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayResults();
    document.getElementById('searchInput').addEventListener('input', displayResults);
});
