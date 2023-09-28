const apiKey= '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'

const maxImages = 10;
let selectedImageNumber = null;

// function to generate number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to disable generate button while loading
function disableGenerateButton() {
    document.getElementById('generate').disabled = true;
}

// Function to enable generate button after it is pressed
function enableGenerateButton() {
    document.getElementById('generate').disabled = false;
}

// Function to clear image grid
function clearImageGrid() {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';
}

// Function to generate images
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    const imageUrls = [];

    for(let i = 0; i < maxImages; i++) {
        // Generate a random number between 1 and 10000 and append it to the prompt
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // We added a random number to prompt to get different results each time   
        const response = await fetch ("https://api-inference.huggingface.co/models/prompthero/openjourney",
        {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt }),
        }
    );

    if (!response.ok) {
        alert("Failed to generate images");
    };

    const blob= await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    imageUrls.push(imgUrl);

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt= `art-${i + 1}`;
    img.onclick = () => downloadImage(imgUrl, i);
    document.getElementById('image-grid').appendChild(img);

    }   

    loading.style.display = 'none';
    enableGenerateButton();

    selectedImageNumber = null; //Reset the selected image number

}

document.getElementById('generate').addEventListener('click', () =>{
    const input = document.getElementById('user-prompt').value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}