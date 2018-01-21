export const handleFetchError = (res) => {
  if (res.status === 500) throw new Error(500);
  return res;
};

export const authenticatedPost = (url, body) =>
  new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');

    if (!token) return reject(new Error('Not logged in'));

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(handleFetchError)
      .then(res => res.json())
      .then(resolve)
      .catch(reject);
  });

export const adminPost = (url, body) =>
  new Promise((resolve, reject) => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) return reject(new Error('Not logged in'));

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: adminToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(handleFetchError)
      .then(res => res.json())
      .then((res) => {
        if (res.token) {
          localStorage.setItem('adminToken', res.token);
          return resolve(res);
        }

        throw new Error('No admin token');
      })
      .catch(reject);
  });

export const adminGet = (url, body) =>
  new Promise((resolve, reject) => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) return reject(new Error('Not logged in'));

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: adminToken,
        'Content-Type': 'application/json',
      },
    })
      .then(handleFetchError)
      .then(res => res.json())
      .then((res) => {
        if (res.token) {
          localStorage.setItem('adminToken', res.token);
          return resolve(res);
        }

        throw new Error('No admin token');
      })
      .catch(reject);
  });

export const checkAdmin = () =>
  new Promise((resolve, reject) => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      throw new Error('No admin token');
    }

    fetch('/check-admin-token', {
      method: 'POST',
      headers: {
        Authorization: adminToken,
        'Content-Type': 'application/json',
      },
    })
      .then(handleFetchError)
      .then(res => res.json())
      .then((res) => {
        const { success, token, error } = res;

        if (success && token) {
          localStorage.setItem('adminToken', token);
          return resolve(true);
        }
        const errorMessage = error || 'Unknown error';

        throw new Error(errorMessage);
      })
      .catch(reject);
  });
