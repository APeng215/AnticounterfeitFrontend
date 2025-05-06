export default class FetchHelper {
  static backEndIP = "http://192.168.1.103:8081";
  static frontEndIP = "http://192.168.1.103:3000"

  static async get(relevantPath) {
    try {
      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = this.backEndIP + relevantPath;

      const res = await fetch(url, {
        credentials: 'include'
      });
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
        credentials: 'include'
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static async deleteAll(relevantPath, ids) {
    try {
      if (!relevantPath || !ids) {
        throw new Error("Both `relevantPath` and `itemKey` must be provided.");
      }

      relevantPath = this.#formatRelevantPath(relevantPath);
      const url = `${this.backEndIP}${relevantPath}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(ids)
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      // Handle empty responses gracefully
      return await res.json().catch(() => ({}));
    } catch (error) {
      console.error('DELETE request failed:', error);
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
        credentials: 'include'
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
        credentials: 'include'
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      return await res.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  static async formLogin(username, password) {
    try {
      const response = await fetch(FetchHelper.backEndIP + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // form data here, e.g.:
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      // Handle successful login (store token, set user state, etc.)
      // Then navigate to main page
      this.$router.push('/'); // or whatever your main route is
    } catch (error) {
      console.error(error);
      // optionally show error message
    }
  }

  static async logout() {
    return fetch(this.backEndIP + "/logout", {
      method: 'POST',
      credentials: 'include'
    });
  }

  static #formatRelevantPath(relevantPath) {
    return relevantPath.startsWith('/') ? relevantPath : `/${relevantPath}`;
  }


}
