const API_URL = process.env.API_URL!;
const username = process.env.USERNAME!;
const password = process.env.PASSWORD!;

export async function getArticles() {
    const response = await fetch(`${API_URL}/abdarest/articles`,
        {
            headers: {
                Authorization:
                    "Basic" +
                    Buffer.from(`${username}:${password}`).toString("base64"),
            },
        }
    );

    const data = await response.json();
    console.debug(data);
}