const createUser = async (client, user) => {
  const query = `
        INSERT INTO users (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;

  const values = [user.email, user.password, user.empId];

  const result = await client.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUser,
};
