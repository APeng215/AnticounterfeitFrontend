export default class FetchHelper {
  static backEndIP = "http://192.168.1.103:8081";
  static frontEndIP = "http://192.168.1.103:3000"

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

      return await res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static async delete(relevantPath, itemKey) {
    try {
      if (!relevantPath || !itemKey) {
        throw new Error("Both `relevantPath` and `itemKey` must be provided.");
      }

      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = `${this.backEndIP}${relevantPath}/${itemKey}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      // Handle empty responses gracefully
      return await res.json().catch(() => ({}));
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  static async put(relevantPath, data) {
    try {
      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = this.backEndIP + relevantPath;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  static #formatRelevantPath(relevantPath) {
    return relevantPath.startsWith('/') ? relevantPath : `/${relevantPath}`;
  }


}
