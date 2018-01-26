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

export const adminPost = (that, url, body) =>
  new Promise((resolve, reject) => {
    const adminToken = that.props.auth;

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
          return that.props.updateAdminToken(res.token).then(() => {
            resolve(res);
          });
        }

        throw new Error('No admin token');
      })
      .catch((error) => {
        that.props.updateAdminToken('');
        reject(error);
      });
  });

export const adminGet = (that, url, body) =>
  new Promise((resolve, reject) => {
    const adminToken = that.props.auth;

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
          return that.props.updateAdminToken(res.token).then(() => {
            resolve(res);
          });
        }

        throw new Error('No admin token');
      })
      .catch((error) => {
        that.props.updateAdminToken('');
        reject(error);
      });
  });

export const checkAdmin = that =>
  new Promise((resolve, reject) => {
    const adminToken = that.props.auth;

    if (!adminToken) return reject(new Error('No admin token'));

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
          return that.props.updateAdminToken(token).then(resolve);
        }

        const errorMessage = error || 'Unknown error';
        throw new Error(errorMessage);
      })
      .catch((error) => {
        that.props.updateAdminToken('');
        reject(error);
      });
  });
