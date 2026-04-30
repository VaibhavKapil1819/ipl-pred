const apiKey = "AIzaSyBm2DYhmnlUbeeqrYiB0g_uMqGF00MwZ3o";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

listModels();
