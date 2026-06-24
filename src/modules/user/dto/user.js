const userDto = (user) => {

    if(!user) return null;

    return {
        id: user.id,
        email: user.email,
        password: user.password || '',
        role: user.role,
        permissions: user.permissions
    };

}

module.exports = userDto;