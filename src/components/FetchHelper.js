export default class FetchHelper {
  static backEndIP = "http://localhost:8081";
  static async get(relevantPath) {
    try {
      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = this.backEndIP + relevantPath;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static async post(relevantPath, data) {
    try {
      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = this.backEndIP + relevantPath;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return res;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static #formatRelevantPath(relevantPath) {
    return relevantPath.startsWith('/') ? relevantPath : `/${relevantPath}`;
  }


}
