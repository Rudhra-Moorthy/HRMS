const pool = require('../../../config/db');
const { hashPassword } = require('../../utils/hash');
const userDto = require('../dto/user');
const userRepo = require('../repository/userRepo');
// Get user by email
const getUserByEmail = async (email) => {
    
    const userResult = await pool.query(
       `SELECT u.id, u.email, u.password, r.name AS role,  ARRAY_AGG(DISTINCT p.name) AS permissions 
        FROM users u
        JOIN roles r 
            ON u.role_id = r.id
        JOIN role_permissions rp 
            ON r.id = rp.role_id
        JOIN permissions p 
            ON rp.permission_id = p.id
        WHERE u.email = $1
        GROUP BY u.id, u.email, u.password, r.name`,
        [email]
    );

    return userDto(userResult.rows[0]);
}

const createUser = async (client, user) => {

    try {

        await userRepo.createUser(client, user);

    } catch(err) {
        throw err;
    }
    
}

// Get user by Id
const getUserById = async (id) => {

    const result = await pool.query(
       `SELECT u.id, u.email, r.name AS role, ARRAY_AGG(DISTINCT p.name) AS permissions
        FROM users u
        JOIN roles r
            ON u.role_id = r.id
        JOIN role_permissions rp
            ON r.id = rp.role_id
        JOIN permissions p
            ON rp.permission_id = p.id
        WHERE u.id = $1
        GROUP BY u.id, u.email, r.name 
       `,
        [id]
    );

    return userDto(result.rows[0]);
}

// Store refresh Token
const saveRefreshToken = async (id, refreshToken) => {

    await pool.query(
       `INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '7 days')
       `,
       [id, refreshToken]
    );

}

// find the refresh token
const findRefreshToken = async (token) => {

    const result = await pool.query(
       `SELECT * FROM refresh_tokens
        WHERE token = $1
        
       `,
       [token]
    );

    return result.rows[0];
}

// Delete the refresh token
const deleteRefreshToken = async (token) => {
    await pool.query(
       `DELETE FROM refresh_tokens
        WHERE token = $1
       `,
       [token]
    );
}

module.exports = {
    getUserByEmail,
    saveRefreshToken,
    findRefreshToken,
    getUserById,
    deleteRefreshToken,
    createUser,
}
